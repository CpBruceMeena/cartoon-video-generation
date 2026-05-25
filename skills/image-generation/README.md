# Image Generation Skill

Generate character art, backgrounds, and scene visuals using the Muapi API (api.muapi.ai).

## Setup

1. Get a free API key from [muapi.ai](https://muapi.ai)
2. Set it as an environment variable:
   ```bash
   export MUAPI_API_KEY="your-key-here"
   ```

## Usage

```bash
# Generate a background image
python skills/image-generation/generate_image.py \
  --prompt "Sunset rooftop in anime style, vibrant colors" \
  --output "backgrounds/sunset_rooftop.png"

# Generate a character portrait
python skills/image-generation/generate_image.py \
  --prompt "Shinchan character, cartoon style, mischievous smile, bright colors" \
  --output "characters/shinchan_portrait.png"
```

## Integration with Pipeline

The generated images can be used as:
- Backgrounds (used in `src/components/Background.tsx`)
- Character art (used in `src/characters/`)
- Scene thumbnails and promotional assets

## Available Models

- `nano-banana` — Fast, default model
- `flux-dev` — Higher quality, slower
- `hidream-i1-fast` — Fastest generation
- `hidream-i1-dev` — Balanced quality/speed

## API Reference

- Base URL: `https://api.muapi.ai/api/v1/`
- Endpoint: Model-specific (e.g., `nano-banana`, `flux-dev-image`)
- Auth: `x-api-key` header
- Polling: `GET /api/v1/predictions/{requestId}/result`
