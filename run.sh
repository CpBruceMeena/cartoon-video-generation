#!/bin/bash
# Root-level wrapper — delegates to backend/run.sh
cd "$(dirname "$0")/backend" && exec ./run.sh "$@"
