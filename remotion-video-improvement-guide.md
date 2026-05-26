# Remotion video improvement plan

This guide turns a typical code-generated Remotion video into a polished motion-design piece with tighter pacing, stronger typography, cleaner transitions, and more premium visual hierarchy. It also points out a practical issue with the target reference link: the supplied YouTube URL currently resolves to a Shinchan cartoon upload rather than a design-style reference, so the instructions below focus on the likely goal — a modern, high-energy promo/editing style built with precise motion graphics — while still grounding technical Remotion advice in current best-practice sources.[cite:3][cite:6][cite:9]

![Current asset](./output.mp4)

## What to fix first

Most Remotion videos look “template-like” for the same reasons: every element animates with the same timing, text enters as whole blocks, scenes change without visual intent, and spacing is driven by code convenience instead of composition. Motion-design references that feel premium usually have controlled rhythm, fewer simultaneous movements, stronger type contrast, clearer focal points, and deliberate pauses between information beats.[cite:6][cite:7]

Prioritize the rebuild in this order:

1. Storyboard and pacing.
2. Typography system.
3. Motion system.
4. Scene composition.
5. Transitions and sound sync.
6. Render performance and code structure.[cite:6][cite:9]

## Target visual direction

To get closer to a polished YouTube promo or motion-graphics reference, aim for these qualities:

- One visual idea per shot, not multiple competing ideas.
- Large, high-contrast typography with controlled line breaks.
- Fast but readable entrances, usually 8–16 frames for micro-animations at 30 fps.
- Small stagger offsets between related items instead of everything appearing together.
- Strong background/foreground separation through blur, scale, opacity, or lighting.
- Short “breathing pauses” after important reveals so the viewer can process the frame.[cite:6][cite:7]

A good working rule is: each scene should have exactly one focal object, one supporting layer, and one motion emphasis. If you have five moving elements in the same 1-second window, cut it down to one primary motion and one secondary motion.

## Rebuild the pacing

### 1. Split your timeline into beats, not screens

Do not think in terms of “screen 1, screen 2, screen 3.” Think in terms of motion beats. A premium 20–40 second promo usually feels better when each scene contains:

- Setup: 8–20 frames.
- Main reveal: 10–18 frames.
- Readable hold: 20–50 frames.
- Exit or bridge: 6–14 frames.[cite:6]

At 30 fps, that means many shots should live around 1.2 to 2.5 seconds, not 4–6 seconds unless narration requires it. If your current video has long static holds, cut them. If everything changes every 5–8 frames, slow it down.

### 2. Add breathing pauses intentionally

The easiest way to make a Remotion edit feel more expensive is to stop animating for short moments after major text or product reveals. The motion-design guidance in the Remotion best-practice material specifically highlights breathing pauses as a way to reduce viewer fatigue and improve narrative clarity.[cite:6]

Use this exact rule:

- After a headline lands, hold with almost no movement for 10–16 frames.
- After a UI/demo reveal, hold for 12–20 frames.
- After a fast transition sequence, give the next frame a calmer entry.

### 3. Use rhythm variation

If every scene has the same duration, the video feels robotic. Use a repeating pattern such as:

- Fast intro shot: 24–36 frames.
- Medium explanation shot: 45–72 frames.
- Fast accent shot: 18–30 frames.
- Hero shot: 60–90 frames.

That variation creates momentum without chaos.

## Upgrade the typography

### 1. Use a real type system

Do not mix many font sizes ad hoc. Create tokens and reuse them across every scene.

Use something like this for a 1080p composition:

```ts
export const type = {
  eyebrow: {fontSize: 28, letterSpacing: 2, fontWeight: 600},
  h1: {fontSize: 110, lineHeight: 0.92, fontWeight: 800},
  h2: {fontSize: 72, lineHeight: 0.95, fontWeight: 750},
  body: {fontSize: 36, lineHeight: 1.2, fontWeight: 500},
  meta: {fontSize: 24, lineHeight: 1.2, fontWeight: 500},
};
```

Concrete rules:

- Use one display face and one body face only.
- Keep headline width to about 8–14 words per frame.
- Make line breaks manually; never let long titles wrap automatically.
- Use tight line height for headlines, around 0.88 to 0.98.
- Use stronger weight contrast before using more colors.

### 2. Animate text by chunk, not paragraph

A common “cheap” look is animating an entire sentence block from opacity 0 to 1. Instead:

- Reveal by line.
- Or reveal by keyword group.
- Or use a highlight bar/wipe under one important word first, then bring in the rest.[cite:6]

Recommended pattern for a 2-line headline:

- Line 1 enters at frame 0.
- Line 2 enters at frame 4–8.
- Accent bar expands at frame 10.
- Supporting caption fades at frame 14.

```tsx
const line1Y = spring({frame: f, fps, config: {damping: 18, stiffness: 170}});
const line2Y = spring({frame: f - 6, fps, config: {damping: 18, stiffness: 170}});
const captionOpacity = interpolate(f, [14, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
```

### 3. Add hierarchy inside the text itself

