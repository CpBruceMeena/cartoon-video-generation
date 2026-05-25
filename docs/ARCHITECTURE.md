# 🏗️ Architecture Plan

## Overview

This project generates animated cartoon videos from markdown scripts. It uses:
- **Remotion** (React-based video framework) for rendering
- **Voicebox** (local TTS server) for character voice generation
- **Muapi API** (optional) for AI image/video/lip-sync generation
- **FFmpeg** for video post-processing
- **Whisper** (optional) for audio transcription and timing analysis

## Directory Layout

```videos-remotion/
│
├── frontend/                     # 🎨 FRONTEND LAYER
│   ├── src/                      #   Remotion React application
│   │   ├── components/           #     Reusable Remotion components
│   │   │   ├── Background.tsx    #     Scene background renderer
│   │   │   ├── Character.tsx     #     Character animation handler
│   │   │   └── Subtitle.tsx      #     Subtitle + audio player
│   │   ├── characters/           #     SVG character definitions
│   │   │   ├── Shinchan.tsx
│   │   │   ├── Doraemon.tsx
│   │   │   └── ... (10+ chars)
│   │   ├── config/               #     Configuration
│   │   │   ├── characters.ts     #     Character metadata & voice profiles
│   │   │   └── constants.ts      #     Colors, FPS, theme
│   │   ├── types.ts              #     Shared TypeScript types
│   │   ├── Root.tsx              #     Main composition orchestrator
│   │   └── index.ts              #     Remotion entry point
│   ├── public/                   #   Static assets
│   │   ├── audio/                #     Generated TTS audio files
│   │   └── images/               #     Generated background images
│   ├── package.json              #   Node.js / Remotion dependencies
│   └── tsconfig.json             #   TypeScript config
│
├── backend/                      # ⚙️  BACKEND LAYER
│   ├── pipeline.py               #   Pipeline: parse → TTS → render
│   ├── server.py                 #   REST API server (Flask, port 5000)
│   ├── run.sh                    #   CLI entry point
│   └── requirements.txt          #   Python dependencies
│
├── scripts/                      # 📄 CONTENT LAYER
│   └── *.md                      #   Markdown scripts (scenes + dialogue)
│
├── skills/                       # 🧠 SKILLS LAYER
│   ├── image-generation/         #   Text-to-Image via Muapi API
│   ├── lipsync/                  #   Audio-driven lip sync via Muapi
│   ├── whisper/                  #   Speech-to-text via OpenAI Whisper
│   └── ffmpeg/                   #   Video post-processing
│
├── videos/                       # 🎥 OUTPUT LAYER
│   └── renders/                  #   Final rendered MP4 videos
│
├── docs/                         # 📝 DOCUMENTATION LAYER
│   └── ARCHITECTURE.md           #   This file
│
├── output/                       # 📦 LEGACY (migrating to videos/)
│   ├── scripts/
│   └── videos/
│
├── processed/                    # 📦 LEGACY (archived scripts)
│   └── scripts/
│
├── run.sh                        # 🔗 Root wrapper → backend/run.sh
└── README.md```

## Data Flow

### 1. Script Creation
```
User writes: scripts/*.md
  │
  ▼
Markdown format:
  # Scene Title
  ### Character Name
  Dialogue text here
```

### 2. Pipeline Execution (`backend/pipeline.py`)
```
scripts/*.md
  │
  ▼ parse_script()
  ├── Detect scenes (# or ## headers)
  ├── Detect speakers (### headers)
  └── Infer expressions & backgrounds
  │
  ▼ process_script()
  ├── For each dialogue line:
  │   ├── Look up voice profile
  │   ├── Call Voicebox TTS (localhost:17493)
  │   ├── Save audio to public/audio/*.mp3
  │   └── Compute start frame & duration
  └── Calculate total duration
  │
  ▼
src/script.json ────────→ Remotion reads this
```

### 3. Rendering (Remotion)
```
src/script.json
  │
  ▼ RemotionRoot.tsx
  ├── Composition (1920x1080, 24fps)
  └── DynamicMovie (Series of scenes)
      │
      ▼ per scene:
      ├── Background component
      ├── Character components (positioned)
      ├── Subtitle component (with audio)
      └── Dialogue sequences
```

### 4. Post-Processing (Optional)
```
videos/renders/*.mp4
  │
  ▼ skills/ffmpeg/
  ├── Trim start/end
  ├── Add background music
  ├── Concatenate clips
  └── Compress for distribution
```

## Character System

Each character is:
1. A **SVG component** in `src/characters/` (e.g., `Shinchan.tsx`)
2. A **voice profile** in `src/config/characters.ts` (TTS profile ID)
3. A **voice mapping** in `backend/pipeline.py` (Voicebox profile)

Characters with voice profiles get TTS-generated audio. Others use estimated timing.

**Current characters with voice profiles:**
- Shinchan, Doraemon, Nobita, Misae

**Characters without voice profiles (estimated timing only):**
- Shiro, Chibi Fox, Dog, Rayne, Schoolgirl, Scientist, Villain

## Skills System

Skills in `skills/` are independent tools that extend the pipeline:

### Image Generation (`skills/image-generation/`)
- Uses Muapi API (`api.muapi.ai`) for text-to-image
- Can generate backgrounds, character art, scene visuals
- Requires `MUAPI_API_KEY` environment variable

### Lip Sync (`skills/lipsync/`)
- Uses Muapi API for audio-driven lip sync
- Supports image + audio or video + audio modes
- Requires `MUAPI_API_KEY` environment variable

### Whisper Transcription (`skills/whisper/`)
- Uses OpenAI Whisper for speech-to-text
- Word-level timestamps for precise animation mapping
- Filler word detection for audio cleanup

### FFmpeg Video Editing (`skills/ffmpeg/`)
- Post-processing: trim, concatenate, mix audio
- Requires `ffmpeg` installed on system
- No additional Python packages needed

## Timeout Configuration

The pipeline has a global timeout (`PIPELINE_TIMEOUT_SECONDS = 1800` in `backend/pipeline.py`):
- Default: 30 minutes
- Per-line Voicebox polling: up to ~60 seconds
- Remotion render subprocess: up to 600 seconds
- Adjust `PIPELINE_TIMEOUT_SECONDS` for longer/shorter videos

## Future Roadmap

1. **Frontend Dashboard**: Web UI for script management and pipeline monitoring
2. **Background Music**: Auto-generate or select BGM for different scene moods
3. **Scene Templates**: Pre-built animation templates for common scenarios
4. **Batch Processing**: Generate multiple video variations from one script
5. **Cloud Rendering**: Offload Remotion rendering to cloud servers
6. **Lip Sync Integration**: Auto-lip-sync characters using the lipsync skill
7. **Voice Cloning**: Generate consistent character voices via Voicebox profiles
8. **Analytics**: Track render times, success rates, and audio quality
