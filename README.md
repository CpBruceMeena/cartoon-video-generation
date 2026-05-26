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
├── frontend/                     # 🎨 Frontend: Remotion React app
│   ├── src/                      #   React / Remotion components
│   │   ├── components/           #     Background, Subtitle, Character
│   │   ├── characters/           #     SVG character components
│   │   ├── config/               #     Constants, character definitions
│   │   ├── types.ts              #     TypeScript types
│   │   ├── Root.tsx              #     Main composition
│   │   └── index.ts              #     Remotion entry point
│   ├── public/                   #   Static assets (audio, images)
│   │   ├── audio/                #     Generated TTS audio files
│   │   └── images/               #     Generated background images
│   ├── package.json              #   Node.js / Remotion dependencies
│   └── tsconfig.json             #   TypeScript config
├── backend/                      # ⚙️  Backend: modular pipeline & API server
│   ├── config.py                 #   Central configuration & constants
│   ├── script_parser.py          #   Markdown script → scenes/dialogue
│   ├── voicebox_client.py        #   Voicebox TTS API client
│   ├── audio_utils.py            #   Audio duration detection utilities
│   ├── pipeline.py               #   Main pipeline orchestration (entry point)
│   ├── server.py                 #   REST API server (Flask, port 5000)
│   ├── run.sh                    #   CLI entry point
│   └── requirements.txt          #   Python dependencies
├── scripts/                      # 📄  Script content (markdown scenes)
│   └── doraemon-shinchan-2p.md   #   Example script
├── skills/                       # 🧠 Reusable AI/media skills
│   ├── image-generation/         #   Text-to-Image via Muapi API
│   ├── lipsync/                  #   Audio-driven lip sync
│   ├── whisper/                  #   Speech-to-text transcription
│   └── ffmpeg/                   #   Video post-processing
├── videos/                       # 🎥  Output renders
│   └── renders/                  #   Final MP4 videos
├── docs/                         # 📝  Documentation
│   └── ARCHITECTURE.md           #   Detailed architecture plan
├── run.sh                        # 🔗  Root wrapper → backend/run.sh
└── README.md                     # This file
```

## Pipeline Flow

```
scripts/*.md
    │
    ▼
backend/pipeline.py ──── Voicebox TTS (localhost:17493)
    │                        │
    │              frontend/public/audio/*.mp3
    │                        │
    ▼                        ▼
frontend/src/script.json ←── frame timings + audio paths
    │
    ▼
Remotion Render (frontend/) ──→ videos/renders/*.mp4
    │
    ▼ (optional post-processing)
skills/ffmpeg/ ─────────────────→ trimmed, mixed, compressed output
```

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && ./run.sh pipeline` | Full pipeline: script → TTS → render |
| `cd backend && ./run.sh studio` | Open Remotion Studio preview (localhost:3000) |
| `cd backend && ./run.sh build` | Render current script.json to MP4 |
| `cd backend && ./run.sh install` | Install Python dependencies |
| `cd backend && ./run.sh api` | Start API server on port 5000 |
| `cd backend && ./run.sh headroom start` | Start Headroom optimization proxy |
| `cd backend && ./run.sh headroom stop` | Stop Headroom proxy |
| `cd backend && ./run.sh headroom status` | Check Headroom proxy status |
| `cd backend && ./run.sh clean` | Remove all generated files |

## Headroom Optimization Proxy

[Headroom](https://headroom.ai) is a **context compression layer** for AI agents. It sits between your AI coding tools (Claude Code, Cursor, etc.) and the LLM provider, compressing context before it's sent — reducing token usage by **60–95%** while maintaining accuracy.

### How it helps this project

When working on the cartoon-video-generation project with AI coding agents:

- **Context compression**: Compresses tool outputs, logs, file contents, and conversation history
- **SmartCrusher**: Intelligently compresses JSON, code, and structured data preservingschema
- **CacheAligner**: Optimizes prefix caching for Anthropic/OpenAI providers
- **Code-aware**: AST-based compression for Remotion components, Python backend, and config files
- **Memory**: Cross-session memory shared across different AI agents
- **Learning**: Mines failed sessions to suggest improvements to agent configuration

### Quick Start

```bash
# 1. Install (one-time)
pip install -r backend/requirements.txt

# 2. Start the proxy
cd backend && ./run.sh headroom start

# 3. Point Claude Code at it
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787

# 4. Work as usual — Headroom compresses context automatically
claude
```

### Headroom Commands

```bash
cd backend && ./run.sh headroom start    # Start the proxy
cd backend && ./run.sh headroom stop     # Stop the proxy
cd backend && ./run.sh headroom restart  # Restart the proxy
cd backend && ./run.sh headroom status   # Check if running
cd backend && ./run.sh headroom logs     # Follow proxy logs
```

### Configuration

Headroom proxy settings are in `config/headroom.yml`:
- **Port**: 8787 (default)
- **Mode**: Token optimization with code-aware compression
- **Memory**: Cross-session memory enabled
- **Learning**: Session mining enabled

### Integration with AI Tools

| Tool | Environment Variable |
|------|---------------------|
| Claude Code | `export ANTHROPIC_BASE_URL=http://127.0.0.1:8787` |
| OpenAI tools | `export OPENAI_BASE_URL=http://127.0.0.1:8787/v1` |
| Cursor | Set proxy in Cursor settings |
| Any LLM tool | Point base URL to `http://127.0.0.1:8787` |

### Benefits

- **Cost savings**: 60–90% fewer tokens = significantly lower API costs
- **Larger effective context**: 2–10x bigger context windows
- **Privacy**: Prompts stay local, not logged by default
- **Transparency**: Full audit trail of what was compressed

## API Server

Start the backend API server for programmatic video generation:

```bash
cd backend && ./run.sh api
# Server starts at http://localhost:5000
```

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/status` | Pipeline status |
| `GET` | `/api/scripts` | List available scripts |
| `GET` | `/api/videos` | List rendered videos |
| `POST` | `/api/render` | Trigger pipeline render |
| `GET` | `/api/videos/<name>` | Download a video |

Example: trigger a render from the frontend:
```js
fetch('http://localhost:5000/api/render', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

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
