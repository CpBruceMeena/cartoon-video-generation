#!/usr/bin/env python3
"""
Transcribe audio/video to text with word-level timestamps using OpenAI Whisper.

Useful for:
- Verifying TTS-generated audio content
- Detecting filler words in recordings
- Getting precise word timestamps for animation lip-sync

Usage:
    python transcribe.py --input audio.mp3 --output transcript.json
    python transcribe.py --input audio.mp3 --detect-fillers
    python transcribe.py --input audio.mp3 --find "doraemon"

Requirements:
    pip install openai-whisper
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import whisper
except ImportError:
    print("❌ openai-whisper not installed. Run: pip install openai-whisper")
    sys.exit(1)


FILLER_WORDS = [
    "um", "uh", "hum", "hmm", "mhm",
    "like", "you know", "i mean", "yeah",
    "so", "kind of", "basically", "i guess",
    "well", "okay",
]


def transcribe(
    audio_path: str,
    model_name: str = "tiny",
    language: str | None = None,
    word_timestamps: bool = True,
) -> dict:
    """Transcribe audio and return full result with word timestamps."""
    print(f"🎤 Loading Whisper model '{model_name}'...")
    model = whisper.load_model(model_name)

    print(f"   Transcribing: {audio_path}")
    options = {"word_timestamps": word_timestamps}
    if language:
        options["language"] = language

    result = model.transcribe(audio_path, **options)
    return result


def extract_word_timestamps(result: dict) -> list[dict]:
    """Extract word-level timestamps from transcription result."""
    words = []
    for segment in result.get("segments", []):
        for word_info in segment.get("words", []):
            words.append({
                "word": word_info.get("word", "").strip().lower(),
                "start": word_info.get("start", 0),
                "end": word_info.get("end", 0),
                "probability": word_info.get("probability", 0),
            })
    return words


def detect_filler_words(words: list[dict]) -> list[dict]:
    """Find filler words in the word-level timestamps."""
    found = []
    for i, w in enumerate(words):
        word_text = w["word"].strip(".,!?;:\"'")
        if word_text in FILLER_WORDS:
            found.append({
                "word": word_text,
                "timestamp": w["start"],
                "end": w["end"],
                "confidence": w["probability"],
            })
    return found


def find_words(words: list[dict], targets: list[str]) -> list[dict]:
    """Find specific words/phrases in the transcription."""
    found = []
    targets_lower = [t.lower() for t in targets]
    for i, w in enumerate(words):
        word_text = w["word"].strip(".,!?;:\"'")
        if word_text in targets_lower:
            found.append({
                "word": word_text,
                "timestamp": w["start"],
                "end": w["end"],
            })
    return found


def main():
    parser = argparse.ArgumentParser(description="Transcribe audio with Whisper")
    parser.add_argument("--input", "-i", required=True, help="Audio/video file to transcribe")
    parser.add_argument("--output", "-o", default=None, help="Output JSON file for transcription")
    parser.add_argument("--model", "-m", default="tiny", choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper model size (default: tiny)")
    parser.add_argument("--language", "-l", default=None, help="Language code (e.g., 'en', 'ja')")
    parser.add_argument("--detect-fillers", action="store_true", help="Detect filler words")
    parser.add_argument("--find", action="append", default=[], help="Find specific words")
    args = parser.parse_args()

    if not Path(args.input).exists():
        print(f"❌ File not found: {args.input}")
        sys.exit(1)

    # Transcribe
    result = transcribe(args.input, args.model, args.language)

    # Print full transcript
    print(f"\n📝 Full transcript:")
    for segment in result.get("segments", []):
        start = segment.get("start", 0)
        end = segment.get("end", 0)
        text = segment.get("text", "").strip()
        print(f"   [{start:6.1f}s - {end:6.1f}s] {text}")

    # Word-level timestamps
    words = extract_word_timestamps(result)

    # Detect fillers
    if args.detect_fillers:
        fillers = detect_filler_words(words)
        if fillers:
            print(f"\n🔍 Found {len(fillers)} filler words:")
            for f in fillers:
                print(f"   [{f['timestamp']:.1f}s] \"{f['word']}\" (confidence: {f['confidence']:.0%})")
        else:
            print("\n✅ No filler words detected")

    # Find specific words
    if args.find:
        found = find_words(words, args.find)
        if found:
            print(f"\n🔍 Found {len(found)} occurrences:")
            for f in found:
                print(f"   [{f['timestamp']:.1f}s] \"{f['word']}\"")
        else:
            print(f"\n🔍 No occurrences of: {', '.join(args.find)}")

    # Save output
    if args.output:
        output_data = {
            "text": result.get("text", "").strip(),
            "language": result.get("language", ""),
            "duration": result.get("segments", [{}])[-1].get("end", 0) if result.get("segments") else 0,
            "segments": [
                {
                    "start": s["start"],
                    "end": s["end"],
                    "text": s["text"].strip(),
                    "words": [
                        {"word": w["word"].strip(), "start": w["start"], "end": w["end"]}
                        for w in s.get("words", [])
                    ],
                }
                for s in result.get("segments", [])
            ],
            "fillers": detect_filler_words(words) if args.detect_fillers else [],
            "found_words": find_words(words, args.find) if args.find else [],
        }
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(json.dumps(output_data, indent=2), encoding="utf-8")
        print(f"\n💾 Saved to: {args.output}")

    # Print summary
    print(f"\n📊 Summary:")
    print(f"   Words: {len(words)}")
    print(f"   Duration: {result.get('segments', [{}])[-1].get('end', 0):.1f}s" if result.get("segments") else "   Duration: N/A")


if __name__ == "__main__":
    main()
