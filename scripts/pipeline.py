#!/usr/bin/env python3

"""
Video Generation Pipeline for Remotion
- Reads script from script_files/
- Generates character voices via Voicebox (localhost:17493)
- Outputs script.json with precise frame timings
- Triggers Remotion render
"""

import json
import os
import re
import shutil
import subprocess
import sys
import time
import requests
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_DIR = PROJECT_ROOT / "script_files"
AUDIO_DIR = PROJECT_ROOT / "public" / "audio"
OUTPUT_VIDEO_DIR = PROJECT_ROOT / "output" / "videos"
OUTPUT_SCRIPT_DIR = PROJECT_ROOT / "output" / "scripts"
PROCESSED_SCRIPT_DIR = PROJECT_ROOT / "processed" / "scripts"

FPS = 24
DEFAULT_DURATION_FRAMES = 72  # ~3 seconds fallback

VOICEBOX_URL = "http://127.0.0.1:17493"

# Character voice profile mappings
VOICE_MAP = {
    "shinchan": {
        "profile_id": "c3832bff-5bed-483b-8f58-206df52d01e3",
        "engine": "kokoro",
    },
    "doraemon": {
        "profile_id": "597882d1-81ce-4712-9e58-89a226903e0a",
        "engine": "kokoro",
    },
    "nobita": {
        "profile_id": "a58b10f6-ee8a-41af-965b-1b223e1b30d1",
        "engine": "kokoro",
    },
    "misae": {
        "profile_id": "216bb8dd-5445-4c91-8439-7ecb0d4ff394",
        "engine": "kokoro",
    },
    "shiro": {},
    "chibifox": {},
    "dog": {},
    "rayne": {},
    "schoolgirl": {},
    "scientist": {},
    "villain": {},
}

# Background keyword mapping
BACKGROUND_MAP = {
    "sunset rooftop": "SunsetRooftop",
    "rooftop": "SunsetRooftop",
    "sunset": "SunsetRooftop",
    "house": "House",
    "living room": "House",
    "interior": "House",
    "kitchen": "House",
    "bedroom": "House",
    "street": "Street",
    "outside": "Street",
    "city": "Street",
    "park": "Street",
    "school": "House",
    "classroom": "House",
}


def normalize_name(name: str) -> str:
    """Normalize character name for lookups."""
    return name.lower().strip().replace(" ", "")


def detect_background(scene_title: str, dialogue_text: str = "") -> str:
    """Detect background from scene title and dialogue."""
    combined = f"{scene_title} {dialogue_text}".lower()
    for keyword, bg in BACKGROUND_MAP.items():
        if keyword in combined:
            return bg
    return "Street"


def parse_expression(text: str) -> str:
    """Infer expression from dialogue text."""
    t = text.lower()
    if "!!" in text or "!?" in text:
        return "shocked"
    if "angry" in t or "mad" in t or "furious" in t or "annoyed" in t:
        return "angry"
    if "happy" in t or "yay" in t or "woohoo" in t or "amazing" in t or "love" in t:
        return "happy"
    if "shocked" in t or "what" in t or "surprised" in t or "wow" in t or "really?" in t:
        return "shocked"
    if t.endswith("!") and len(t) < 30:
        return "shocked"
    if "..." in t or "hmm" in t or "maybe" in t:
        return "normal"
    return "normal"


def parse_script(filepath: Path) -> dict:
    """Parse a markdown script into structured scene/dialogue data."""
    content = filepath.read_text(encoding="utf-8")

    scenes = []
    current_scene = None

    # Try Format A: ## Scene Title / ### Speaker
    # Try Format B: # SCENE 1 — Title / ### Speaker
    lines = content.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Detect scene headers - ## or # SCENE
        scene_match = re.match(r"^##\s+(.+)$", line)
        if not scene_match:
            scene_match = re.match(r"^#\s+(SCENE\s+\d+.*)$", line, re.IGNORECASE)
        if not scene_match:
            scene_match = re.match(r"^#\s+(.+)$", line)

        if scene_match:
            # Save previous scene
            if current_scene and current_scene.get("dialogue"):
                scenes.append(current_scene)

            scene_title = scene_match.group(1).strip()
            current_scene = {
                "id": f"scene_{len(scenes) + 1:02d}",
                "title": scene_title,
                "background": detect_background(scene_title),
                "dialogue": [],
            }
            i += 1
            continue

        # Detect speaker lines - ### SpeakerName
        speaker_match = re.match(r"^###\s+(.+)$", line)
        if speaker_match and current_scene is not None:
            speaker = speaker_match.group(1).strip()

            # Collect all text lines until next ### or ## or end
            i += 1
            text_parts = []
            while i < len(lines):
                next_line = lines[i].strip()
                if next_line.startswith("### ") or next_line.startswith("## ") or re.match(r"^#\s+", next_line):
                    break
                # Skip empty lines, sound effects in parentheses, markdown formatting
                if next_line and not next_line.startswith("(") and not next_line.startswith("```"):
                    text_parts.append(next_line)
                i += 1

            text = " ".join(text_parts).strip()
            if text:
                current_scene["dialogue"].append({
                    "speaker": speaker,
                    "expression": parse_expression(text),
                    "text": text,
                })
            continue

        i += 1

    # Save last scene
    if current_scene and current_scene.get("dialogue"):
        scenes.append(current_scene)

    return {"scenes": scenes}


