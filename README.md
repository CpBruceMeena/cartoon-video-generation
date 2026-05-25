# 🎬 Remotion Video Generator

Animated cartoon video generation pipeline using [Remotion](https://remotion.dev) + Voicebox TTS + AI media generation.

Turn markdown scripts into fully animated videos with character dialogue, backgrounds, subtitles, and audio.

## Quick Start

```bash
# Prerequisites
npm install
pip install -r backend/requirements.txt

# 1. Voicebox TTS
# Start Voicebox: https://github.com/jamiepine/voicebox

# 2. Add a script
# Create a markdown file in scripts/ (see scripts/ for examples)

# 3. Run the full pipeline
cd backend && ./run.sh pipeline

# 4. Preview in Remotion Studio
cd backend && ./run.sh studio
```

## Project Architecture

```
videos-remotion/
├── src/                          # Frontend: Remotion React components
│   ├── components/               #   Background, Subtitle, Character
│   ├── characters/               #   SVG character components
│   ├── config/                   #   Constants, character definitions
│   ├── types.ts                  #   TypeScript types
│   ├── Root.tsx                  #   Main composition
│   └── index.ts                  #   Remotion entry point
├── backend/                      # Pipeline: processing & rendering
│   ├── pipeline.py               #   Main video generation pipeline
│   ├── run.sh                    #   CLI entry point
│   └── requirements.txt          #   Python dependencies
├── scripts/                      # Script content (markdown)
│   └── doraemon-shinchan-2p.md   #   Example script
├── skills/                       # Reusable AI/media skills
│   ├── image-generation/         #   Text-to-Image via Muapi API
│   ├── lipsync/                  #   Audio-driven lip sync
│   ├── whisper/                  #   Speech-to-text transcription
│   └── ffmpeg/                   #   Video post-processing
├── videos/                       # Output renders
│   └── renders/                  #   Final MP4 videos
├── docs/                         # Documentation
│   └── ARCHITECTURE.md           #   Detailed architecture plan
├── public/                       # Static assets
│   └── audio/                    #   Generated TTS audio files
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## Pipeline Flow

```
scripts/*.md
    │
    ▼
backend/pipeline.py ──── Voicebox TTS (localhost:17493)
    │                        │
    │                   public/audio/*.mp3
    │                        │
    ▼                        ▼
src/script.json ←────── frame timings + audio paths
    │
    ▼
Remotion Render ────────→ videos/renders/*.mp4
    │
    ▼ (optional post-processing)
skills/ffmpeg/ ──────────→ trimmed, mixed, compressed output
```

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && ./run.sh pipeline` | Full pipeline: script → TTS → render |
| `cd backend && ./run.sh studio` | Open Remotion Studio preview (localhost:3000) |
| `cd backend && ./run.sh build` | Render current script.json to MP4 |
| `cd backend && ./run.sh clean` | Remove all generated files |

## Skills (Reusable Tools)

Each skill in `skills/` is a self-contained tool you can use independently:

| Skill | Purpose | Setup |
|-------|---------|-------|
| **Image Generation** | Generate backgrounds & character art via Muapi API | `export MUAPI_API_KEY="..."` |
| **Lip Sync** | Audio-driven character lip animation via Muapi API | `export MUAPI_API_KEY="..."` |
| **Whisper** | Transcribe audio to text with word timestamps | `pip install openai-whisper` |
| **FFmpeg** | Post-process videos (trim, concat, mix audio) | `brew install ffmpeg` |

## Dependencies

- **Node.js**: React 18, Remotion 4.x
- **Python 3**: requests, mutagen (for TTS pipeline)
- **Optional**: Voicebox TTS, Muapi API key (for AI generation), Whisper (for transcription), FFmpeg (for video processing)
