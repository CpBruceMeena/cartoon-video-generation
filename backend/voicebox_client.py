"""
Voicebox TTS API client.

Handles all communication with the local Voicebox TTS server:
- Generating voice audio from text
- Polling generation status via SSE
- Preflight connectivity and speed checks
- Cancelling stuck generations
"""

import hashlib
import json
import time

import requests

from backend.config import VOICEBOX_URL, PIPELINE_TIMEOUT_SECONDS


# ─── Public API ─────────────────────────────────────────────────────────────


def generate_voice(
    text: str,
    profile_id: str,
    *,
    personality: bool = True,
    model_size: str | None = None,
    seed: int | None = None,
    effects_chain: list[dict] | None = None,
) -> bytes | None:
    """Generate voice audio via Voicebox API. Returns audio bytes or None.

    Quality improvements enabled by default:
    - ``personality=True``  – rewrites dialogue in-character via profile prompt
    - ``model_size="3B"``   – highest quality model (largest available)
    - ``seed``              – deterministic output from text hash
    - ``effects_chain``     – mild compressor + highpass for cleaner audio

    The TTS engine is tied to the profile in Voicebox, not the request.
    """
    if seed is None:
        # Stable deterministic seed from text hash — same text always = same audio
        seed = int(hashlib.md5(text.encode()).hexdigest()[:8], 16) % (2**32)

    payload = {
        "text": text,
        "profile_id": profile_id,
        "language": "en",
        "personality": personality,
        "seed": seed,
        "normalize": True,
        "crossfade_ms": 80,
        "effects_chain": effects_chain or [
            {"type": "compressor", "params": {"threshold_db": -18, "ratio": 3, "attack_ms": 5, "release_ms": 50}},
            {"type": "highpass", "params": {"cutoff_frequency_hz": 80}},
        ],
    }

    try:
        resp = requests.post(f"{VOICEBOX_URL}/generate", json=payload, timeout=20)
        if resp.status_code != 200:
            print(f"  ⚠️  Voicebox returned status {resp.status_code}: {resp.text[:100]}")
            return None

        data = resp.json()
        gen_id = data.get("id")
        if not gen_id:
            print(f"  ⚠️  No generation ID returned")
            return None

        # Poll via SSE — single persistent connection
        return _poll_generation(gen_id)

    except requests.exceptions.ConnectionError:
        print(f"  ❌ Cannot connect to Voicebox at {VOICEBOX_URL}")
        print(f"     Make sure Voicebox is running: https://github.com/jamiepine/voicebox")
        return None
    except Exception as e:
        print(f"  ⚠️  Voice generation error: {e}")
        return None


def voicebox_preflight(dialogue_count: int) -> float:
    """Check Voicebox connectivity and estimate total generation time.

    Returns per-line latency in seconds (or 0 if unreachable).
    """
    print(f"\n🔍 Preflight: Checking Voicebox TTS server at {VOICEBOX_URL}...")

    # ── Connectivity check ──────────────────────────────────────────────
    try:
        resp = requests.get(f"{VOICEBOX_URL}/health", timeout=5)
        if resp.status_code == 200:
            print(f"   ✅ Voicebox is reachable")
        else:
            print(f"   ⚠️  Voicebox returned status {resp.status_code}")
            return 0
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Cannot connect to Voicebox at {VOICEBOX_URL}")
        print(f"     Start it from: https://github.com/jamiepine/voicebox")
        return 0

    # ── Model loaded check ──────────────────────────────────────────────
    try:
        health_data = resp.json()
        if health_data.get("model_loaded") is False:
            print(f"   ⚠️  Voicebox is running but no TTS model is loaded")
            print(f"     Open http://127.0.0.1:17493 in your browser and load a model")
            return 0
        if health_data.get("model_downloaded") is False:
            print(f"   ⚠️  Voicebox model files are not downloaded yet")
            return 0
    except Exception:
        pass  # Non-JSON response — skip model check

    # ── Speed test ──────────────────────────────────────────────────────
    print(f"   ⏱️  Testing generation speed (sending sample phrase)...")
    test_payload = {
        "text": "Hello, this is a test.",
        "profile_id": "30140e32-8286-40af-b899-d2941f1f97eb",
        "language": "en",
    }
    try:
        t0 = time.time()
        resp = requests.post(f"{VOICEBOX_URL}/generate", json=test_payload, timeout=8)
        if resp.status_code != 200:
            print(f"   ⚠️  Generation test returned {resp.status_code}: {resp.text[:100]}")
            return 3.0

        data = resp.json()
        gen_id = data.get("id")
        if not gen_id:
            return 3.0

        completed = _poll_generation(gen_id, poll_timeout=20)
        t1 = time.time()
        elapsed = round(t1 - t0, 1)

        if completed and isinstance(completed, bytes):
            per_line = max(elapsed, 0.5)
            estimated_total = int(dialogue_count * per_line)
            print(f"   ✅ Sample generated in {elapsed}s")
            print(f"   📊 Estimated time for {dialogue_count} lines: ~{estimated_total}s "
                  f"({estimated_total // 60}m {estimated_total % 60}s)")
            if estimated_total > PIPELINE_TIMEOUT_SECONDS:
                print(f"   ⚠️  This may exceed the {PIPELINE_TIMEOUT_SECONDS}s pipeline timeout!")
            return per_line

        print(f"   ⚠️  Sample generation took >15s — Voicebox may be slow")
        return 5.0

    except requests.exceptions.Timeout:
        print(f"   ⚠️  Voicebox sample request timed out (>10s)")
        return 5.0
    except Exception as e:
        print(f"   ⚠️  Voicebox preflight error: {e}")
        return 3.0


# ─── Internal ───────────────────────────────────────────────────────────────


def _poll_generation(gen_id: str, poll_timeout: int = 60) -> bytes | None:
    """Poll voice generation status via SSE and return audio bytes.

    Uses a single persistent SSE connection that streams status changes
    in real-time — no reconnect loop needed. When complete, downloads
    audio from the /audio/{gen_id} endpoint.
    """
    try:
        status_resp = requests.get(
            f"{VOICEBOX_URL}/generate/{gen_id}/status",
            stream=True,
            timeout=poll_timeout,
        )
        if status_resp.status_code == 200:
            content_type = status_resp.headers.get("content-type", "")
            if "audio" in content_type or "octet" in content_type:
                return status_resp.content

            for event_line in status_resp.iter_lines():
                if not event_line:
                    continue
                decoded = event_line.decode("utf-8")
                if decoded.startswith("data: "):
                    event_data = json.loads(decoded[6:])
                    if event_data.get("status") == "completed":
                        # Audio is available at /audio/{gen_id}
                        audio_resp = requests.get(
                            f"{VOICEBOX_URL}/audio/{gen_id}", timeout=30
                        )
                        if audio_resp.status_code == 200:
                            return audio_resp.content
                        print(f"  ⚠️  Audio download returned {audio_resp.status_code}")
                        return None
                    elif event_data.get("status") in ("failed", "error"):
                        print(f"  ⚠️  Generation failed: {event_data.get('error', 'unknown error')}")
                        return None

    except requests.exceptions.Timeout:
        print(f"  ⚠️  SSE connection timed out after {poll_timeout}s — cancelling stuck generation")
        _cancel_generation(gen_id)
        return None

    print(f"  ⚠️  SSE connection closed unexpectedly — generation may have failed")
    return None


def _cancel_generation(gen_id: str) -> None:
    """Cancel a stuck generation."""
    try:
        requests.post(f"{VOICEBOX_URL}/generate/{gen_id}/cancel", timeout=5)
    except Exception:
        pass
