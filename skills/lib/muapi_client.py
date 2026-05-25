"""
Shared Muapi API client for AI-powered media generation.

Two modes:
  - SANDBOX (default, FREE): Returns mock/placeholder data. No API key needed.
  - PRODUCTION: Uses real Muapi API. Requires MUAPI_API_KEY + credits.

Usage:
    from skills.lib.muapi_client import MuapiClient

    # Sandbox mode (free, for testing):
    client = MuapiClient()  # or MuapiClient(mode="sandbox")
    client.generate_image(prompt="...", output_path="test.png")

    # Production mode (requires API key + credits):
    client = MuapiClient(mode="production", api_key="sk-...")
    client.generate_image(prompt="...", output_path="output.png")
"""

import json
import os
import struct
import sys
import time
import wave
from pathlib import Path

import requests

# ─── Constants ────────────────────────────────────────────────────────────────

MUAPI_BASE = "https://api.muapi.ai/api/v1"
POLL_INTERVAL = 2
MAX_POLL_ATTEMPTS = 60
MODE_SANDBOX = "sandbox"
MODE_PRODUCTION = "production"

# Default output dirs (relative to project root)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_IMAGE_DIR = PROJECT_ROOT / "public" / "images"
DEFAULT_VIDEO_DIR = PROJECT_ROOT / "videos" / "renders"


# ─── Sandbox Mock Helpers ──────────────────────────────────────────────────────

def _make_placeholder_png(width: int, height: int) -> bytes:
    """Generate a minimal valid PNG with a solid color. No external deps."""
    # Minimal PNG: signature + IHDR + IDAT (filtered scanlines) + IEND
    def _chunk(chunk_type: bytes, data: bytes) -> bytes:
        length = struct.pack(">I", len(data))
        crc = struct.pack(">I", 0xFFFFFFFF & _crc32(chunk_type + data))
        return length + chunk_type + data + crc

    def _crc32(data: bytes) -> int:
        # Simple CRC-32
        crc = 0xFFFFFFFF
        for byte in data:
            crc ^= byte
            for _ in range(8):
                crc = (crc >> 1) ^ (0xEDB88320 if crc & 1 else 0)
        return crc ^ 0xFFFFFFFF

    signature = b"\\x89PNG\\r\\n\\x1a\\n"
    # IHDR: width(4), height(4), bit_depth(1), color_type(1)=2(RGB), compress(1), filter(1), interlace(1)
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    ihdr = _chunk(b"IHDR", ihdr_data)

    # IDAT: each row starts with filter byte 0, then RGB pixels
    raw = b""
    for y in range(height):
        raw += b"\\x00"  # filter none
        for x in range(width):
            # Gradient from teal to purple
            r = int(50 + (x / width) * 100)
            g = int(100 + (y / height) * 80)
            b_val = int(150 + ((x + y) / (width + height)) * 80)
            raw += struct.pack("BBB", r, g, b_val)

    import zlib
    idat = _chunk(b"IDAT", zlib.compress(raw))
    iend = _chunk(b"IEND", b"")
    return signature + ihdr + idat + iend


def _make_placeholder_mp4(duration_sec: float = 3.0) -> bytes:
    """Generate a minimal valid MP4 placeholder (black frame + silent audio)."""
    # Use FFmpeg if available for a proper placeholder
    try:
        import subprocess
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
            tmp_path = tmp.name
        subprocess.run(
            ["ffmpeg", "-y", "-f", "lavfi", "-i",
             f"color=c=#2a2a4a:s=640x360:d={duration_sec}",
             "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono:d={duration_sec}",
             "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
             "-c:a", "aac", "-shortest", tmp_path],
            capture_output=True, timeout=30,
        )
        data = Path(tmp_path).read_bytes()
        Path(tmp_path).unlink(missing_ok=True)
        return data
    except Exception:
        # Fallback: return a very minimal placeholder
        return b"PLACEHOLDER_MP4_" + str(duration_sec).encode()


def _make_placeholder_mp3(duration_sec: float = 2.0) -> bytes:
    """Generate a minimal valid MP3 placeholder (silence)."""
    try:
        import subprocess
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav_path = tmp.name
        # Generate a silent WAV
        with wave.open(wav_path, "w") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(22050)
            wf.writeframes(b"\\x00" * int(22050 * duration_sec))
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            mp3_path = tmp.name
        subprocess.run(
            ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", mp3_path],
            capture_output=True, timeout=30,
        )
        data = Path(mp3_path).read_bytes()
        Path(wav_path).unlink(missing_ok=True)
        Path(mp3_path).unlink(missing_ok=True)
        return data
    except Exception:
        return b"PLACEHOLDER_MP3_" + str(duration_sec).encode()


# ─── MuapiClient ───────────────────────────────────────────────────────────────

