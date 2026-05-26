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
    echo "  install      Install Python dependencies from requirements.txt"
    echo "  headroom     Manage the Headroom optimization proxy"
    echo "  clean        Remove all generated files (audio, videos, script.json)"
    echo "  api          Start API server at http://localhost:5000"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  cd backend && ./run.sh pipeline         # Generate audio + render video from scripts/"
    echo "  cd backend && ./run.sh studio           # Preview in Remotion Studio"
    echo "  cd backend && ./run.sh api              # Start API server on port 5000"
    echo "  cd backend && ./run.sh headroom start   # Start Headroom optimization proxy"
    echo "  cd backend && ./run.sh headroom stop    # Stop Headroom proxy"
    echo "  cd backend && ./run.sh headroom status  # Check Headroom proxy status"
    echo "  cd backend && ./run.sh clean            # Wipe all generated files"
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
        echo "   📦 Installing dependencies (this may take a few minutes)..."
        PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 "$VENV_DIR/bin/python" -m pip install -r "$PROJECT_ROOT/backend/requirements.txt" --quiet
        echo "   ✅ Virtual environment ready"
    fi
    echo "$VENV_DIR/bin/python"
}

# ── Commands ──────────────────────────────────────────────────────────────────

run_install() {
    echo "📦 Installing Python dependencies..."
    PYTHON=$(ensure_venv)
    echo "   ✅ All dependencies installed"
}

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

# ── Headroom Optimization Proxy ───────────────────────────────────────────────

HEADROOM_PID_FILE="$PROJECT_ROOT/.headroom.pid"
HEADROOM_LOG_FILE="$PROJECT_ROOT/.headroom.log"

run_headroom() {
    local cmd="${1:-}"
    shift 2>/dev/null || true
    case "$cmd" in
        start|up)
            echo "🧠 Starting Headroom optimization proxy..."
            # Clean stale PID file
            if [ -f "$HEADROOM_PID_FILE" ]; then
                local old_pid=$(cat "$HEADROOM_PID_FILE")
                if ! kill -0 "$old_pid" 2>/dev/null; then
                    echo "   🧹 Removing stale PID file (process $old_pid no longer running)"
                    rm -f "$HEADROOM_PID_FILE"
                else
                    echo "   ⚠️  Headroom is already running (PID: $old_pid)"
                    return
                fi
            fi
            PYTHON=$(ensure_venv)
            nohup "$PYTHON" -m headroom.cli proxy \
                --host 127.0.0.1 --port 8787 \
                --code-aware --memory --learn \
                > "$HEADROOM_LOG_FILE" 2>&1 &
            echo $! > "$HEADROOM_PID_FILE"
            echo "   ✅ Headroom proxy started (PID: $!)"
            echo "   📡 Listening on http://127.0.0.1:8787"
            echo "   📝 Logs: $HEADROOM_LOG_FILE"
            echo ""
            echo "   To use with Claude Code:"
            echo "     export ANTHROPIC_BASE_URL=http://127.0.0.1:8787"
            echo ""
            echo "   To use with OpenAI-compatible tools:"
            echo "     export OPENAI_BASE_URL=http://127.0.0.1:8787/v1"
            ;;
        stop|down)
            echo "🛑 Stopping Headroom proxy..."
            if [ ! -f "$HEADROOM_PID_FILE" ]; then
                echo "   ⚠️  No PID file found. Is Headroom running?"
                return
            fi
            local pid=$(cat "$HEADROOM_PID_FILE")
            if kill "$pid" 2>/dev/null; then
                echo "   ✅ Headroom proxy stopped"
            else
                echo "   ⚠️  Process not found (may have already exited)"
            fi
            rm -f "$HEADROOM_PID_FILE"
            ;;
        restart)
            run_headroom stop
            sleep 1
            run_headroom start
            ;;
        status)
            if [ -f "$HEADROOM_PID_FILE" ] && kill -0 "$(cat "$HEADROOM_PID_FILE")" 2>/dev/null; then
                local pid=$(cat "$HEADROOM_PID_FILE")
                echo "✅ Headroom proxy is RUNNING (PID: $pid)"
                echo "   📡 http://127.0.0.1:8787"
                if command -v curl &>/dev/null; then
                    curl -s -o /dev/null -w "   💚 Health: HTTP %{http_code}\n" http://127.0.0.1:8787/health 2>/dev/null || echo "   ⚠️  Health check failed"
                fi
            else
                echo "❌ Headroom proxy is NOT running"
            fi
            ;;
        logs)
            if [ -f "$HEADROOM_LOG_FILE" ]; then
                tail -f "$HEADROOM_LOG_FILE"
            else
                echo "⚠️  No Headroom log file found"
            fi
            ;;
        *)
            echo "Headroom — Context optimization proxy for AI agents"
            echo ""
            echo "Usage: ./run.sh headroom <command>"
            echo ""
            echo "Commands:"
            echo "  start|up     Start the optimization proxy (port 8787)"
            echo "  stop|down    Stop the proxy"
            echo "  restart      Restart the proxy"
            echo "  status       Check if the proxy is running"
            echo "  logs         Follow proxy logs"
            echo ""
            echo "Configuration: $PROJECT_ROOT/config/headroom.yml"
            echo ""
            echo "Once running, configure your AI tools to use it:"
            echo "  Claude Code:  export ANTHROPIC_BASE_URL=http://127.0.0.1:8787"
            echo "  OpenAI tools: export OPENAI_BASE_URL=http://127.0.0.1:8787/v1"
            ;;
    esac
}

# ── Main ──────────────────────────────────────────────────────────────────────

case "${1:-}" in
    pipeline)    run_pipeline ;;
    studio)      run_studio ;;
    build)       run_build ;;
    install)     run_install ;;
    headroom)    shift; run_headroom "$@" ;;
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
