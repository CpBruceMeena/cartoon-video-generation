#!/usr/bin/env python3
"""
Generate audio-driven lip-sync animations using the Muapi API.

Supports two modes:
- Image + Audio: Lip-sync a character portrait with dialogue audio
- Video + Audio: Replace/re-sync audio in an existing video

Usage:
    python lipsync.py --image char.png --audio dialog.mp3 --output lipsync.mp4
    python lipsync.py --video input.mp4 --audio dialog.mp3 --output resynced.mp4

Requirements:
    pip install requests
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

MUAPI_BASE = "https://api.muapi.ai/api/v1"
POLL_INTERVAL = 2
MAX_POLL_ATTEMPTS = 90  # Lip sync can take longer


def get_api_key() -> str:
    key = os.environ.get("MUAPI_API_KEY")
    if not key:
        print("❌ MUAPI_API_KEY environment variable not set")
        print("   Get a key at https://muapi.ai and export it:")
        print("   export MUAPI_API_KEY=\"your-key-here\"")
        sys.exit(1)
    return key


def upload_file(file_path: str) -> str:
    """Upload a file to Muapi and return its URL."""
    api_key = get_api_key()
    url = f"{MUAPI_BASE}/upload"

    with open(file_path, "rb") as f:
        resp = requests.post(
            url,
            files={"file": f},
            headers={"x-api-key": api_key},
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


def process_lipsync(
    audio_url: str,
    image_url: str | None = None,
    video_url: str | None = None,
    output_path: str = "lipsync_output.mp4",
) -> str:
    """Submit a lip-sync job and save the result."""
    api_key = get_api_key()
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }

    payload: dict = {}
    if image_url:
        payload["image_url"] = image_url
        mode = "image"
    elif video_url:
        payload["video_url"] = video_url
        mode = "video"
    else:
        print("❌ Provide either --image or --video")
        sys.exit(1)

    payload["audio_url"] = audio_url
    payload["model"] = "lipsync-2.0"

    print(f"  🎭 Running lip sync ({mode} mode)...")
    resp = requests.post(
        f"{MUAPI_BASE}/lipsync",
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
    for attempt in range(MAX_POLL_ATTEMPTS):
        time.sleep(POLL_INTERVAL)
        poll_resp = requests.get(
            f"{MUAPI_BASE}/predictions/{request_id}/result",
            headers=headers,
            timeout=30,
        )

        if poll_resp.status_code != 200:
            continue

        poll_data = poll_resp.json()
        status = poll_data.get("status", "").lower()

        if status in ("completed", "succeeded", "success"):
            video_url = (
                poll_data.get("output")
                or poll_data.get("url")
                or poll_data.get("video_url")
                or (poll_data.get("data") or {}).get("url")
            )
            if not video_url:
                print(f"  ❌ No video URL: {json.dumps(poll_data, indent=2)[:200]}")
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

        elif status in ("failed", "error"):
            print(f"  ❌ Lip sync failed: {poll_data.get('error', 'Unknown')}")
            sys.exit(1)

    print(f"  ⏰ Timed out after {MAX_POLL_ATTEMPTS * POLL_INTERVAL}s")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate lip-sync animation via Muapi API")
    parser.add_argument("--image", "-i", default=None, help="Source image for lip sync")
    parser.add_argument("--video", "-v", default=None, help="Source video for lip sync")
    parser.add_argument("--audio", "-a", required=True, help="Audio file for lip sync")
    parser.add_argument("--output", "-o", default="lipsync_output.mp4", help="Output video path")
    args = parser.parse_args()

    if not args.image and not args.video:
        parser.error("Provide either --image or --video")

    print("📤 Uploading files...")
    audio_url = upload_file(args.audio)
    print(f"   Audio uploaded")

    image_url = None
    video_url = None
    if args.image:
        image_url = upload_file(args.image)
        print(f"   Image uploaded")
    elif args.video:
        video_url = upload_file(args.video)
        print(f"   Video uploaded")

    process_lipsync(
        audio_url=audio_url,
        image_url=image_url,
        video_url=video_url,
        output_path=args.output,
    )


if __name__ == "__main__":
    main()