If the reference style feels more premium, it is probably not because of more effects; it is because the text hierarchy is clearer. Try this exact hierarchy pattern:

- Eyebrow: small uppercase label, low contrast.
- Headline: biggest element in frame.
- One emphasized word: accent color or background chip.
- Supporting line: 35–45 percent smaller than headline.

Avoid using shadows and glow on text unless the whole reference style is intentionally neon.

## Improve motion design

### 1. Stop using the same spring everywhere

One spring preset across all elements makes motion feel generic. Use three motion families:

| Motion type | Use for | Frames | Feel |
|---|---|---:|---|
| Snappy | Chips, labels, icons | 6–12 | Fast, precise |
| Standard | Headlines, cards, media | 10–18 | Premium default |
| Heavy | Hero objects, large UI panels | 14–24 | Weighty |

The Remotion motion-design guidance specifically calls out overshoot vs. damped movement and stagger timing as meaningful creative choices rather than defaults.[cite:6]

Suggested presets:

```ts
export const springs = {
  snappy: {damping: 20, stiffness: 240, mass: 0.7},
  standard: {damping: 18, stiffness: 170, mass: 0.9},
  heavy: {damping: 20, stiffness: 120, mass: 1.1},
};
```

Use damped motion for most premium promo work. Overshoot should be rare and used only on playful accents.

### 2. Animate on one axis at a time

If an element scales, rotates, moves, blurs, and fades simultaneously, it usually looks amateurish. Pick one dominant transformation per layer:

- Headlines: Y-translate + opacity.
- Cards/UI panels: scale + opacity.
- Background shapes: slow drift only.
- Logos/icons: rotate a few degrees or scale slightly, not both.

### 3. Use stagger with exact offsets

The best-practice material highlights stagger intervals around small frame offsets instead of dumping all elements at once.[cite:6]

Use these hard rules:

- Related chips/cards: 3–5 frame offset.
- Text lines: 4–8 frame offset.
- Section items: 6–10 frame offset.
- Final CTA stacks: 2–4 frame offset for a tighter finish.

Example:

```tsx
{items.map((item, i) => (
  <AnimatedCard key={item.id} startFrame={sceneStart + i * 4} />
))}
```

### 4. Keep secondary motion alive during holds

A static hold should not mean a dead frame. During hold segments, keep one low-amplitude ambient motion active:

- Background scale from 1 to 1.03 over 40 frames.
- Subtle gradient drift.
- UI cursor blink.
- Slight parallax between foreground and background.

Keep that motion under 3 percent amplitude.

## Make scenes look more cinematic

### 1. Build depth using layers

Each scene should usually contain:

- Background layer.
- Midground texture or shape.
- Main content layer.
- Accent/highlight layer.
- Optional foreground blur/noise layer.

This matters more than adding effects. A plain background with floating text almost always looks unfinished.

Concrete recipe for a premium hero shot:

- Background: dark gradient or soft-image plate.
- Midground: 2 blurred soft shapes at 10–18 percent opacity.
- Main content: product/UI/text block.
- Accent: one sharp line, glow edge, or color chip.
- Foreground: 2 percent noise overlay for texture.

### 2. Use a grid, not guesswork

For 1920×1080, use a layout grid like:

- Outer margin: 120 px.
- Safe title width: 1680 px.
- 12-column grid.
- 24 px micro-spacing.
- 48 px standard gaps.
- 72–96 px major section gaps.

If your scenes currently feel “off,” it is often spacing inconsistency rather than animation.

### 3. Add texture carefully

Code-generated videos often look too clean. Add one of these, but only one:

- 1–3 percent monochrome noise overlay.
- Very subtle vignette.
- Soft light leak on scene transitions.
- Slight blur gradient behind text.

Do not stack grain, glow, vignette, particle field, and heavy gradients together.

## Replace weak transitions

### 1. Avoid default fade-to-next-scene over and over

If every scene crossfades, the edit feels flat. Rotate among 3 transition families:

- Directional push or slide.
- Mask/wipe reveal.
- Match-cut based on scale, position, or color.

### 2. Use transition logic

Use transitions that inherit meaning from the shot:

- Horizontal content should wipe horizontally.
- App/UI content can zoom from the focal card.
- Text-to-text cuts should match baseline or alignment.
- Product/logo sequences can use scale-match cuts.

### 3. Limit transition duration

At 30 fps:

- Micro cut accent: 4–6 frames.
- Standard transition: 8–12 frames.
- Big hero transition: 12–18 frames.

Anything longer than that feels mushy unless it is intentionally cinematic.

## Sync better with music and SFX

Even a visually average edit becomes much better if motion hits audio accents cleanly. If the target style feels sharp, it almost certainly aligns key visual events with beat or sound cues.

Do this exactly:

1. Mark every major beat in your audio track.
2. Put headline landings on beats, not the start of motion.
3. Put wipes/cuts 1–3 frames before strong impact sounds so the impact feels causal.
4. Add small whooshes only on large moves, not every animation.
5. Layer one subtle click/tick for UI reveals.

