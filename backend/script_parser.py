"""
Markdown script parser for the Remotion Video Pipeline.

Reads script files in this format:
    # Section Title (e.g., Characters, Dialogue Script)
    ## Scene Title (e.g., Opening, Gadget Curiosity)
    ### Character Name (e.g., Shinchan, Doraemon)
        Dialogue text

Non-dialogue sections (characters, production notes, etc.) are
automatically filtered out.
"""

import json
import os
import re
from pathlib import Path

from backend.config import (
    KNOWN_CHARACTERS,
    NON_DIALOGUE_SECTIONS,
    SKIP_SCENE_TITLES,
    BACKGROUND_MAP,
)


# ─── Public API ─────────────────────────────────────────────────────────────


def parse_script(filepath: Path) -> dict:
    """Parse a markdown script into structured scene/dialogue data.

    Filters out non-dialogue sections (character descriptions, metadata, etc.)
    and only includes speaker lines that are actual character names.
    """
    content = filepath.read_text(encoding="utf-8")

    scenes = []
    current_scene = None
    in_non_dialogue_section = False

    lines = content.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # ── Track top-level sections (# Header) ──
        top_section_match = re.match(r"^#\s+(.+)$", line)
        if top_section_match and not line.startswith("## "):
            section_title = top_section_match.group(1).strip().lower()

            if current_scene and _scene_has_dialogue(current_scene):
                scenes.append(current_scene)
                current_scene = None

            in_non_dialogue_section = _in_non_dialogue_section(section_title)
            i += 1
            continue

        # ── Detect scene headers (## Scene Title) ──
        scene_match = re.match(r"^##\s+(.+)$", line)
        if not scene_match:
            scene_match = re.match(r"^#\s+(SCENE\s+\d+.*)$", line, re.IGNORECASE)

        if scene_match:
            scene_title = scene_match.group(1).strip()
            title_lower = scene_title.lower()

            if current_scene and _scene_has_dialogue(current_scene):
                scenes.append(current_scene)
                current_scene = None

            if in_non_dialogue_section:
                i += 1
                continue

            if title_lower in SKIP_SCENE_TITLES or any(
                keyword in title_lower
                for keyword in [
                    "voice prompt", "instructions", "recommended",
                    "production notes", "audio timing", "lip-sync",
                ]
            ):
                i += 1
                continue

            current_scene = {
                "id": f"scene_{len(scenes) + 1:02d}",
                "title": scene_title,
                "background": detect_background(scene_title),
                "dialogue": [],
            }
            i += 1
            continue

        # ── Detect speaker lines (### CharacterName) ──
        speaker_match = re.match(r"^###\s+(.+)$", line)
        if speaker_match and current_scene is not None:
            speaker = speaker_match.group(1).strip()

            if not _is_real_dialogue_speaker(speaker):
                i += 1
                continue

            i += 1
            text_parts = []
            while i < len(lines):
                next_line = lines[i].strip()
                if next_line.startswith("### ") or next_line.startswith("## ") or re.match(r"^#\s+", next_line):
                    break
                if next_line and not next_line.startswith("(") and not next_line.startswith("```"):
                    if not next_line.startswith("|") and not all(c in "-| " for c in next_line):
                        text_parts.append(next_line)
                i += 1

            text = " ".join(text_parts).strip()
            if text:
                current_scene["dialogue"].append({
                    "speaker": speaker,
                    "expression": parse_expression(text),
                    "gesture": parse_gesture(text),
                    "text": text,
                })
            continue

        i += 1

    if current_scene and _scene_has_dialogue(current_scene):
        scenes.append(current_scene)

    return {"scenes": scenes}


# ─── Helpers ────────────────────────────────────────────────────────────────


def normalize_name(name: str) -> str:
    """Normalize character name for lookups (lowercase, no spaces)."""
    return name.lower().strip().replace(" ", "")


def detect_background(scene_title: str, dialogue_text: str = "") -> str:
    """Detect background from scene title and dialogue."""
    combined = f"{scene_title} {dialogue_text}".lower()
    for keyword, bg in BACKGROUND_MAP.items():
        if keyword in combined:
            return bg
    return "Street"


def parse_expression(text: str) -> str:
    """Infer character expression from dialogue text.

    Uses Claude API for higher-quality inference when available,
    falls back to rule-based detection.
    """
    # Try Claude API first
    result = _claude_infer_expression_and_gesture(text)
    if result:
        return result.get("expression", "normal")

    # Fallback: rule-based detection
    t = text.lower()
    if "!!" in text or "!?" in text:
        return "shocked"
    if any(w in t for w in ("angry", "mad", "furious", "annoyed")):
        return "angry"
    if any(w in t for w in ("happy", "yay", "woohoo", "amazing", "love")):
        return "happy"
    if any(w in t for w in ("shocked", "what", "surprised", "wow", "really?")):
        return "shocked"
    if t.endswith("!") and len(t) < 30:
        return "shocked"
    if "..." in t or "hmm" in t or "maybe" in t:
        return "normal"
    return "normal"


def parse_gesture(text: str) -> str:
    """Infer character gesture from dialogue text.

    Uses Claude API for higher-quality inference when available,
    falls back to rule-based detection.
    """
    # Try Claude API first
    result = _claude_infer_expression_and_gesture(text)
    if result:
        return result.get("gesture", "default")

    # Fallback: rule-based gesture detection
    t = text.lower()
    if any(w in t for w in ("wave", "hello", "hi ", "hey", "goodbye", "bye")):
        return "waving"
    if any(w in t for w in ("point", "look", "there", "that's", "this is")):
        return "pointing"
    if any(w in t for w in ("cross", "arms", "annoyed", "mad", "furious")):
        return "crossed"
    if any(w in t for w in ("hmm", "maybe", "think", "wonder", "guess")):
        return "thinking"
    if any(w in t for w in ("wow", "what?!", "really?", "no way", "surprised")):
        return "surprised"
    if "hips" in t or "hands on" in t:
        return "hips"
    return "default"


def _claude_infer_expression_and_gesture(text: str) -> dict | None:
    """Use Claude Haiku to infer expression and gesture for a dialogue line.

    Returns {"expression": ..., "gesture": ...} or None if Claude is unavailable.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=100,
            messages=[{
                "role": "user",
                "content": f"""Classify this cartoon dialogue line for animation animation.
Text: "{text}"

Respond with JSON only:
{{"expression": "normal|happy|angry|shocked|thinking|laughing|sad", "gesture": "default|waving|pointing|crossed|hips|thinking|surprised"}}"""
            }]
        )
        result = json.loads(response.content[0].text)
        return result
    except Exception as e:
        # Claude unavailable — silently fall back to rule-based
        return None


def _is_real_dialogue_speaker(speaker: str) -> bool:
    """Check if a speaker name is an actual character (not a section header)."""
    name = normalize_name(speaker)
    if name in KNOWN_CHARACTERS:
        return True
    if " " in speaker.strip():
        return False  # Multi-word = likely a section header
    return len(name) >= 2


def _in_non_dialogue_section(title_lower: str) -> bool:
    """Check if a top-level section is a non-dialogue section."""
    return any(keyword in title_lower for keyword in NON_DIALOGUE_SECTIONS)


def _scene_has_dialogue(scene: dict | None) -> bool:
    """Check if a scene has real dialogue lines."""
    if not scene:
        return False
    real_lines = [d for d in scene.get("dialogue", []) if _is_real_dialogue_speaker(d["speaker"])]
    return len(real_lines) > 0
