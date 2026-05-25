# Whisper Transcription Skill

Transcribe audio/video to text with word-level timestamps using OpenAI Whisper.

## Setup

```bash
pip install openai-whisper
```

Or install all skills dependencies:
```bash
pip install -r backend/requirements.txt
pip install openai-whisper
```

## Usage

```bash
# Transcribe audio and get word-level timestamps
python skills/whisper/transcribe.py --input dialogue.mp3 --output transcript.json

# Detect specific filler words
python skills/whisper/transcribe.py --input dialogue.mp3 --detect-fillers

# Find specific words/phrases
python skills/whisper/transcribe.py --input dialogue.mp3 --find "doraemon" --find "gadget"
```

## Integration with Pipeline

Whisper transcription helps with:
- **Audio timing verification**: Compare expected vs actual timings of dialogue
- **Filler word detection**: Clean up TTS-generated audio
- **Word-level frame mapping**: Precisely map spoken words to animation frames
- **Quality assurance**: Verify that Voicebox TTS generated the correct text

## Model Selection

| Model | Speed | Accuracy | Size |
|-------|-------|----------|------|
| `tiny` | Fastest | Lowest | ~75MB |
| `base` | Fast | Low | ~150MB |
| `small` | Medium | Medium | ~500MB |
| `medium` | Slow | High | ~1.5GB |
| `large` | Slowest | Highest | ~3GB |

For video dialogue timing, `tiny` or `base` is usually sufficient.
