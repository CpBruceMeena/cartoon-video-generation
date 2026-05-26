/**
 * Typography system tokens for 1080p composition.
 * Use these instead of ad-hoc font sizes across components.
 */
export const type = {
	eyebrow: { fontSize: 28, letterSpacing: 2, fontWeight: 600, lineHeight: 1.1 },
	h1: { fontSize: 110, lineHeight: 0.92, fontWeight: 800 as const },
	h2: { fontSize: 72, lineHeight: 0.95, fontWeight: 750 as const },
	h3: { fontSize: 56, lineHeight: 1.0, fontWeight: 700 as const },
	body: { fontSize: 36, lineHeight: 1.2, fontWeight: 500 as const },
	meta: { fontSize: 24, lineHeight: 1.2, fontWeight: 500 as const },
	small: { fontSize: 18, lineHeight: 1.3, fontWeight: 400 as const },
} as const;

/**
 * Font families used in the project.
 */
export const fonts = {
	display: '"Helvetica Neue", "Segoe UI", Arial, sans-serif',
	body: '"Inter", "Helvetica Neue", Arial, sans-serif',
	mono: '"Fira Code", "Consolas", monospace',
	jp: '"Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif',
	/** Nunito — rounded cartoon font for subtitles */
	subtitle: '"Nunito", "Hiragino Sans", "Noto Sans JP", sans-serif',
} as const;

/**
 * Standard spacing units for the layout grid.
 * 1920×1080 base, 12-column grid.
 */
export const spacing = {
	outerMargin: 120,
	safeTitleWidth: 1680,
	micro: 24,
	standard: 48,
	major: 72,
	section: 96,
} as const;

/**
 * Standard durations for motion beats (in frames at 24fps).
 */
export const beats = {
	micro: 6,
	fast: 12,
	standard: 16,
	slow: 24,
	hero: 36,
	hold: 48,
} as const;

/**
 * Motion-beat structure for a typical scene:
 * setup → reveal → hold → exit
 */
export const sceneBeat = {
	setup: { min: 8, max: 20 },
	reveal: { min: 10, max: 18 },
	hold: { min: 20, max: 50 },
	exit: { min: 6, max: 14 },
} as const;
