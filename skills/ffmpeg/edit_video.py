#!/usr/bin/env python3
"""
Post-process videos using FFmpeg.

Supports:
- Trim: Extract a segment from a video
- Concat: Join multiple video clips
- Audio: Extract audio track
- Mix: Add background music to a video
- Info: Get video metadata

Usage:
    python edit_video.py trim --input in.mp4 --start 10 --end 30 --out clip.mp4
    python edit_video.py concat --inputs a.mp4 b.mp4 --out merged.mp4
    python edit_video.py info --input in.mp4

Requirements:
    ffmpeg must be installed on the system.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def run_ffmpeg(args: list[str], description: str = ""):
    """Run an FFmpeg command with error handling."""
    if description:
        print(f"  🎬 {description}...")
    try:
        result = subprocess.run(
            ["ffmpeg", "-y"] + args,
            capture_output=True,
            text=True,
            timeout=600,
        )
        if result.returncode != 0:
            print(f"  ❌ FFmpeg error: {result.stderr[-500:]}")
            sys.exit(1)
    except FileNotFoundError:
        print("❌ FFmpeg not found. Install it: brew install ffmpeg")
        sys.exit(1)
    except subprocess.TimeoutExpired:
        print("  ⏰ FFmpeg timed out")
        sys.exit(1)


def cmd_trim(args):
    """Trim a video segment."""
    if not Path(args.input).exists():
        print(f"❌ File not found: {args.input}")
        sys.exit(1)

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg([
        "-i", args.input,
        "-ss", str(args.start),
        "-to", str(args.end),
        "-c:v", "libx264",
        "-c:a", "aac",
        "-movflags", "+faststart",
        args.output,
    ], f"Trimming {args.input} ({args.start}s → {args.end}s)")
    print(f"  ✅ Saved: {args.output}")


def cmd_concat(args):
    """Concatenate multiple videos."""
    if len(args.inputs) < 2:
        print("❌ Need at least 2 input files to concatenate")
        sys.exit(1)

    for f in args.inputs:
        if not Path(f).exists():
            print(f"❌ File not found: {f}")
            sys.exit(1)

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)

    # Use concat demuxer (fast, no re-encode)
    file_list = Path("/tmp/concat_list.txt")
    file_list.write_text("\n".join(f"file '{Path(f).resolve()}'" for f in args.inputs))

    run_ffmpeg([
        "-f", "concat",
        "-safe", "0",
        "-i", str(file_list),
        "-c", "copy",
        args.output,
    ], f"Concatenating {len(args.inputs)} clips")
    file_list.unlink()
    print(f"  ✅ Saved: {args.output}")


def cmd_audio(args):
    """Extract audio from video."""
    if not Path(args.input).exists():
        print(f"❌ File not found: {args.input}")
        sys.exit(1)

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    codec = "libmp3lame" if args.output.endswith(".mp3") else "aac"
    run_ffmpeg([
        "-i", args.input,
        "-vn",
        "-acodec", codec,
        "-q:a", "2",
        args.output,
    ], "Extracting audio track")
    print(f"  ✅ Saved: {args.output}")


def cmd_mix(args):
    """Mix background music with video audio."""
    if not Path(args.video).exists():
        print(f"❌ Video not found: {args.video}")
        sys.exit(1)
    if not Path(args.audio).exists():
        print(f"❌ Audio not found: {args.audio}")
        sys.exit(1)

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg([
        "-i", args.video,
        "-i", args.audio,
        "-filter_complex",
        f"[1:a]volume={args.volume}[bga];[0:a][bga]amix=inputs=2:duration=first[audio]",
        "-map", "0:v",
        "-map", "[audio]",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-movflags", "+faststart",
        "-shortest",
        args.output,
    ], f"Mixing background music (volume: {args.volume})")
    print(f"  ✅ Saved: {args.output}")


def cmd_info(args):
    """Get video metadata."""
    if not Path(args.input).exists():
        print(f"❌ File not found: {args.input}")
        sys.exit(1)

    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", args.input],
        capture_output=True, text=True, timeout=30,
    )
    if result.returncode != 0:
        print(f"❌ ffprobe error: {result.stderr[:200]}")
        sys.exit(1)

    data = json.loads(result.stdout)
    fmt = data.get("format", {})
    print(f"\n📹 Video Info: {args.input}")
    print(f"   Duration: {float(fmt.get('duration', 0)):.1f}s")
    print(f"   Size: {int(fmt.get('size', 0)) / (1024*1024):.1f} MB")
    print(f"   Format: {fmt.get('format_name', 'N/A')}")

    for stream in data.get("streams", []):
        if stream["codec_type"] == "video":
            print(f"   Video: {stream.get('codec_name', 'N/A')} | "
                  f"{stream.get('width', '?')}x{stream.get('height', '?')} | "
                  f"{stream.get('r_frame_rate', 'N/A')} fps")
        elif stream["codec_type"] == "audio":
            print(f"   Audio: {stream.get('codec_name', 'N/A')} | "
                  f"{stream.get('sample_rate', '?')} Hz | "
                  f"{stream.get('channels', '?')} ch")


def main():
    parser = argparse.ArgumentParser(description="FFmpeg video editing utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Trim
    p_trim = subparsers.add_parser("trim", help="Trim a video segment")
    p_trim.add_argument("--input", "-i", required=True)
    p_trim.add_argument("--start", "-s", type=float, default=0)
    p_trim.add_argument("--end", "-e", type=float, required=True)
    p_trim.add_argument("--output", "-o", required=True)

    # Concat
    p_concat = subparsers.add_parser("concat", help="Concatenate videos")
    p_concat.add_argument("--inputs", "-i", nargs="+", required=True)
    p_concat.add_argument("--output", "-o", required=True)

    # Audio
    p_audio = subparsers.add_parser("audio", help="Extract audio from video")
    p_audio.add_argument("--input", "-i", required=True)
    p_audio.add_argument("--output", "-o", required=True)

    # Mix
    p_mix = subparsers.add_parser("mix", help="Mix background music with video")
    p_mix.add_argument("--video", "-v", required=True)
    p_mix.add_argument("--audio", "-a", required=True)
    p_mix.add_argument("--volume", "-l", type=float, default=0.3, help="Music volume (0.0-1.0)")
    p_mix.add_argument("--output", "-o", required=True)

    # Info
    p_info = subparsers.add_parser("info", help="Get video metadata")
    p_info.add_argument("--input", "-i", required=True)

    args = parser.parse_args()

    {
        "trim": cmd_trim,
        "concat": cmd_concat,
        "audio": cmd_audio,
        "mix": cmd_mix,
        "info": cmd_info,
    }[args.command](args)


if __name__ == "__main__":
    main()
