# Video Quality Improvement Plan

> Based on visual review of `test-20s.mp4` via Remotion Studio and codebase analysis.
> Generated: May 26, 2026

---

## Executive Summary

The current video has working audio + subtitles but lacks visual polish. Characters are basic SVG shapes with minimal animation, backgrounds are static, and there are no scene transitions. The following plan addresses each layer of the video: characters, animation, backgrounds, subtitles, and pipeline integration.

---

## 🚨 Critical Issues (Must Fix)

### 1. Character SVG Quality — Not cartoon-like enough

**Current state:** Characters are extremely simple geometric shapes (rectangles, circles, ellipses). Shinchan (~149 lines) and Doraemon (~123 lines) are the most detailed, but still look like basic vector shapes rather than cartoon characters. Nobita (82 lines), Misae (83 lines), Shiro (80 lines), and others are even more basic.

| Issue | Details |
|-------|---------|
| Shinchan | Missing signature round head shape, thick eyebrows look wrong, body proportions are off (too tall/thin) |
| Doraemon | Missing proper 3D-like round body, pouch looks flat, whiskers are thin lines |
| Other chars | No speaking animation support, no expression variations beyond mouth changes |
| All SVGs | No gradients, no shadows, no depth — pure flat shapes |

**Target state from character descriptions:**

| Character | Key Visual Traits |
|-----------|-------------------|
| Shinchan | Thick eyebrows, red shirt, yellow shorts, round head, mischievous expression, 5-year-old proportions |
| Doraemon | Round blue robotic cat, white belly, red collar with golden bell, gadget pouch, whiskers |
| Nobita | Oversized glasses, yellow shirt, blue shorts, skinny build, nervous expression |
| Misae | Pink shirt, green skirt, brown shoulder-length hair, hair ties |

**Fixes needed:**
- [ ] Redesign each character SVG to match cartoon proportions (shorter legs, bigger head for cute look)
- [ ] Add gradients for depth (body shading, face shadows)
- [ ] Add stroke styling for cartoon outlines (thicker outer lines, thinner inner lines)
- [ ] Add proper eye shapes (not just ellipses — iris + pupil + highlight circles)
- [ ] Ensure all characters have `isSpeaking`, `speakingFrame`, and `expression` props
- [ ] Aim for **250+ lines per character SVG** for proper detail

### 2. Character Animation — Very minimal

**Current state:**
- Speaking mouth animation exists for Shinchan and Doraemon only
- Idle breathing sway works but is extremely subtle (2px amplitude)
- Speaking bob is 6px — visible but basic
- Non-speaking characters are nearly static
- No arm/wave/gesture animations
- Expression transitions are instant (no animation between states)

**Fixes needed:**
- [ ] Add mouth animation to **all** characters that support speaking (Nobita, Misae, etc.)
- [ ] **Arm animation** — waving/gesturing when speaking (e.g., arms move up/down)
- [ ] **Body bounce** — full body bounce when speaking (8-12px amplitude)
- [ ] **Eye blink** — add to ALL characters (periodic every ~3-5 seconds)
- [ ] **Expression transitions** — animate between expressions instead of instant swap (e.g., lerp eye shapes over 5 frames)
- [ ] **Idle animation** — more pronounced for non-speaking characters (head tilt, ear wiggle for animals)
- [ ] **Breathing** — chest/body expansion while idle

### 3. Subtitles — Too plain

**Current state:** Black semi-transparent box, white text, bottom-center. Works but looks basic.

**Fixes needed:**
- [ ] Add **speech bubble** styling (tail pointing to speaker)
- [ ] Add **character color** accent borders/badges
- [ ] Add **text animation** — characters appear one by one (typewriter effect)
- [ ] Add **emphasis animation** — key words pulse or highlight
- [ ] Improve font choice — use anime-style font or bold rounded font
- [ ] Add **shadow/glow** for readability over any background

---

## 🎯 High Priority Improvements

### 4. Backgrounds — Need more life

**Current state:** The "House" background has walls, floor, sofa, table, window, clock — actually decent detail. But it's completely static. The "Street" background has clouds + buildings. No animations.

**Fixes needed:**
- [ ] Add **parallax** effect — slight background movement as characters speak
- [ ] Animate **dust particles** floating in light beams
- [ ] Animate **curtains** swaying gently (already exists but static)
- [ ] Add **TV/clock** that shows changing time or static animation
- [ ] Add **outdoor elements** — leaves falling, birds flying, clouds drifting
- [ ] Add **lighting changes** — subtle brightness/color shifts based on time of day
- [ ] Make **floor reflections** or shadows under characters

### 5. Scene Transitions — None

**Current state:** Scenes switch instantly with no transition.

**Fixes needed:**
- [ ] Add **fade transitions** between scenes (10-15 frames)
- [ ] Add **slide transitions** (scene slides in from right)
- [ ] Add **zoom/punch** transitions for dramatic moments
- [ ] Add **flash/white** transitions for comedic timing

### 6. Layout & Composition

**Current state:** Characters positioned with fixed `bottom: 140px`, evenly spread across screen. No consideration for character height differences.

