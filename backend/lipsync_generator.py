"""
Whisper-based word timestamp → lip-sync frame mapper.

Generates word-level timestamps and per-frame mouth shapes from
audio files using OpenAI Whisper for accurate lip-sync data.
"""

from pathlib import Path

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False


def generate_word_timestamps(audio_path: Path) -> list[dict] | None:
    """Generate word-level timestamps from an audio file using Whisper.

    Args:
        audio_path: Path to the WAV audio file.

    Returns:
        List of dicts with 'word', 'start', and 'end' keys (in seconds),
        or None if Whisper is unavailable or transcription fails.
    """
    if not WHISPER_AVAILABLE:
        return None

    if not audio_path or not audio_path.exists():
        return None

    try:
        model = whisper.load_model("tiny")
        result = model.transcribe(str(audio_path), word_timestamps=True)

        segments = result.get("segments", [])
        word_timings = []

        for seg in segments:
            words = seg.get("words", [])
            for w in words:
                word_timings.append({
                    "word": w.get("word", "").strip(),
                    "start": w.get("start", 0),
                    "end": w.get("end", 0),
                })

        return word_timings if word_timings else None

    except Exception as e:
        print(f"  ⚠️  Whisper transcription failed: {e}")
        return None


def timestamps_to_word_timings_frames(
    word_timestamps: list[dict],
    start_frame: int,
    fps: int = 24,
) -> list[dict]:
    """Convert Whisper word timestamps (in seconds) to frame-based format.

    Args:
        word_timestamps: List of dicts with 'word', 'start', 'end' (seconds).
        start_frame: The global frame number where this dialogue starts.
        fps: Frames per second (default 24).

    Returns:
        List of dicts with 'word', 'startFrame', 'endFrame' suitable for
        karaoke subtitle highlighting.
    """
    word_timings_frames = []
    for wt in word_timestamps:
        word_timings_frames.append({
            "word": wt["word"],
            "startFrame": start_frame + int(wt["start"] * fps),
            "endFrame": start_frame + int(wt["end"] * fps),
        })
    return word_timings_frames


def generate_lip_sync_frames(
    audio_path: Path,
    start_frame: int,
    duration_frames: int,
    fps: int = 24,
) -> list[dict] | None:
    """Generate lip-sync mouth shape frames using Whisper word timestamps.

    Falls back to None (amplitude-based lip sync will be used instead)
    if Whisper is not available.

    Args:
        audio_path: Path to the WAV audio file.
        start_frame: Global frame where this dialogue starts.
        duration_frames: Total duration of this dialogue in frames.
        fps: Frames per second (default 24).

    Returns:
        List of dicts with 'frame' and 'shape' keys, or None if unavailable.
    """
    word_timestamps = generate_word_timestamps(audio_path)
    if not word_timestamps:
        return None

    # Map phoneme groups to mouth shapes
    # Simple heuristic: open vowel sounds → 'A', rounded vowels → 'O',
    # other sounds → 'I', silence/pauses → 'closed'
    def _phoneme_to_shape(word: str) -> str:
        word_lower = word.strip().lower()
        # Strip punctuation for matching
        word_clean = word_lower.strip(".,!?;:\"'()-")

        # Detect typical mouth shapes from word content
        # Open vowels: A, E sounds
        if any(word_clean.startswith(c) for c in ('a', 'e', 'ah', 'eh', 'ha', 'he')):
            return 'A'
        # Rounded vowels: O, U sounds
        if any(word_clean.startswith(c) for c in ('o', 'u', 'oh', 'oo', 'ho')):
            return 'O'
        # Closed/I sounds
        if any(word_clean.startswith(c) for c in ('i', 'ee', 'hi', 'ih')):
            return 'I'
        # Default: open for speaking
        return 'A'

    lip_sync_frames = []
    for wt in word_timestamps:
        start = start_frame + int(wt["start"] * fps)
        end = start_frame + int(wt["end"] * fps)
        shape = _phoneme_to_shape(wt["word"])

        # Ensure we stay within duration bounds
        if start >= start_frame + duration_frames:
            break

        end = min(end, start_frame + duration_frames - 1)

        if start < start_frame + 1:
            start = start_frame + 1

        lip_sync_frames.append({
            "frame": start,
            "shape": shape,
        })

    return lip_sync_frames


def estimate_word_timings(
    text: str,
    start_frame: int,
    duration_frames: int,
    fps: int = 24,
) -> list[dict]:
    """Estimate word timings without Whisper (based on text position).

    Divides the dialogue duration equally among words, which is imprecise
    but doesn't require a ML model download.

    Args:
        text: The dialogue text.
        start_frame: Global frame where this dialogue starts.
        duration_frames: Total duration in frames.
        fps: Frames per second.

    Returns:
        List of dicts with 'word', 'startFrame', 'endFrame'.
    """
    words = text.split()
    if not words:
        return []

    # Speaking usually starts after a brief pause (first ~0.2s)
    padding_frames = max(2, int(fps * 0.15))
    effective_duration = duration_frames - padding_frames

    if effective_duration <= 0 or len(words) == 0:
        return []

    # Allocate frames per word based on character count proportion
    total_chars = sum(len(w) for w in words)
    if total_chars == 0:
        return []

    word_timings = []
    current_frame = start_frame + padding_frames

    for i, word in enumerate(words):
        word_proportion = (len(word) + 0.5) / total_chars  # slight bias toward longer words
        word_duration = max(1, int(effective_duration * word_proportion))

        end_frame = current_frame + word_duration
        word_timings.append({
            "word": word,
            "startFrame": current_frame,
            "endFrame": end_frame,
        })
        current_frame = end_frame

    return word_timings
