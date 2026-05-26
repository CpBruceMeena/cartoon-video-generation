/**
 * Spring presets for consistent motion design.
 *
 * Three families:
 * - snappy:  Chips, labels, icons   (6–12 frames)
 * - standard: Headlines, cards, media (10–18 frames)
 * - heavy:   Hero objects, large UI  (14–24 frames)
 *
 * Use damped motion (no overshoot) for most premium promo work.
 * Overshoot should be rare, used only on playful accents.
 */
export const springs = {
	snappy: { damping: 20, stiffness: 240, mass: 0.7 },
	snappyOvershoot: { damping: 12, stiffness: 260, mass: 0.6 },
	standard: { damping: 18, stiffness: 170, mass: 0.9 },
	standardOvershoot: { damping: 10, stiffness: 180, mass: 0.8 },
	heavy: { damping: 20, stiffness: 120, mass: 1.1 },
	heavyOvershoot: { damping: 14, stiffness: 130, mass: 1.0 },
} as const;

export type SpringPreset = keyof typeof springs;
