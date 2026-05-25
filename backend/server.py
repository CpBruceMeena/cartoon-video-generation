#!/usr/bin/env python3
"""
REST API server for the Remotion Video Pipeline.

Exposes the pipeline as HTTP endpoints so the frontend can trigger
video generation, check status, and manage scripts via API.

Usage:
    python server.py                    # Start on default port 5000
    python server.py --port 8080        # Custom port
    python server.py --reload           # Auto-reload on code changes
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

# Ensure project root is on sys.path (for `python backend/server.py`)
_project_root = str(Path(__file__).resolve().parent.parent)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from backend.config import PROJECT_ROOT, FRONTEND_DIR, SCRIPTS_DIR, OUTPUT_VIDEO_DIR

app = Flask(__name__)
CORS(app)

# ─── Pipeline State ─────────────────────────────────────────────────────────

pipeline_status = {
    "state": "idle",          # idle | running | completed | failed
    "progress": "",
    "started_at": None,
    "finished_at": None,
    "error": None,
    "current_script": None,
}


# ─── Helpers ────────────────────────────────────────────────────────────────


def _run_pipeline(script_name: str | None = None) -> dict:
    """Run the pipeline as a subprocess and return the result."""
    pipeline_status["state"] = "running"
    pipeline_status["progress"] = "Starting..."
    pipeline_status["started_at"] = time.time()
    pipeline_status["current_script"] = script_name
    pipeline_status["error"] = None

    python = sys.executable
    pipeline_script = str(PROJECT_ROOT / "backend" / "pipeline.py")

    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"

    try:
        result = subprocess.run(
            [python, pipeline_script],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=600,
            env=env,
        )

        pipeline_status["finished_at"] = time.time()
        elapsed = pipeline_status["finished_at"] - pipeline_status["started_at"]

        if result.returncode == 0:
            pipeline_status["state"] = "completed"
            pipeline_status["progress"] = f"Done in {elapsed:.0f}s"
        else:
            pipeline_status["state"] = "failed"
            pipeline_status["error"] = result.stderr[-500:] or result.stdout[-500:]
            pipeline_status["progress"] = "Failed"

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout[-1000:],
            "stderr": result.stderr[-500:],
            "elapsed_seconds": round(elapsed, 1),
        }

    except subprocess.TimeoutExpired:
        pipeline_status["state"] = "failed"
        pipeline_status["error"] = "Pipeline timed out after 600s"
        pipeline_status["progress"] = "Timed out"
        return {"success": False, "error": "Pipeline timed out after 600s"}
    except Exception as e:
        pipeline_status["state"] = "failed"
        pipeline_status["error"] = str(e)
        pipeline_status["progress"] = "Error"
        return {"success": False, "error": str(e)}


def _list_scripts() -> list[dict]:
    """List available script files with metadata."""
    return [
        {
            "name": f.name,
            "path": str(f.relative_to(PROJECT_ROOT)),
            "size_bytes": f.stat().st_size,
            "modified": f.stat().st_mtime,
        }
        for f in sorted(SCRIPTS_DIR.glob("*.md"))
    ]


def _list_videos() -> list[dict]:
    """List rendered video files."""
    return [
        {
            "name": f.name,
            "path": str(f.relative_to(PROJECT_ROOT)),
            "size_bytes": f.stat().st_size,
            "modified": f.stat().st_mtime,
        }
        for f in sorted(OUTPUT_VIDEO_DIR.glob("*.mp4"))
    ]


# ─── Routes ─────────────────────────────────────────────────────────────────


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "project": "Remotion Video Generator",
        "python": sys.version.split()[0],
    })


@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({
        **pipeline_status,
        "scripts_count": len(_list_scripts()),
        "videos_count": len(_list_videos()),
    })


@app.route("/api/scripts", methods=["GET"])
def list_scripts():
    return jsonify({"scripts": _list_scripts()})


@app.route("/api/videos", methods=["GET"])
def list_videos():
    return jsonify({"videos": _list_videos()})


@app.route("/api/render", methods=["POST"])
def trigger_render():
    """Trigger a full pipeline render."""
    if pipeline_status["state"] == "running":
        return jsonify({
            "success": False,
            "error": "Pipeline is already running",
            "status": pipeline_status,
        }), 409

    data = request.get_json(silent=True) or {}
    script_name = data.get("script")

    result = _run_pipeline(script_name)
    return jsonify({**result, "status": pipeline_status})


@app.route("/api/render/<script_name>", methods=["POST"])
def trigger_render_named(script_name: str):
    """Trigger render for a specific script file."""
    script_path = SCRIPTS_DIR / script_name
    if not script_path.exists():
        return jsonify({"success": False, "error": f"Script not found: {script_name}"}), 404
    return trigger_render()


@app.route("/api/videos/<filename>", methods=["GET"])
def download_video(filename: str):
    """Download a rendered video file."""
    video_path = OUTPUT_VIDEO_DIR / filename
    if not video_path.exists():
        return jsonify({"error": f"Video not found: {filename}"}), 404
    return send_file(str(video_path), mimetype="video/mp4")


# ─── Main ───────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="Remotion Video Pipeline API Server")
    parser.add_argument("--port", "-p", type=int, default=5000, help="Port to run on (default: 5000)")
    parser.add_argument("--host", "-H", default="0.0.0.0", help="Host to bind (default: 0.0.0.0)")
    parser.add_argument("--reload", "-r", action="store_true", help="Auto-reload on code changes")
    args = parser.parse_args()

    print(f"🌐 Remotion Video Pipeline API Server")
    print(f"   URL: http://{args.host}:{args.port}")
    print(f"   Endpoints:")
    print(f"     GET  /api/health     — Health check")
    print(f"     GET  /api/status     — Pipeline status")
    print(f"     GET  /api/scripts    — List scripts")
    print(f"     GET  /api/videos     — List rendered videos")
    print(f"     POST /api/render     — Trigger full pipeline")
    print(f"     GET  /api/videos/<n> — Download a video")
    print()

    app.run(host=args.host, port=args.port, debug=args.reload)


if __name__ == "__main__":
    main()
