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
# Profile IDs live in the shared registry JSON (frontend/src/characters/registry.json)
# which is the single source of truth for all character metadata.
#
# To see your Voicebox profiles:
#   curl http://127.0.0.1:17493/profiles

REGISTRY_PATH = FRONTEND_DIR / "src" / "characters" / "registry.json"


def _load_character_registry() -> dict:
    """Load the shared character registry JSON (single source of truth)."""
    import json
    if REGISTRY_PATH.exists():
        with open(REGISTRY_PATH) as f:
            data = json.load(f)
        return data.get("characters", {})
    print(f"  ⚠️  Registry not found at {REGISTRY_PATH}")
    return {}


CHARACTER_REGISTRY = _load_character_registry()


def get_voice_profile_id(character_name: str) -> str | None:
    """Get the Voicebox profile ID for a character from the shared registry."""
    key = character_name.lower().replace(" ", "").replace("-", "")
    entry = CHARACTER_REGISTRY.get(key, {})
    pid = entry.get("voiceProfileId", "")
    return pid if pid else None


def get_character_personality(character_name: str) -> str | None:
    """Get the personality prompt for a character from the shared registry."""
    key = character_name.lower().replace(" ", "").replace("-", "")
    entry = CHARACTER_REGISTRY.get(key, {})
    return entry.get("personality") or None


def get_known_characters() -> set:
    """Get the set of known character names from the registry."""
    return set(CHARACTER_REGISTRY.keys())


# ─── Backward-compatible constants ──────────────────────────────────────────

VOICE_MAP: dict[str, dict] = {
    name: {"profile_id": info["voiceProfileId"]}
    for name, info in CHARACTER_REGISTRY.items()
    if info.get("voiceProfileId")
}

KNOWN_CHARACTERS = get_known_characters() | {"chibi"}  # "chibi" is an alias for "chibifox"

# Add multi-word aliases
_extra_aliases = set()
for name in CHARACTER_REGISTRY:
    display = CHARACTER_REGISTRY[name].get("displayName", "")
    if display and " " in display:
        _extra_aliases.add(display.lower())
KNOWN_CHARACTERS |= _extra_aliases

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