def get_audio_duration(filepath: Path) -> float:
    """Get audio duration in seconds using mutagen or fallback."""
    try:
        from mutagen.mp3 import MP3
        audio = MP3(str(filepath))
        if audio.info and audio.info.length:
            return audio.info.length
    except Exception:
        pass

    # Fallback: estimate from file size (rough: ~16KB per second for 128kbps MP3)
    size = filepath.stat().st_size
    estimated_seconds = size / 16000
    if estimated_seconds > 0.3:
        return estimated_seconds

    # Last resort
    return 3.0


def generate_voice(text: str, profile_id: str, engine: str = "kokoro", index: int = 0) -> bytes | None:
    """Generate voice audio via Voicebox API. Returns audio bytes."""
    payload = {
        "text": text,
        "profile_id": profile_id,
        "engine": engine,
        "language": "en",
    }

    try:
        resp = requests.post(f"{VOICEBOX_URL}/generate", json=payload, timeout=60)
        if resp.status_code != 200:
            print(f"  ⚠️  Voicebox returned status {resp.status_code}: {resp.text[:100]}")
            return None

        data = resp.json()
        gen_id = data.get("id")
        if not gen_id:
            print(f"  ⚠️  No generation ID returned")
            return None

        # Poll for completion
        for attempt in range(60):
            status_resp = requests.get(
                f"{VOICEBOX_URL}/generate/{gen_id}/status",
                stream=True,
                timeout=30,
            )
            if status_resp.status_code == 200:
                content_type = status_resp.headers.get("content-type", "")
                if "audio" in content_type or "octet" in content_type:
                    return status_resp.content
                # Parse SSE event stream
                for event_line in status_resp.iter_lines():
                    if not event_line:
                        continue
                    decoded = event_line.decode("utf-8")
                    if decoded.startswith("data: "):
                        event_data = json.loads(decoded[6:])
                        if event_data.get("status") == "complete":
                            audio_url = event_data.get("audio_url") or event_data.get("url")
                            if audio_url:
                                audio_resp = requests.get(audio_url, timeout=30)
                                if audio_resp.status_code == 200:
                                    return audio_resp.content
            time.sleep(1)

        print(f"  ⚠️  Timed out waiting for voice generation")
        return None

    except requests.exceptions.ConnectionError:
        print(f"  ❌ Cannot connect to Voicebox at {VOICEBOX_URL}")
        print(f"     Make sure Voicebox is running: https://github.com/jamiepine/voicebox")
        return None
    except Exception as e:
        print(f"  ⚠️  Voice generation error: {e}")
        return None


def process_script(script_data: dict, script_name: str) -> dict | None:
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

            # Generate audio filename
            audio_filename = f"{speaker_norm}_{all_dialogue_count:03d}.mp3"
            audio_path = AUDIO_DIR / audio_filename

            # Generate voice via Voicebox
            if voice_config.get("profile_id"):
                print(f"  🔊 Generating voice for {line['speaker']}: \"{line['text'][:50]}...\"")
                audio_bytes = generate_voice(
                    text=line["text"],
                    profile_id=voice_config["profile_id"],
                    engine=voice_config.get("engine", "kokoro"),
                    index=all_dialogue_count,
                )
                if audio_bytes:
                    audio_path.write_bytes(audio_bytes)
                    duration_sec = get_audio_duration(audio_path)
                    duration_frames = max(24, int(duration_sec * FPS))
                    print(f"     ✅ Generated ({duration_sec:.1f}s / {duration_frames} frames)")
                else:
                    duration_frames = DEFAULT_DURATION_FRAMES
                    print(f"     ⚠️  Voice generation failed, using {duration_frames} frames")
            else:
                duration_sec = len(line["text"]) / 10  # rough estimate: ~0.1s per char
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


