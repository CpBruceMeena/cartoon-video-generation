#!/usr/bin/env python3
"""
Generate images using the Muapi API (api.muapi.ai).

Supports text-to-image and image-to-image generation.
Useful for creating backgrounds, character art, and scene visuals.

Usage:
    python generate_image.py --prompt "A sunset rooftop" --output output.png
    python generate_image.py --prompt "..." --model flux-dev --ar 16:9 --output bg.png

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
DEFAULT_MODEL = "nano-banana"
POLL_INTERVAL = 2  # seconds
MAX_POLL_ATTEMPTS = 60


def get_api_key() -> str:
    key = os.environ.get("MUAPI_API_KEY")
    if not key:
        print("❌ MUAPI_API_KEY environment variable not set")
        print("   Get a key at https://muapi.ai and export it:")
        print("   export MUAPI_API_KEY=\"your-key-here\"")
        sys.exit(1)
    return key


def generate_image(
    prompt: str,
    model: str = DEFAULT_MODEL,
    aspect_ratio: str = "16:9",
    resolution: str = "1024x576",
    quality: str = "standard",
    seed: int | None = None,
    output_path: str = "output.png",
) -> str:
    """Generate an image via Muapi API and save to output_path. Returns the file path."""
    api_key = get_api_key()
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
        "resolution": resolution,
        "quality": quality,
    }
    if seed is not None:
        payload["seed"] = seed

    print(f"  🎨 Generating image with model '{model}'...")
    print(f"     Prompt: {prompt[:80]}{'…' if len(prompt) > 80 else ''}")

    # Submit generation request
    resp = requests.post(
        f"{MUAPI_BASE}/{model}",
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
        print(f"  ❌ No request ID in response: {json.dumps(data, indent=2)[:200]}")
        sys.exit(1)

    # Poll for result
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
            # Extract image URL
            image_url = (
                poll_data.get("output")
                or poll_data.get("url")
                or poll_data.get("image_url")
                or (poll_data.get("data") or {}).get("url")
            )
            if not image_url:
                print(f"  ❌ No image URL in response: {json.dumps(poll_data, indent=2)[:200]}")
                sys.exit(1)

            # Download and save
            img_resp = requests.get(image_url, timeout=60)
            if img_resp.status_code != 200:
                print(f"  ❌ Failed to download image: {img_resp.status_code}")
                sys.exit(1)

            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            Path(output_path).write_bytes(img_resp.content)
            size_kb = len(img_resp.content) / 1024
            print(f"  ✅ Image saved: {output_path} ({size_kb:.0f} KB)")
            return output_path

        elif status in ("failed", "error"):
            error_msg = poll_data.get("error", "Unknown error")
            print(f"  ❌ Generation failed: {error_msg}")
            sys.exit(1)

        # Still processing — continue polling

    print(f"  ⏰ Timed out after {MAX_POLL_ATTEMPTS * POLL_INTERVAL}s")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate images using Muapi API")
    parser.add_argument("--prompt", "-p", required=True, help="Text prompt for generation")
    parser.add_argument("--model", "-m", default=DEFAULT_MODEL, help=f"Model ID (default: {DEFAULT_MODEL})")
    parser.add_argument("--ar", "--aspect-ratio", dest="aspect_ratio", default="16:9", help="Aspect ratio (default: 16:9)")
    parser.add_argument("--resolution", "-r", default="1024x576", help="Resolution (default: 1024x576)")
    parser.add_argument("--quality", "-q", default="standard", choices=["standard", "high", "ultra"], help="Quality level")
    parser.add_argument("--seed", "-s", type=int, default=None, help="Random seed for reproducibility")
    parser.add_argument("--output", "-o", default="output.png", help="Output file path")
    args = parser.parse_args()

    generate_image(
        prompt=args.prompt,
        model=args.model,
        aspect_ratio=args.aspect_ratio,
        resolution=args.resolution,
        quality=args.quality,
        seed=args.seed,
        output_path=args.output,
    )


if __name__ == "__main__":
    main()