class MuapiClient:
    """Client for AI-powered media generation via Muapi API or sandbox mocks.

    Attributes:
        mode: "sandbox" (free mock) or "production" (real API, needs key + credits).
        api_key: Muapi API key (only needed for production mode).
        base_url: Muapi API base URL.
    """

    def __init__(self, mode: str = MODE_SANDBOX, api_key: str | None = None):
        """Initialize the Muapi client.

        Args:
            mode: "sandbox" (free) or "production" (paid).
            api_key: API key for production mode. Falls back to MUAPI_API_KEY env.
        """
        self.mode = mode.lower()
        self.api_key = api_key or os.environ.get("MUAPI_API_KEY")
        self.base_url = MUAPI_BASE

        if self.mode not in (MODE_SANDBOX, MODE_PRODUCTION):
            print(f"  ⚠️  Unknown mode '{mode}', defaulting to '{MODE_SANDBOX}'")
            self.mode = MODE_SANDBOX

        if self.mode == MODE_PRODUCTION and not self.api_key:
            print("  ❌ Production mode requires MUAPI_API_KEY")
            print("     Export it: export MUAPI_API_KEY='your-key-here'")
            print("     Or use sandbox mode (default, free): MuapiClient(mode='sandbox')")
            sys.exit(1)

    def __repr__(self) -> str:
        return f"MuapiClient(mode='{self.mode}')"

    # ── Public API ─────────────────────────────────────────────────────────

    def generate_image(
        self,
        prompt: str,
        model: str = "nano-banana",
        aspect_ratio: str = "16:9",
        resolution: str = "1024x576",
        quality: str = "standard",
        seed: int | None = None,
        output_path: str | None = None,
    ) -> str:
        """Generate an image. Returns the file path to the result.

        In sandbox mode, creates a placeholder PNG instantly (free).
        In production mode, calls the real Muapi API (costs credits).
        """
        if output_path is None:
            DEFAULT_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
            output_path = str(DEFAULT_IMAGE_DIR / f"gen_{int(time.time())}.png")

        if self.mode == MODE_SANDBOX:
            return self._sandbox_generate_image(output_path)

        return self._production_generate_image(
            prompt=prompt,
            model=model,
            aspect_ratio=aspect_ratio,
            resolution=resolution,
            quality=quality,
            seed=seed,
            output_path=output_path,
        )

    def process_lipsync(
        self,
        audio_path: str,
        image_path: str | None = None,
        video_path: str | None = None,
        output_path: str | None = None,
    ) -> str:
        """Generate a lip-synced video. Returns the file path.

        In sandbox mode, creates a placeholder video instantly (free).
        In production mode, calls the real Muapi API (costs credits).
        """
        if output_path is None:
            DEFAULT_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
            stem = "lipsync"
            if image_path:
                stem = Path(image_path).stem
            elif video_path:
                stem = Path(video_path).stem
            output_path = str(DEFAULT_VIDEO_DIR / f"{stem}_lipsync.mp4")

        if self.mode == MODE_SANDBOX:
            return self._sandbox_process_lipsync(output_path)

        return self._production_process_lipsync(
            audio_path=audio_path,
            image_path=image_path,
            video_path=video_path,
            output_path=output_path,
        )

    # ── Sandbox Mode (Free) ──────────────────────────────────────────────

    def _sandbox_generate_image(self, output_path: str) -> str:
        """Generate a placeholder image instantly (free, no API call)."""
        print(f"  🏖️  [SANDBOX] Generating placeholder image...")
        png_data = _make_placeholder_png(640, 360)
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(output_path).write_bytes(png_data)
        size_kb = len(png_data) / 1024
        print(f"  ✅ [SANDBOX] Placeholder image: {output_path} ({size_kb:.0f} KB)")
        print(f"     ⚡ Free mode — no API call made. Use mode='production' for real images.")
        return output_path

    def _sandbox_process_lipsync(self, output_path: str) -> str:
        """Generate a placeholder lip-sync video instantly (free, no API call)."""
        print(f"  🏖️  [SANDBOX] Generating placeholder lip-sync video...")
        mp4_data = _make_placeholder_mp4(3.0)
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(output_path).write_bytes(mp4_data)
        size_kb = len(mp4_data) / 1024
        print(f"  ✅ [SANDBOX] Placeholder video: {output_path} ({size_kb:.0f} KB)")
        print(f"     ⚡ Free mode — no API call made. Use mode='production' for real lip-sync.")
        return output_path

    # ── Production Mode (Paid) ────────────────────────────────────────────

    def _get_headers(self) -> dict:
        return {
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
        }

    def _upload_file(self, file_path: str) -> str:
        """Upload a file to Muapi and return its URL."""
        url = f"{self.base_url}/upload"
        with open(file_path, "rb") as f:
            resp = requests.post(
                url,
                files={"file": f},
                headers={"x-api-key": self.api_key},
                timeout=120,
            )
        if resp.status_code != 200:
            print(f"  ❌ Upload failed ({resp.status_code}): {resp.text[:200]}")
            sys.exit(1)
        data = resp.json()
        file_url = data.get("url") or data.get("data", {}).get("url")
        if not file_url:
            print(f"  ❌ No URL in upload response: {json.dumps(data, indent=2)[:200]}")
            sys.exit(1)
        return file_url

    def _poll_for_result(self, request_id: str, headers: dict, max_attempts: int = MAX_POLL_ATTEMPTS) -> dict:
        """Poll the Muapi API for a generation result."""
        for attempt in range(max_attempts):
            time.sleep(POLL_INTERVAL)
            resp = requests.get(
                f"{self.base_url}/predictions/{request_id}/result",
                headers=headers,
                timeout=30,
            )
            if resp.status_code != 200:
                continue
            data = resp.json()
            status = data.get("status", "").lower()
            if status in ("completed", "succeeded", "success"):
                return data
            if status in ("failed", "error"):
                print(f"  ❌ Generation failed: {data.get('error', 'Unknown error')}")
                sys.exit(1)
        print(f"  ⏰ Timed out after {max_attempts * POLL_INTERVAL}s")
        sys.exit(1)

    def _production_generate_image(
        self,
        prompt: str,
        model: str,
        aspect_ratio: str,
        resolution: str,
        quality: str,
        seed: int | None,
        output_path: str,
    ) -> str:
        """Generate a real image via Muapi API (costs credits)."""
        headers = self._get_headers()
        payload = {
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution,
            "quality": quality,
        }
        if seed is not None:
            payload["seed"] = seed

        print(f"  🎨 [PRODUCTION] Generating image with model '{model}'...")
        resp = requests.post(
            f"{self.base_url}/{model}",
            json=payload,
            headers=headers,
            timeout=30,
        )
        if resp.status_code != 200:
            print(f"  ❌ API error {resp.status_code}: {resp.text[:200]}")
            sys.exit(1)

        data = resp.json()
        request_id = data.get("id") or data.get("request_id")
        if not request_id:
            print(f"  ❌ No request ID: {json.dumps(data, indent=2)[:200]}")
            sys.exit(1)

        print(f"     Request ID: {request_id}")
        result = self._poll_for_result(request_id, headers)

        image_url = (
            result.get("output")
            or result.get("url")
            or result.get("image_url")
            or (result.get("data") or {}).get("url")
        )
        if not image_url:
            print(f"  ❌ No image URL in response: {json.dumps(result, indent=2)[:200]}")
            sys.exit(1)

        img_resp = requests.get(image_url, timeout=60)
        if img_resp.status_code != 200:
            print(f"  ❌ Failed to download image: {img_resp.status_code}")
            sys.exit(1)

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(output_path).write_bytes(img_resp.content)
        size_kb = len(img_resp.content) / 1024
        print(f"  ✅ Image saved: {output_path} ({size_kb:.0f} KB)")
        return output_path

    def _production_process_lipsync(
        self,
        audio_path: str,
        image_path: str | None,
        video_path: str | None,
        output_path: str,
    ) -> str:
        """Generate a real lip-sync video via Muapi API (costs credits)."""
        headers = self._get_headers()

        print("  📤 Uploading files...")
        audio_url = self._upload_file(audio_path)
        print(f"     Audio uploaded")

        image_url = None
        video_url = None
        if image_path:
            image_url = self._upload_file(image_path)
            mode = "image"
            print(f"     Image uploaded")
        elif video_path:
            video_url = self._upload_file(video_path)
            mode = "video"
            print(f"     Video uploaded")
        else:
            print("  ❌ Provide either image_path or video_path for lip-sync")
            sys.exit(1)

        payload: dict = {}
        if image_url:
            payload["image_url"] = image_url
        elif video_url:
            payload["video_url"] = video_url
        payload["audio_url"] = audio_url
        payload["model"] = "lipsync-2.0"

        print(f"  🎭 [PRODUCTION] Running lip sync ({mode} mode)...")
        resp = requests.post(
            f"{self.base_url}/lipsync",
            json=payload,
            headers=headers,
            timeout=60,
        )
        if resp.status_code != 200:
            print(f"  ❌ API error {resp.status_code}: {resp.text[:200]}")
            sys.exit(1)

        data = resp.json()
        request_id = data.get("id") or data.get("request_id")
        if not request_id:
            print(f"  ❌ No request ID: {json.dumps(data, indent=2)[:200]}")
            sys.exit(1)

        print(f"     Request ID: {request_id}")
        result = self._poll_for_result(request_id, headers, max_attempts=90)

        video_url = (
            result.get("output")
            or result.get("url")
            or result.get("video_url")
            or (result.get("data") or {}).get("url")
        )
        if not video_url:
            print(f"  ❌ No video URL: {json.dumps(result, indent=2)[:200]}")
            sys.exit(1)

        vid_resp = requests.get(video_url, timeout=120)
        if vid_resp.status_code != 200:
            print(f"  ❌ Download failed: {vid_resp.status_code}")
            sys.exit(1)

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(output_path).write_bytes(vid_resp.content)
        size_mb = len(vid_resp.content) / (1024 * 1024)
        print(f"  ✅ Lip-sync video saved: {output_path} ({size_mb:.1f} MB)")
        return output_path