def render_video(script_data: dict) -> bool:
    """Trigger Remotion render using the generated script.json."""
    print("\n🎬 Rendering video with Remotion...")

    # Save script.json to src/ for Remotion to read
    script_json_path = PROJECT_ROOT / "src" / "script.json"
    script_json_path.write_text(json.dumps(script_data, indent=2), encoding="utf-8")
    print(f"  ✅ Saved script.json to {script_json_path}")

    # Build the render command
    result = subprocess.run(
        ["npx", "remotion", "render", "src/index.ts", "DynamicVideo", "--overwrite"],
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
        timeout=600,
    )

    if result.returncode == 0:
        print(f"  ✅ Video rendered successfully!")
        return True
    else:
        print(f"  ❌ Render failed: {result.stderr[:500]}")
        print(f"     stdout: {result.stdout[:500]}")
        return False


def cleanup():
    """Clean up old generated files."""
    print("🧹 Cleaning old generated files...")

    # Clean audio
    for f in AUDIO_DIR.glob("*.mp3"):
        f.unlink()
    print(f"  ✅ Cleaned audio files")

    # Clean script.json
    for p in [PROJECT_ROOT / "src" / "script.json", PROJECT_ROOT / "public" / "script.json"]:
        if p.exists():
            p.unlink()

    print(f"  ✅ Cleaned script.json")


def copy_character_assets():
    """Copy character PNG assets to public/ for Remotion."""
    chars_dir = PROJECT_ROOT / "cartoon_characters"
    public_chars_dir = PROJECT_ROOT / "public" / "cartoon_characters"

    if chars_dir.exists():
        public_chars_dir.mkdir(parents=True, exist_ok=True)
        for png_file in chars_dir.glob("*.png"):
            shutil.copy2(png_file, public_chars_dir / png_file.name)
        print(f"  ✅ Copied character PNGs to public/cartoon_characters/")


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
    script_files = list(SCRIPT_DIR.glob("*.md"))
    if not script_files:
        print(f"❌ No script files found in {SCRIPT_DIR}")
        print(f"   Add a .md script file to script_files/ and try again.")
        sys.exit(1)

    script_path = script_files[0]
    print(f"\n📄 Processing script: {script_path.name}")

    # Clean old files
    cleanup()

    # Copy character assets
    copy_character_assets()

    # Parse script
    print(f"\n📝 Parsing script...")
    script_data = parse_script(script_path)
    print(f"   Found {len(script_data['scenes'])} scenes")
    total_lines = sum(len(s["dialogue"]) for s in script_data["scenes"])
    print(f"   Found {total_lines} dialogue lines")
    for s in script_data["scenes"]:
        print(f"     • {s['title']} ({len(s['dialogue'])} lines) - {s['background']}")

    # Process: generate audio + compute timings
    print(f"\n🎤 Generating voices...")
    result = process_script(script_data, script_path.stem)
    if not result:
        print("❌ Failed to process script")
        sys.exit(1)

    total_seconds = result["totalDuration"] / FPS
    print(f"\n📊 Total duration: {total_seconds:.1f}s ({result['totalDuration']} frames @ {FPS}fps)")

    # Save output script.json
    output_path = OUTPUT_SCRIPT_DIR / f"{script_path.stem}.json"
    output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"  ✅ Saved script data to {output_path}")

    # Copy to src/ for Remotion
    src_script = PROJECT_ROOT / "src" / "script.json"
    src_script.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"  ✅ Copied script.json to src/")

    # Render video
    render_video(result)

    # Copy processed script
    processed_path = PROCESSED_SCRIPT_DIR / script_path.name
    shutil.copy2(script_path, processed_path)
    print(f"  ✅ Archived script to {processed_path}")

    # Find and move rendered video
    video_path = PROJECT_ROOT / "out" / f"{script_path.stem}.mp4"
    possible_paths = [
        video_path,
        PROJECT_ROOT / "out" / "DynamicVideo.mp4",
    ]
    rendered_video = None
    for p in possible_paths:
        if p.exists():
            rendered_video = p
            break

    if rendered_video:
        final_path = OUTPUT_VIDEO_DIR / f"{script_path.stem}.mp4"
        shutil.move(str(rendered_video), str(final_path))
        size_mb = final_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ Video saved: {final_path} ({size_mb:.1f} MB)")
    else:
        print(f"\n⚠️  Could not find rendered video in expected locations")
        print(f"   Check PROJECT_ROOT/out/ for the output file")

    print("\n✨ Pipeline complete!")


if __name__ == "__main__":
    main()
