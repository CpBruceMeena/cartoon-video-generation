#!/usr/bin/env python3
"""
Generate audio-driven lip-sync animations using the shared MuapiClient.

Sandbox mode (default, FREE): Creates placeholder videos — no API key needed.
Production mode: Uses real Muapi API — requires MUAPI_API_KEY + credits.

Supports two modes:
- Image + Audio: Lip-sync a character portrait with dialogue audio
- Video + Audio: Replace/re-sync audio in an existing video

Usage:
    # Sandbox (free — no API key needed):
    python lipsync.py --image char.png --audio dialog.mp3 --output lipsync.mp4

    # Production (requires MUAPI_API_KEY):
    python lipsync.py --image char.png --audio dialog.mp3 --mode production --output lipsync.mp4

Requirements:
    pip install requests
"""

import argparse
import sys
from pathlib import Path

# Add parent dir to path so we can import skills.lib
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.muapi_client import MuapiClient


def main():
    parser = argparse.ArgumentParser(
        description="Generate lip-sync animation (sandbox=free, production=credits)"
    )
    parser.add_argument("--image", "-i", default=None,
                        help="Source image for lip sync")
    parser.add_argument("--video", "-v", default=None,
                        help="Source video for lip sync")
    parser.add_argument("--audio", "-a", required=True,
                        help="Audio file for lip sync")
    parser.add_argument("--output", "-o", default="lipsync_output.mp4",
                        help="Output video path")
    parser.add_argument("--mode", "-m", default="sandbox",
                        choices=["sandbox", "production"],
                        help="sandbox=free mock (default), production=real API (costs credits)")
    args = parser.parse_args()

    if not args.image and not args.video:
        parser.error("Provide either --image or --video")

    client = MuapiClient(mode=args.mode)

    result_path = client.process_lipsync(
        audio_path=args.audio,
        image_path=args.image,
        video_path=args.video,
        output_path=args.output,
    )

    print(f"\n✨ Done: {result_path}")


if __name__ == "__main__":
    main()
