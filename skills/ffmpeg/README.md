# FFmpeg Video Editing Skill

Post-process rendered videos: trim, concatenate, add effects, extract audio, and more.

## Prerequisites

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

## Usage

```bash
# Trim a video
python skills/ffmpeg/edit_video.py trim --input render.mp4 --start 10 --end 30 --output clip.mp4

# Concatenate multiple clips
python skills/ffmpeg/edit_video.py concat --inputs clip1.mp4 clip2.mp4 --output merged.mp4

# Extract audio
python skills/ffmpeg/edit_video.py audio --input render.mp4 --output soundtrack.mp3

# Add background music
python skills/ffmpeg/edit_video.py mix --video render.mp4 --audio music.mp3 --volume 0.3 --output final.mp4

# Get video info
python skills/ffmpeg/edit_video.py info --input render.mp4
```

## Integration with Pipeline

After the Remotion pipeline renders a video, use FFmpeg to:
- **Trim** the beginning/end (remove silence or slate frames)
- **Concatenate** multiple rendered scenes
- **Add background music** at appropriate volume
- **Extract audio** for separate processing or transcription
- **Resize/compress** for web distribution
- **Add intro/outro** clips
