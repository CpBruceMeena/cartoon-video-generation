#!/usr/bin/env python3

"""
Remotion Video Pipeline — main orchestration entry point.

Reads a markdown script → generates voices via Voicebox TTS →
computes frame timings → saves script.json → triggers Remotion render.

Usage:
    python backend/pipeline.py
"""

import json
import shutil
import struct
import subprocess
import sys
import time
import wave
from pathlib import Path

# Ensure the project root is on sys.path (for `python backend/pipeline.py`)
_project_root = str(Path(__file__).resolve().parent.parent)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from backend.config import (
    AUDIO_DIR,
    IMAGE_DIR,
    FRONTEND_DIR,
    OUTPUT_VIDEO_DIR,
    OUTPUT_SCRIPT_DIR,
    PROCESSED_SCRIPT_DIR,
    SCRIPTS_DIR,
    PROJECT_ROOT,
    FPS,
    DEFAULT_DURATION_FRAMES,
    VOICE_MAP,
    PIPELINE_TIMEOUT_SECONDS,
)
from backend.script_parser import parse_script, normalize_name
from backend.voicebox_client import generate_voice, voicebox_preflight
from backend.audio_utils import get_audio_duration


# ─── Helpers ────────────────────────────────────────────────────────────────


def check_timeout(start_time: float, stage: str = ""):
    """Exit if the pipeline has exceeded its global timeout."""
    if not start_time:
        return
    elapsed = time.time() - start_time
    if elapsed > PIPELINE_TIMEOUT_SECONDS:
        print(f"\n⏰ Pipeline timeout ({int(elapsed)}s > {PIPELINE_TIMEOUT_SECONDS}s limit) — {stage}")
        sys.exit(1)


# ─── Processing ─────────────────────────────────────────────────────────────


def process_script(script_data: dict, script_name: str, start_time: float = 0) -> dict | None:
    """Process script: generate audio, compute timings, create script.json."""
    global_frame = 0
    total_duration = 0
    all_dialogue_count = 0

    for scene in script_data["scenes"]:
        scene_start = global_frame
        scene_duration = 0

        for line in scene["dialogue"]:
            all_dialogue_count += 1
            speaker_norm = normalize_name(line["speaker"])
            voice_config = VOICE_MAP.get(speaker_norm, {})

            audio_filename = f"{speaker_norm}_{all_dialogue_count:03d}.mp3"
            audio_path = AUDIO_DIR / audio_filename

            if voice_config.get("profile_id"):
                check_timeout(start_time, f"Generating voice for {line['speaker']}")
                print(f"  🔊 Generating voice for {line['speaker']}: \"{line['text'][:50]}...\"")
                audio_bytes = generate_voice(
                    text=line["text"],
                    profile_id=voice_config["profile_id"],
                )
                if audio_bytes:
                    audio_path.write_bytes(audio_bytes)
                    duration_sec = get_audio_duration(audio_path)
                    duration_frames = max(24, int(duration_sec * FPS))
                    print(f"     ✅ Generated ({duration_sec:.1f}s / {duration_frames} frames)")
                else:
                    duration_frames = DEFAULT_DURATION_FRAMES
                    # Write a silent WAV placeholder so Remotion doesn't 404 on the audio file
                    _write_silent_wav(audio_path, duration_sec=duration_frames / FPS)
                    print(f"     ⚠️  Voice generation failed, wrote silent audio ({duration_frames} frames)")
            else:
                duration_sec = len(line["text"]) / 10
                duration_frames = max(24, int(duration_sec * FPS))
                print(f"  ⏩ No voice profile for {line['speaker']}, using estimated {duration_frames} frames")

            line["audio"] = audio_filename
            line["startFrame"] = global_frame
            line["durationInFrames"] = duration_frames
            global_frame += duration_frames
            scene_duration += duration_frames

        scene["startFrame"] = scene_start
        scene["durationInFrames"] = scene_duration
        total_duration += scene_duration

    return {
        "scenes": script_data["scenes"],
        "totalDuration": total_duration,
        "fps": FPS,
    }


# ─── Render ─────────────────────────────────────────────────────────────────


def render_video(script_data: dict) -> bool:
    """Trigger Remotion render using the generated script.json."""
    print("\n🎬 Rendering video with Remotion...")

    script_json_path = FRONTEND_DIR / "src" / "script.json"
    script_json_path.write_text(json.dumps(script_data, indent=2), encoding="utf-8")
    print(f"  ✅ Saved script.json to {script_json_path}")

    result = subprocess.run(
        ["npx", "remotion", "render", "src/index.ts", "DynamicVideo", "--overwrite"],
        cwd=str(FRONTEND_DIR),
        capture_output=True,
        text=True,
        timeout=300,
    )

    if result.returncode == 0:
        print(f"  ✅ Video rendered successfully!")
        return True
    else:
        print(f"  ❌ Render failed: {result.stderr[:500]}")
        print(f"     stdout: {result.stdout[:500]}")
        return False


# ─── Cleanup ────────────────────────────────────────────────────────────────


