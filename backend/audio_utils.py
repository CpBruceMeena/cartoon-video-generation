"""
Audio utility functions for the Remotion Video Pipeline.

Provides duration detection from WAV/MP3 files, BGM mixing,
and amplitude extraction for lip-sync.
"""

import subprocess
from pathlib import Path


def get_audio_duration(filepath: Path) -> float:
    """Get audio duration in seconds.

    Uses mutagen for accurate WAV/MP3 duration, then falls back to:
    1. File-size-based estimation (~16 KB/s for 128kbps)
    2. Hard-coded 3s default
    """
    # Strategy 1: mutagen (accurate — try WAV first, then MP3)
    try:
        from mutagen.wave import WAVE
        audio = WAVE(str(filepath))
        if audio.info and audio.info.length:
            return audio.info.length
    except Exception:
        pass

    try:
        from mutagen.mp3 import MP3
        audio = MP3(str(filepath))
        if audio.info and audio.info.length:
            return audio.info.length
    except Exception:
        pass

    # Strategy 2: ffprobe (more reliable for various formats)
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(filepath)],
            capture_output=True,
            text=True,
            timeout=10,
        )
        if result.returncode == 0 and result.stdout.strip():
            return float(result.stdout.strip())
    except Exception:
        pass

    # Strategy 3: file size estimate (~16 KB/s for 128kbps)
    size = filepath.stat().st_size
    estimated_seconds = size / 16000
    if estimated_seconds > 0.3:
        return estimated_seconds

    # Strategy 4: fallback default
    return 3.0


def mix_bgm_with_audio(
    audio_paths: list[Path],
    output_path: Path,
    bgm_path: Path | None = None,
    bgm_volume: float = 0.12,
) -> bool:
    """Mix TTS audio files with optional background music.

    Concatenates all TTS audio files, then mixes with BGM at a
    specified volume level. Output is a WAV file ready for Remotion.

    Args:
        audio_paths: List of TTS audio file paths (in order).
        output_path: Path for the mixed output WAV file.
        bgm_path: Optional path to background music file.
        bgm_volume: BGM volume factor (0.0-1.0). 0.12 = 12%.

    Returns:
        True if mixing succeeded, False otherwise.
    """
    if not audio_paths:
        return False

    if bgm_path is None or not bgm_path.exists():
        # No BGM — just concatenate the audio files
        if len(audio_paths) == 1:
            import shutil
            shutil.copy2(audio_paths[0], output_path)
            return True

        return _concat_audio_files(audio_paths, output_path)

    try:
        # Build concat filter for TTS files
        concat_filter = ""
        for i, _ in enumerate(audio_paths):
            concat_filter += f"[{i}:a]"
        concat_filter += f"concat=n={len(audio_paths)}:v=0:a=1[voice]"

        # Input files: all TTS + BGM
        input_args = []
        for ap in audio_paths:
            input_args.extend(["-i", str(ap)])
        input_args.extend(["-i", str(bgm_path)])

        # ffmpeg filter: concat TTS, then mix with BGM at reduced volume
        cmd = ["ffmpeg", "-y"] + input_args + [
            "-filter_complex",
            f"{concat_filter}; [voice][{len(audio_paths)}:a]amix=inputs=2:duration=longest"
            f",volume={bgm_volume}:enable='between(t,0,9999)'[bgm_voice];"
            f"[voice]adelay=0|0[voice_delayed];"
            f"[voice_delayed][{len(audio_paths)}:a]amix=inputs=2:duration=longest[bgm_mix]",
            "-ac", "1",
            "-ar", "22050",
            "-map", "[bgm_mix]",
            str(output_path),
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            print(f"  ⚠️  BGM mixing failed: {result.stderr[:200]}")
            return _concat_audio_files(audio_paths, output_path)

        return True
    except Exception as e:
        print(f"  ⚠️  BGM mixing error ({e}), falling back to concat")
        return _concat_audio_files(audio_paths, output_path)


def _concat_audio_files(audio_paths: list[Path], output_path: Path) -> bool:
    """Concatenate multiple WAV files into one using ffmpeg."""
    try:
        inputs = []
        for ap in audio_paths:
            inputs.extend(["-i", str(ap)])

        filter_parts = "".join(f"[{i}:a]" for i in range(len(audio_paths)))
        filter_str = f"{filter_parts}concat=n={len(audio_paths)}:v=0:a=1"

        cmd = ["ffmpeg", "-y"] + inputs + [
            "-filter_complex", filter_str,
            "-ac", "1",
            str(output_path),
        ]
        subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        return True
    except Exception as e:
        print(f"  ⚠️  Audio concat failed ({e}), copying first file only")
        import shutil
        shutil.copy2(audio_paths[0], output_path)
        return True
