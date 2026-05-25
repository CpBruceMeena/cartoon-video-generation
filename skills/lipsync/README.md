# Lip Sync Skill

Generate audio-driven lip-sync animations for characters using the Muapi API.

## Setup

1. Get a free API key from [muapi.ai](https://muapi.ai)
2. Set it as an environment variable:
   ```bash
   export MUAPI_API_KEY="your-key-here"
   ```

## Usage

```bash
# Lip-sync an image with audio
python skills/lipsync/lipsync.py \
  --image "characters/shinchan.png" \
  --audio "public/audio/shinchan_001.mp3" \
  --output "videos/lipsync_shinchan.mp4"

# Lip-sync a video with different audio
python skills/lipsync/lipsync.py \
  --video "clips/scene1.mp4" \
  --audio "public/audio/doraemon_002.mp3" \
  --output "videos/lipsync_doraemon.mp4"
```

## Integration with Pipeline

The generated lip-sync videos can be:
- Used as character animation layers in Remotion
- Processed further with FFmpeg skills
- Combined with backgrounds for full scenes

## How It Works

1. Uploads source media (image or video) and audio to Muapi
2. Submits a lip-sync generation request
3. Polls for completion
4. Downloads the resulting lip-synced video
