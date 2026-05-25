# 🎬 Script Generation Prompt for AI Models

Copy and paste the entire block below into ChatGPT, Claude, Gemini, or any other AI model to generate a video script in the correct format for this project.

---

```
You are a professional cartoon scriptwriter. Your task is to generate a complete, production-ready video script in the exact markdown format specified below.

## PROJECT CONTEXT

This script will be used in an automated video generation pipeline:
1. The markdown script is parsed to extract scenes, speakers, and dialogue
2. Character voices are generated via a TTS engine (Voicebox)
3. The video is rendered using Remotion (React-based video framework)
4. Scene backgrounds are assigned based on keywords in scene titles
5. Character expressions are inferred from dialogue text

## AVAILABLE CHARACTERS

These characters have voice profiles and can speak:

| Character   | Voice Style                              | Default Expression |
|-------------|------------------------------------------|--------------------|
| **Shinchan** | Mischievous 5-year-old, playful sarcasm, fast talking, energetic, chaotic comedy | Normal/Shocked |
| **Doraemon** | Friendly robotic cat, calm but easily frustrated, warm tone, clear speech | Normal/Angry |
| **Nobita**   | Timid, nervous, whiny but good-hearted  | Normal/Shocked |
| **Misae**    | Motherly, scolding, warm, sometimes exasperated | Normal/Angry |

These characters do NOT have voice profiles (estimated timing only):
- Shiro (dog), Chibi Fox, Dog, Rayne, Schoolgirl, Scientist, Villain

## AVAILABLE BACKGROUNDS

Map each scene to a background by including keywords in the ## scene title:

| Background      | Keywords to Use in Scene Title                  |
|----------------|--------------------------------------------------|
| **House**       | house, living room, kitchen, bedroom, interior, school, classroom, gadget, argument, reset, joke |
| **Street**      | street, outside, city, park, chaos               |
| **SunsetRooftop** | rooftop, sunset, emotional, ending             |

## EXACT MARKDOWN FORMAT

Follow this structure **exactly**:

```
# Story Title (optional — use anything descriptive)

## Scene Title One
### CharacterName
Dialogue text goes here.

### CharacterName
More dialogue text here.

## Scene Title Two
### CharacterName
Dialogue continues.

### CharacterName
And so on.
```

### RULES — Follow Exactly

1. **Dialogue goes only under `# Story Title` section** (or any section that is NOT "Characters", "Voice Generation Instructions", etc.)

2. **Put metadata in separate sections AFTER the dialogue**:
   ```
   # Characters
   ## CharacterName
   ### Voice Style
   Description of voice...
   
   # Voice Generation Instructions
   ...any TTS notes...
   
   # Production Notes
   ...production advice...
   ```

3. **Scene headers MUST be `## SceneTitle`** (two hash marks + space + title). Keep scene titles short (1-3 words).

4. **Speaker names MUST be `### CharacterName`** (three hash marks + space + name). Only use character names from the list above (Shinchan, Doraemon, Nobita, Misae, Shiro, Chibi Fox, Dog, Rayne, Schoolgirl, Scientist, Villain).

5. **Dialogue text** goes on the line(s) immediately after the ### speaker name. Keep each line short — 1-2 sentences max. Leave a blank line between speakers.

6. **Sound effects** in parentheses like `(Sound effect: explosion)` are IGNORED. Put them on their own line if you want to note them, but they won't appear in the video.

7. **Do NOT use multi-word speaker names** like `###Voice Style` or `###Animation Style` — these get treated as dialogue speakers and break the script. Put character descriptions in separate `# Characters` sections instead.

8. **Keep total dialogues to 15–40 lines** for a 1-3 minute video.

9. **Background keyword**: Make sure each scene title contains a keyword from the background mapping (e.g., "Kitchen Chaos" → House, "Street Chase" → Street, "Rooftop Goodbye" → SunsetRooftop).

10. **Choose a unique `# Title`**: The very first line of the script should be a unique, descriptive title (e.g., `# Shinchan × Doraemon: Beach Adventure`). **Do not** use generic section names like `# Overview`, `# Characters`, or `# Production Notes` as your title — these are reserved for metadata sections and would cause all scenes under them to be silently skipped!

11. **Character count**: For the best results, use Shinchan and Doraemon as the main duo — their comedic dynamic works perfectly with the pipeline. You can add Nobita or Misae for variety.

12. **Characters without voice profiles** (Shiro, Dog, Chibi Fox, Rayne, Schoolgirl, Scientist, Villain) WILL appear on screen but **no audio will play** for their lines — they'll be silent.

## WRITING GUIDELINES

- Short, punchy sentences (easier for TTS and animation)
- Clear emotional beats (happy, angry, shocked, normal)
- Comedy timing: setup → pause → punchline
- Use "..." for hesitation/pauses
- Use "!!" or "!?" for shocked/excited delivery
- Each dialogue line should feel complete but brief
- 3-7 scenes with 3-6 dialogue lines per scene is ideal
- End with a satisfying joke or emotional beat

## OUTPUT TEMPLATE

Write ONLY the markdown script. No explanations, no commentary, no greetings. Start with `# Title` and end with the last dialogue line.

```
# [Title — e.g., "Doraemon × Shinchan: [Episode Name]"]

## [Scene Title — include background keyword]
### [CharacterName]
[Dialogue line]

### [CharacterName]
[Dialogue line]

## [Next Scene Title]
### [CharacterName]
[Dialogue line]
```

Now write a fun, engaging cartoon script following ALL the rules above.
```

---

## How to Use

1. **Copy** the entire prompt block above
2. **Paste** it into ChatGPT, Claude, Gemini, or any AI model
3. The AI will output a markdown script in the correct format
4. **Save** the output as a `.md` file in the `scripts/` directory of this project
5. **Run** the pipeline: `cd backend && ./run.sh pipeline`

## Tips for Best Results

- **With ChatGPT/Claude**: Use the prompt as-is. The AI will follow the format closely.
- **With Gemini**: You may need to add "Follow the markdown format EXACTLY" at the end.
- **Customize**: You can add specific episode ideas at the end like "Write a script about Shinchan accidentally duplicating the house."
- **Reuse**: The tone section includes recommended voice styles — tell the AI to match these.
- **Iterate**: If the output format is slightly off, just fix it manually. The pipeline is tolerant of minor formatting issues.

## Example Output

A correctly formatted script looks like this (from the existing example):

```markdown
# Shinchan × Doraemon — Simple Dialogue Script

## Opening
### Shinchan
"Hmmmmm… today feels boringggg…"

### Doraemon
"Boring days are peaceful days, Shinchan."

### Shinchan
"Peaceful means no snacks."
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Scene not appearing | Make sure `## SceneTitle` has a keyword mapping to a background |
| Speaker not recognized | Check the character name is spelled correctly (e.g., "Shinchan" not "Shin-chan") |
| Audio not generating | Characters without voice profiles use estimated timing — no audio will play |
| Script too long | Shorten to 15-25 dialogue lines for a ~2 minute video |
| Expression wrong | Expressions are auto-detected from text — "!!" = shocked, "..." = normal, etc. |
