"""
Central configuration for the Remotion Video Pipeline.

All paths, constants, character mappings, and background keywords
live here so they can be imported by any module without duplication.
"""

from pathlib import Path

# ─── Project Paths ───────────────────────────────────────────────────────────

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
FRONTEND_DIR = PROJECT_ROOT / "frontend"
AUDIO_DIR = FRONTEND_DIR / "public" / "audio"
IMAGE_DIR = FRONTEND_DIR / "public" / "images"
OUTPUT_VIDEO_DIR = PROJECT_ROOT / "videos" / "renders"
OUTPUT_SCRIPT_DIR = PROJECT_ROOT / "output" / "scripts"
PROCESSED_SCRIPT_DIR = PROJECT_ROOT / "processed" / "scripts"

# ─── Video Settings ─────────────────────────────────────────────────────────

FPS = 24
DEFAULT_DURATION_FRAMES = 72  # ~3 seconds fallback when audio unavailable

# ─── Voicebox ───────────────────────────────────────────────────────────────

VOICEBOX_URL = "http://127.0.0.1:17493"

# Pipeline global timeout (seconds) — pipeline exits if exceeded
PIPELINE_TIMEOUT_SECONDS = 600

# ─── Character Voice Profiles ───────────────────────────────────────────────
#
# Profile IDs come from the live Voicebox instance. To see yours:
#   curl http://127.0.0.1:17493/profiles
#
# The TTS engine (kokoro / qwen-tts / etc.) is tied to the profile in Voicebox,
# NOT sent in the API payload. Create new profiles to switch engines.

VOICE_MAP: dict[str, dict] = {
    "shinchan":  {"profile_id": "c3832bff-5bed-483b-8f58-206df52d01e3"},
    "doraemon":  {"profile_id": "597882d1-81ce-4712-9e58-89a226903e0a"},
    "nobita":    {"profile_id": "a58b10f6-ee8a-41af-965b-1b223e1b30d1"},
    "misae":     {"profile_id": "216bb8dd-badd-49ae-ac4d-ad82bc61f26b"},
    "shiro":     {},
    "chibifox":  {},
    "dog":       {},
    "rayne":     {},
    "schoolgirl": {},
    "scientist": {},
    "villain":   {},
}

KNOWN_CHARACTERS = {
    "shinchan", "doraemon", "nobita", "misae", "shiro",
    "chibifox", "chibi fox", "dog", "rayne",
    "schoolgirl", "scientist", "villain",
}

# ─── Script Parsing Settings ────────────────────────────────────────────────

SKIP_SCENE_TITLES = {
    "overview", "characters", "voice style", "animation style",
    "voice generation instructions", "audio timing recommendations",
    "lip-sync recommendations", "recommended audio workflow",
    "recommended sound effects", "recommended background music",
    "recommended tts platforms", "production notes", "end",
}

NON_DIALOGUE_SECTIONS = {
    "characters",
    "voice generation instructions",
    "audio timing recommendations",
    "lip-sync recommendations",
    "recommended audio workflow",
    "recommended sound effects",
    "recommended background music",
    "recommended tts platforms",
    "production notes",
    "end",
}

# ─── Background Detection ───────────────────────────────────────────────────

BACKGROUND_MAP: dict[str, str] = {
    "sunset rooftop": "SunsetRooftop",
    "rooftop": "SunsetRooftop",
    "sunset": "SunsetRooftop",
    "house": "House",
    "living room": "House",
    "interior": "House",
    "kitchen": "House",
    "bedroom": "House",
    "street": "Street",
    "outside": "Street",
    "city": "Street",
    "park": "Street",
    "school": "House",
    "classroom": "House",
    "opening": "House",
    "gadget": "House",
    "chaos": "Street",
    "argument": "House",
    "emotional": "SunsetRooftop",
    "reset": "House",
    "ending": "SunsetRooftop",
    "joke": "House",
}