def _write_silent_wav(path: Path, duration_sec: float = 3.0) -> None:
    """Write a silent WAV file as placeholder when voice generation fails.
    This ensures Remotion can find the audio file and won't 404 during render.
    """
    sample_rate = 22050
    num_samples = int(sample_rate * duration_sec)
    with wave.open(str(path), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(b"\x00" * num_samples * 2)


def cleanup():
    """Clean up old generated files."""
    print("🧹 Cleaning old generated files...")

    for f in AUDIO_DIR.glob("*.mp3"):
        f.unlink()
    print(f"  ✅ Cleaned audio files")

    if IMAGE_DIR.exists():
        for f in IMAGE_DIR.glob("*.png"):
            f.unlink()
        print(f"  ✅ Cleaned generated images")

    for p in [FRONTEND_DIR / "src" / "script.json", FRONTEND_DIR / "public" / "script.json"]:
        if p.exists():
            p.unlink()
    print(f"  ✅ Cleaned script.json")


# ─── Image Generation (optional) ────────────────────────────────────────────


def generate_background_images(script_data: dict) -> dict:
    """Generate placeholder background images via MuapiClient sandbox."""
    client = _get_muapi_client()
    if client is None:
        print("  ⚠️  MuapiClient not available — skipping image generation")
        return {}

    seen = set()
    for scene in script_data.get("scenes", []):
        bg = scene.get("background", "Street")
        seen.add(bg)

    if not seen:
        return {}

    print(f"\n🖼️  Generating placeholder background images ({len(seen)} unique scenes)...")
    bg_map = {}
    for bg_name in sorted(seen):
        output_path = str(IMAGE_DIR / f"{bg_name}.png")
        prompt = f"Scene background for {bg_name}, anime style"
        try:
            result = client.generate_image(prompt=prompt, output_path=output_path)
            bg_map[bg_name] = result
        except Exception as e:
            print(f"  ⚠️  Failed to generate {bg_name}: {e}")

    print(f"  ✅ Generated {len(bg_map)} background images")
    return bg_map


def _get_muapi_client():
    """Lazy-init MuapiClient in sandbox mode (free, no API key)."""
    try:
        from skills.lib.muapi_client import MuapiClient
        return MuapiClient(mode="sandbox")
    except ImportError:
        return None


# ─── Main ───────────────────────────────────────────────────────────────────


def main():
    print("=" * 60)
    print("🎬 Remotion Video Pipeline")
    print("=" * 60)

    # Ensure directories exist
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_SCRIPT_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_SCRIPT_DIR.mkdir(parents=True, exist_ok=True)

    # Find script file
    script_files = sorted(SCRIPTS_DIR.glob("*.md"))
    if not script_files:
        print(f"❌ No script files found in {SCRIPTS_DIR}")
        print(f"   Add a .md script file to scripts/ and try again.")
        sys.exit(1)

    script_path = script_files[0]
    print(f"\n📄 Processing script: {script_path.name}")

    start_time = time.time()

    cleanup()

    # Parse
    print(f"\n📝 Parsing script...")
    script_data = parse_script(script_path)
    print(f"   Found {len(script_data['scenes'])} scenes")
    total_lines = sum(len(s["dialogue"]) for s in script_data["scenes"])
    print(f"   Found {total_lines} dialogue lines")
    for s in script_data["scenes"]:
        print(f"     • {s['title']} ({len(s['dialogue'])} lines) - {s['background']}")

    # Preflight Voicebox
    voicebox_preflight(total_lines)

    # Generate background images (sandbox mode, free)
    _ = generate_background_images(script_data)

    # Generate voices + compute timings
    print(f"\n🎤 Generating voices...")
    result = process_script(script_data, script_path.stem, start_time)
    if not result:
        print("❌ Failed to process script")
        sys.exit(1)

    total_seconds = result["totalDuration"] / FPS
    print(f"\n📊 Total duration: {total_seconds:.1f}s ({result['totalDuration']} frames @ {FPS}fps)")

    # Save outputs
    output_path = OUTPUT_SCRIPT_DIR / f"{script_path.stem}.json"
    output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"  ✅ Saved script data to {output_path}")

    src_script = FRONTEND_DIR / "src" / "script.json"
    src_script.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"  ✅ Copied script.json to src/")

    check_timeout(start_time, "Rendering video")

    # Render
    render_video(result)

    # Archive processed script
    processed_path = PROCESSED_SCRIPT_DIR / script_path.name
    shutil.copy2(script_path, processed_path)
    print(f"  ✅ Archived script to {processed_path}")

    # Find and move rendered video
    rendered_video = _find_rendered_video(script_path.stem)
    if rendered_video:
        final_path = OUTPUT_VIDEO_DIR / f"{script_path.stem}.mp4"
        shutil.move(str(rendered_video), str(final_path))
        size_mb = final_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ Video saved: {final_path} ({size_mb:.1f} MB)")
    else:
        print(f"\n⚠️  Could not find rendered video in expected locations")
        print(f"   Check {FRONTEND_DIR / 'out/'} for the output file")

    print("\n✨ Pipeline complete!")


def _find_rendered_video(script_stem: str) -> Path | None:
    """Locate the rendered video file after Remotion finishes."""
    candidates = [
        PROJECT_ROOT / "out" / f"{script_stem}.mp4",
        PROJECT_ROOT / "out" / "DynamicVideo.mp4",
    ]
    for p in candidates:
        if p.exists():
            return p
    return None


if __name__ == "__main__":
    main()