A useful timeline structure is:

- Frame of anticipation.
- Motion starts.
- Visual lands.
- Audio impact.
- 8–14 frame hold.

## Improve the Remotion codebase

### 1. Create reusable motion primitives

Do not animate each scene from scratch. Build shared components:

- `FadeSlideIn`
- `StaggerGroup`
- `ScaleIn`
- `TextRevealByLine`
- `AccentWipe`
- `SceneTransition`

Example:

```tsx
type FadeSlideInProps = {
  from?: number;
  y?: number;
  duration?: number;
  children: React.ReactNode;
};

export const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  from = 0,
  y = 40,
  duration = 16,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [from, from + duration], [y, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return <AbsoluteFill style={{opacity, transform: `translateY(${translateY}px)`}}>{children}</AbsoluteFill>;
};
```

### 2. Structure by scene and timing map

Use a central timing map instead of hardcoding frame numbers all over the project.

```ts
export const timeline = {
  intro: {start: 0, duration: 42},
  featureA: {start: 42, duration: 60},
  featureB: {start: 102, duration: 54},
  outro: {start: 156, duration: 48},
};
```

Then every component reads from that map. This makes pacing iteration much faster.

### 3. Keep player/render performance clean

Remotion’s current guidance recommends reducing unnecessary rerenders around the Player and memoizing `inputProps`, because frequent rerenders can bottleneck playback and editing responsiveness.[cite:9]

Apply these rules:

- Keep player UI and playback controls outside the composition tree when possible.[cite:9]
- Memoize all `inputProps` passed into the Player.[cite:9]
- Precompute expensive arrays, text splitting, and color maps with `useMemo`.
- Avoid generating random values during render; seed them once.
- Cache font loading and image metadata.

Use this exact pattern for inputs:

```tsx
const inputProps = useMemo(() => ({
  title,
  theme,
  palette,
}), [title, theme, palette]);
```

## Concrete scene recipes

### Scene recipe 1: headline opener

Use this when the video begins.

- Background starts at scale 1.08 and settles to 1.00 over 24 frames.
- Eyebrow fades in over 8 frames.
- Headline line 1 rises 32 px over 12 frames.
- Headline line 2 rises 32 px starting 6 frames later.
- Accent rectangle wipes left-to-right in 10 frames.
- Hold for 18 frames with only 1 percent background drift.

### Scene recipe 2: UI/demo reveal

Use this when showing a product screen or code result.

- Darkened background plate at 80–88 percent opacity.
- Main UI card scales from 0.94 to 1 over 14 frames.
- Secondary labels stagger in 4 frames apart.
- Pointer highlight or crop zoom draws attention to one feature.
- Exit with a 10-frame directional wipe following the interface flow.

### Scene recipe 3: stat/callout scene

Use this for metrics or key claims.

- Number appears first, large and bold.
- Unit/label enters 4 frames later.
- Supporting sentence fades in 8 frames later.
- Background bar graph or shape animates below at 20 percent contrast.
- Hold long enough to read: at least 36 frames.

## A strict checklist for your next version

Before rendering the next iteration, verify all of these:

- No scene has more than one main message.
- No more than two simultaneous primary motions in any 12-frame window.
- Headline text is manually line-broken.
- Every scene has at least one readable hold.
- Stagger offsets are intentional and measured in frames.
- Transition types vary across the edit.
- Ambient motion exists, but stays subtle.
- Audio hits are aligned to visual landings.
- Fonts, sizes, and spacing come from shared tokens.
- `inputProps` are memoized and expensive work is precomputed.[cite:9]

## Suggested 5-pass workflow

### Pass 1: timing only

Render grayscale blocks and text placeholders. Do not style anything. Lock scene durations first.

### Pass 2: typography and layout

Lock fonts, line breaks, scale, and spacing. Remove decorative layers until the frame reads clearly.

### Pass 3: motion

Add entrances, stagger, and exits. Check if any scene feels too busy; if yes, remove one motion layer before adding another.

### Pass 4: texture and transitions

Add grain, blur plates, highlights, and transition variety. Keep these restrained.

### Pass 5: audio polish and final optimization

Sync beats, trim dead frames, memoize expensive props, and test playback responsiveness in the player.[cite:9]

## What will most likely make the biggest visible difference

If only limited time is available, these four changes will produce the highest quality jump:

1. Replace block-level text fades with line-by-line or keyword-based text choreography.[cite:6][cite:7]
2. Introduce explicit scene holds and varied shot lengths instead of uniform timing.[cite:6]
3. Use 3 motion presets and consistent stagger offsets instead of one global spring.[cite:6]
4. Rebuild layouts on a grid with stronger scale contrast and fewer simultaneous elements.

## Final note about the reference

The provided reference URL currently resolves to a cartoon video page rather than a clearly identifiable motion-design exemplar, so matching it literally is not feasible from the supplied link alone.[cite:3] If the intended reference was a different edit, the fastest way to get a truly matched plan is to supply the exact working reference link or 3–5 screenshots from that video and then map your current scenes shot-by-shot against it.
