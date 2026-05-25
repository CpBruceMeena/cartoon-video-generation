"""
Audio utility functions for the Remotion Video Pipeline.

Provides duration detection from MP3 files with multiple fallback strategies.
"""

from pathlib import Path


def get_audio_duration(filepath: Path) -> float:
    """Get audio duration in seconds.

    Uses mutagen for accurate MP3 duration, then falls back to:
    1. File-size-based estimation (~16 KB/s for 128kbps)
    2. Hard-coded 3s default
    """
    # Strategy 1: mutagen (accurate)
    try:
        from mutagen.mp3 import MP3
        audio = MP3(str(filepath))
        if audio.info and audio.info.length:
            return audio.info.length
    except Exception:
        pass

    # Strategy 2: file size estimate (~16 KB/s for 128kbps MP3)
    size = filepath.stat().st_size
    estimated_seconds = size / 16000
    if estimated_seconds > 0.3:
        return estimated_seconds

    # Strategy 3: fallback default
    return 3.0
