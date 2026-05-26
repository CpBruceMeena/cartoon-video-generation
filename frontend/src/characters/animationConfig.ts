// ─── Centralised Per-Character Animation Configuration ────────────────────
// Each character's animation parameters live here — not inside individual SVGs.
// To tweak a character's movements, edit this file. To add a new character's
// animation config, add an entry here and wire the hooks in the SVG.
// ────────────────────────────────────────────────────────────────────────────

// ─── Config type definitions ───────────────────────────────────────────────

export interface MouthConfig {
	frequency: number;
	amplitude: number;
}

export interface EyeBlinkConfig {
	cycleLength: number;
	normalHeight: number;
	happyHeight?: number;
	angryHeight?: number;
	shockedHeight?: number;
}

export interface ArmConfig {
	speakAmplitude: number;
	speakFrequency: number;
	idleAmplitude?: number;
	idleFrequency?: number;
	happyOffset?: number;
	angryOffset?: number;
	shockedOffset?: number;
	defaultLeftOffset?: number;
	defaultRightOffset?: number;
}

export interface BodyMovementConfig {
	bounceAmplitude?: number;
	bounceFrequency?: number;
	wobbleAmplitude?: number;
	wobbleFrequency?: number;
	happyExprOffset?: number;
	angryExprOffset?: number;
}

export interface LegBounceConfig {
	amplitude: number;
	frequency: number;
}

export interface CapeSwayConfig {
	amplitude: number;
	frequency: number;
	idleAmplitude: number;
	idleFrequency: number;
}

export interface CharacterAnimationConfig {
	mouth: MouthConfig;
	eyeBlink: EyeBlinkConfig;
	/** Set to true when the character uses a custom (non-height-based) eye blink */
	eyeCustom?: boolean;
	arm: ArmConfig;
	bodyMovement: BodyMovementConfig;
	legBounce?: LegBounceConfig;
	capeSway?: CapeSwayConfig;
}

// ─── Config map — one entry per character ──────────────────────────────────

type ConfigMap = Record<string, CharacterAnimationConfig>;

export const CHARACTER_ANIMATION_CONFIGS: ConfigMap = {
	// ── Shinchan ──────────────────────────────────────────────────────────
	shinchan: {
		mouth: { frequency: 0.32, amplitude: 16 },
		eyeBlink: {
			cycleLength: 100,
			normalHeight: 13,
			happyHeight: 7,
			shockedHeight: 18,
		},
		arm: {
			speakAmplitude: 28,
			speakFrequency: 0.22,
			idleAmplitude: 4,
			idleFrequency: 0.05,
			happyOffset: -30,
			angryOffset: 20,
			shockedOffset: -40,
		},
		bodyMovement: {
			bounceAmplitude: 4,
			bounceFrequency: 0.2,
			wobbleAmplitude: 3,
			wobbleFrequency: 0.18,
			happyExprOffset: -5,
			angryExprOffset: 4,
		},
		legBounce: { amplitude: 6, frequency: 0.3 },
	},

	// ── Doraemon ──────────────────────────────────────────────────────────
	doraemon: {
		mouth: { frequency: 0.22, amplitude: 20 },
		eyeBlink: {
			cycleLength: 95,
			normalHeight: 15,
			happyHeight: 12,
			shockedHeight: 22,
		},
		eyeCustom: true,
		arm: {
			speakAmplitude: 22,
			speakFrequency: 0.16,
			idleAmplitude: 4,
			idleFrequency: 0.04,
			happyOffset: -18,
			angryOffset: 14,
			shockedOffset: -30,
			defaultLeftOffset: -30,
			defaultRightOffset: 30,
		},
		bodyMovement: { bounceAmplitude: 4.5, bounceFrequency: 0.25, wobbleAmplitude: 1.5, wobbleFrequency: 0.12 },
	},
};

// ─── Helper — get config for a character by name ───────────────────────────

export function getCharacterAnimationConfig(name: string): CharacterAnimationConfig {
	const cfg = CHARACTER_ANIMATION_CONFIGS[name];
	if (!cfg) {
		// Sensible fallback so we never crash on unknown characters
		return {
			mouth: { frequency: 0.25, amplitude: 10 },
			eyeBlink: { cycleLength: 100, normalHeight: 8, shockedHeight: 11 },
			arm: {
				speakAmplitude: 16,
				speakFrequency: 0.22,
				happyOffset: -15,
				angryOffset: 10,
				shockedOffset: -22,
			},
			bodyMovement: { bounceAmplitude: 2.5, bounceFrequency: 0.2 },
		};
	}
	return cfg;
}