**Fixes needed:**
- [ ] **Dynamic positioning** — taller characters (Doraemon) placed differently from shorter ones (Shiro)
- [ ] **Character scale** — vary based on importance in scene (speaking character slightly larger)
- [ ] **Z-order management** — currently fixed, but should shift based on who's speaking
- [ ] **Screen composition** — follow rule of thirds, not just equal spacing
- [ ] **Camera simulation** — slight zoom on speaking character

---

## 📋 Enhancement Ideas

### 7. Sound Design

- [ ] Add **ambient background sound** (room tone, street noise)
- [ ] Add **footstep sounds** when characters enter
- [ ] Add **comedy sound effects** (boing, slide whistle) for visual gags
- [ ] Add **transition whoosh** sounds between scenes

### 8. Pipeline Integration

- [ ] **Expression detection** — improve `parse_expression()` to detect emotions from text content (exclamation marks → excited, questions → confused, etc.)
- [ ] **Background detection** — ensure backgrounds are mapped correctly from script titles
- [ ] **Auto profile creation** — create Voicebox profiles via API if they don't exist
- [ ] **Lip-sync data** — pass phoneme timing from Voicebox to drive mouth animation accurately

### 9. Additional Characters (from cartoon_character_details.md)

- [ ] **Shiro** (white dog) — needs speaking animation, tongue wagging, ear flop
- [ ] **Scientist** — needs crazy expressions, lab coat detail, goggles
- [ ] **Villain** — needs cape animation, dramatic poses, evil grin
- [ ] **Schoolgirl** — needs hair animation, skirt movement
- [ ] **Chibi Fox** — needs tail animation, ear twitch, cute expressions

---

## 🛠 Implementation Order

```
Phase 1: Character SVG Redesign (most impact)
├── Shinchan — full redesign with proper proportions, gradients, details
├── Doraemon — rounder body, better pouch, facial details
├── Nobita — glasses detail, skinny build, expressions
├── Misae — hair animation, skirt detail, expressions
├── Add speaking/animation props to ALL characters
└── Animation engine: mouth, eyes, arms, body

Phase 2: Animation System Enhancement
├── Arm movement when speaking
├── Enhanced body bounce (10px amplitude)
├── Expression transitions (smooth morphing)
├── Eye blinking for all characters
└── Idle animation variety

Phase 3: Background & Environment
├── Animate existing background elements
├── Add particle effects (dust, leaves)
├── Parallax scrolling layers
├── Character shadows on floor
└── Scene transitions (fade, slide)

Phase 4: Subtitle & UI Enhancement
├── Speech bubble with character-tailored style
├── Typewriter text animation
├── Key word emphasis
├── Better font selection
└── Improved positioning

Phase 5: Pipeline & Sound
├── Expression detection improvement
├── Ambient sound integration
├── Auto-profile creation
└── Lip-sync data integration
```

---

## 📊 Character Detail Comparison Table

| Character | Current Lines | Target Lines | Current Animations | Missing Animations |
|-----------|--------------|-------------|-------------------|-------------------|
| Shinchan | 149 | 300+ | Mouth, Blink, Body bob | Arms, Gesture |
| Doraemon | 123 | 300+ | Mouth, Blink | Arms, Pouch open/close |
| Nobita | 82 | 250+ | None | Mouth, Blink, Body, Arms |
| Misae | 83 | 250+ | None | Mouth, Blink, Hair sway |
| Shiro | 80 | 200+ | None | Mouth, Ear flop, Tail wag |
| Dog | 83 | 200+ | None | Mouth, Tail wag, Ear flop |
| Scientist | 103 | 250+ | None | All animations |
| Villain | 96 | 250+ | None | All animations |
| Schoolgirl | 98 | 250+ | None | All animations |
| ChibiFox | 81 | 200+ | None | All animations |
| Rayne | 93 | 250+ | None | All animations |

---

## 📝 Animation Code Patterns to Add

### Pattern: Arm Sway When Speaking
```tsx
// Add to Character.tsx or each SVG
const armSway = isSpeaking 
  ? Math.sin(speakingProgress * 0.15) * 15  // 15 degree sway
  : Math.sin(sceneFrame * 0.03) * 3;         // subtle idle sway
```

### Pattern: Smooth Expression Transitions
```tsx
// Instead of instant eye shape changes
const targetEyeWidth = expression === 'shocked' ? 16 : 12;
const targetEyeHeight = expression === 'shocked' ? 16 : 12;
// Animate over 5 frames
const transitionProgress = Math.min(1, speakingProgress / 5);
const eyeWidth = currentEyeWidth + (targetEyeWidth - currentEyeWidth) * transitionProgress;
```

### Pattern: Typewriter Text
```tsx
const displayText = text.slice(0, Math.floor(speakingProgress * 3));
// Shows characters one by one at 3 chars per frame
```

---

## Next Steps

1. Start with **Phase 1** — redesign Shinchan and Doraemon SVGs with proper cartoon styling
2. Typecheck after each character SVG change
3. Run pipeline to verify visual improvements in rendered video
4. Proceed through phases in order

---

*This plan should be updated as improvements are made.*
