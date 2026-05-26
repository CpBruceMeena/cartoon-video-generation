# Remotion Anime-Style Upgrade Guide
**Goal**: Transform your current Shinchan x Doraemon Remotion scene to match the look, timing, and energy of this reference: https://www.youtube.com/watch?v=x2juH8lbtgM&t=6s

## 1. Diagnosis: Current vs Reference

| Aspect | Your Current Scene | Reference Video | What To Change |
| --- | --- | --- | --- |
| **Character Rig** | Flat PNG, basic `translateX/Y` | Layered SVG with head, arms, eyes, mouth, eyebrows rigged separately | Split assets into layers for independent animation |
| **Motion** | Linear `interpolate`, no easing | Anime `spring()` with overshoot, squash/stretch, anticipation | Replace all linear motion with Remotion `spring()` |
| **Background** | Flat `#FAFAFA` wall, no depth | 3-point perspective, gradients, soft shadows, parallax | Redraw room with 3 layers + lighting |
| **Subtitles** | Plain black box, typewriter | Rounded anime subs, speaker color, pop-in scale, stroke | Build `AnimatedSubtitles.tsx` component |
| **Timing** | ~1s per line, evenly spaced | Dialogue beats match voice: 0.2s windup → 0.15s impact → hold | Re-time using 30fps beat map |
| **Audio** | None | Whoosh, pop, ding SFX + room tone | Add `<Audio />` layers in Remotion |
| **Camera** | Locked | Micro push-in, impact shake | Add camera wrapper with transform |

## 2. Asset Pipeline Upgrade

### 2.1 Convert Characters to Layered SVGs
Your PNGs can't blink or emote. Split them in Figma/Illustrator:

**Shinchan layers needed:**