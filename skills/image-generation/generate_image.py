#!/usr/bin/env python3
"""
Generate images using the shared MuapiClient.

Sandbox mode (default, FREE): Creates placeholder images — no API key needed.
Production mode: Uses real Muapi API — requires MUAPI_API_KEY + credits.

Usage:
    # Sandbox (free — no API key needed):
    python generate_image.py --prompt "A sunset rooftop" --output bg.png

    # Production (requires MUAPI_API_KEY):
    python generate_image.py --prompt "..." --mode production --output bg.png

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
        description="Generate images using Muapi API (sandbox=free, production=credits)"
    )
    parser.add_argument("--prompt", "-p", default="A placeholder scene",
                        help="Text prompt for generation")
    parser.add_argument("--mode", "-m", default="sandbox",
                        choices=["sandbox", "production"],
                        help="sandbox=free mock (default), production=real API (costs credits)")
    parser.add_argument("--model", default="nano-banana",
                        help="Model ID (only used in production mode)")
    parser.add_argument("--ar", "--aspect-ratio", dest="aspect_ratio",
                        default="16:9", help="Aspect ratio (default: 16:9)")
    parser.add_argument("--resolution", "-r", default="1024x576",
                        help="Resolution (default: 1024x576)")
    parser.add_argument("--quality", "-q", default="standard",
                        choices=["standard", "high", "ultra"], help="Quality level")
    parser.add_argument("--seed", "-s", type=int, default=None,
                        help="Random seed for reproducibility")
    parser.add_argument("--output", "-o", default="output.png",
                        help="Output file path")
    args = parser.parse_args()

    client = MuapiClient(mode=args.mode)

    result_path = client.generate_image(
        prompt=args.prompt,
        model=args.model,
        aspect_ratio=args.aspect_ratio,
        resolution=args.resolution,
        quality=args.quality,
        seed=args.seed,
        output_path=args.output,
    )

    print(f"\n✨ Done: {result_path}")


if __name__ == "__main__":
    main()
