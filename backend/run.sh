#!/bin/bash

# Shinchan × Doraemon Remotion Video Generator
# CLI tool for the video generation pipeline

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "--------------------------------------------------"
echo "🎬 Remotion Video Generator"
echo "--------------------------------------------------"

# ── Help / Usage ──────────────────────────────────────────────────────────────
show_help() {
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  pipeline     Run full pipeline: scripts/*.md → Voicebox → render video"
    echo "  studio       Open Remotion Studio (preview) at http://localhost:3000"
    echo "  build        Render the current script.json into an MP4 video"
    echo "  clean        Remove all generated files (audio, videos, script.json)"
    echo "  api          Start API server at http://localhost:5000"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  cd backend && ./run.sh pipeline   # Generate audio + render video from scripts/"
    echo "  cd backend && ./run.sh studio     # Preview in Remotion Studio"
    echo "  cd backend && ./run.sh api        # Start API server on port 5000"
    echo "  cd backend && ./run.sh clean      # Wipe all generated files"
    echo ""
    echo "Pipeline flow:"
    echo "  scripts/*.md  →  Voicebox (TTS)  →  script.json  →  Remotion → videos/renders/*.mp4"
    echo ""
    echo "Setup:"
    echo "  1. Ensure Voicebox is running: https://github.com/jamiepine/voicebox"
    echo "  2. Add a .md script to scripts/"
    echo "  3. Run: ./run.sh pipeline"
    echo ""
}

# ── Ensure Python venv ─────────────────────────────────────────────────────────
ensure_venv() {
    local VENV_DIR="$PROJECT_ROOT/.venv"
    if [ ! -d "$VENV_DIR" ]; then
        echo "🐍 Setting up Python virtual environment..."
        python3 -m venv "$VENV_DIR"
        "$VENV_DIR/bin/python" -m pip install requests flask flask-cors mutagen --quiet
        echo "   ✅ Virtual environment ready"
    fi
    echo "$VENV_DIR/bin/python"
}

# ── Commands ──────────────────────────────────────────────────────────────────

run_pipeline() {
    echo "🚀 Running full pipeline..."
    PYTHON=$(ensure_venv)
    "$PYTHON" "$PROJECT_ROOT/backend/pipeline.py"
}

run_studio() {
    echo "🌐 Opening Remotion Studio..."
    echo "   Visit http://localhost:3000 once it starts"
    cd "$PROJECT_ROOT/frontend" && npx remotion studio src/index.ts
}

run_build() {
    echo "🎬 Rendering video..."
    cd "$PROJECT_ROOT/frontend" && npx remotion render src/index.ts DynamicVideo --overwrite
    echo "   ✅ Video rendered! Check frontend/out/"
}

run_clean() {
    echo "🧹 Cleaning all generated files..."
    rm -f "$PROJECT_ROOT"/frontend/public/audio/*.mp3
    rm -f "$PROJECT_ROOT"/frontend/src/script.json
    rm -f "$PROJECT_ROOT"/frontend/public/script.json
    rm -f "$PROJECT_ROOT"/output/scripts/*.json
    rm -f "$PROJECT_ROOT"/output/videos/*.mp4
    rm -rf "$PROJECT_ROOT"/frontend/public/cartoon_characters
    rm -rf "$PROJECT_ROOT"/frontend/out/
    echo "   ✅ Clean complete!"
}

run_help() {
    show_help
}

# ── Main ──────────────────────────────────────────────────────────────────────

case "${1:-}" in
    pipeline)    run_pipeline ;;
    studio)      run_studio ;;
    build)       run_build ;;
    clean)       run_clean ;;
    api)         run_api ;;
    help|--help|-h) run_help ;;
    "")
        # No args - show menu
        show_help
        echo "Choose an option:"
        echo "  [p] Run Full Pipeline"
        echo "  [s] Open Studio (Preview)"
        echo "  [b] Build Video"
        echo "  [c] Clean Generated Files"
        echo "  [a] Start API Server"
        echo "  [q] Quit"
        read -p "> " choice
        case "$choice" in
            [pP]*) run_pipeline ;;
            [sS]*) run_studio ;;
            [bB]*) run_build ;;
            [cC]*) run_clean ;;
            [aA]*) run_api ;;
            [qQ]*) echo "Exiting."; exit 0 ;;
            *) echo "Exiting."; exit 0 ;;
        esac
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

# ── API Server ────────────────────────────────────────────────────────────────

run_api() {
    echo "🌐 Starting API server on http://localhost:5000..."
    PYTHON=$(ensure_venv)
    "$PYTHON" "$PROJECT_ROOT/backend/server.py"
}
