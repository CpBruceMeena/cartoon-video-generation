import type { Expression, Gesture } from '../types';

// ─── Shared Types ──────────────────────────────────────────────────────────

export type { Expression };

export interface CharacterSVGProps {
	expression?: Expression;
	isSpeaking?: boolean;
	speakingFrame?: number;
	/** Per-frame RMS amplitude (0–1) for audio-driven mouth animation */
	amplitude?: number;
	/** Per-line gesture for arm/body pose */
	gesture?: Gesture;
}

// ─── Mouth Speaking Animation ─────────────────────────────────────────────

export function useMouthOpen(
	isSpeaking: boolean,
	speakingFrame: number,
	opts?: {
		frequency?: number;
		amplitude?: number;
		externalAmplitude?: number;
	},
) {
	const frequency = opts?.frequency ?? 0.25;
	const amplitude = opts?.amplitude ?? 10;
	const externalAmplitude = opts?.externalAmplitude ?? 0;

	// If external amplitude data is available (from audio), use it;
	// otherwise fall back to sine-wave approximation.
	// externalAmplitude is 0–1, scale it to the amplitude config range.
	const rawOpen = isSpeaking
		? externalAmplitude > 0
			? Math.min(1, externalAmplitude * 1.8) // boost for visual clarity
			: Math.abs(Math.sin(speakingFrame * frequency * Math.PI * 2))
		: 0;

	const mouthOpen = rawOpen;
	const mouthOpenAmount = mouthOpen * amplitude;
	const showInterior = mouthOpen > 0.3;

	return { mouthOpen, mouthOpenAmount, showInterior };
}

// ─── Eye Blink Animation ──────────────────────────────────────────────────

export function useEyeBlink(
	speakingFrame: number,
	expression: Expression,
	opts?: {
		cycleLength?: number;
		normalHeight?: number;
		happyHeight?: number;
		shockedHeight?: number;
		angryHeight?: number;
	},
) {
	const cycleLength = opts?.cycleLength ?? 100;
	const normalHeight = opts?.normalHeight ?? 8;
	const happyHeight = opts?.happyHeight ?? 8;
	const shockedHeight = opts?.shockedHeight ?? 12;
	const angryHeight = opts?.angryHeight ?? 8;

	const blinkCycle = speakingFrame % cycleLength;
	const isBlinking = blinkCycle > cycleLength - 6 && blinkCycle < cycleLength - 2;

	let blinkH: number;
	if (isBlinking) {
		blinkH = 1.5;
	} else {
		switch (expression) {
			case 'shocked':
				blinkH = shockedHeight;
				break;
			case 'happy':
				blinkH = happyHeight;
				break;
			case 'angry':
				blinkH = angryHeight;
				break;
			default:
				blinkH = normalHeight;
		}
	}

	return { isBlinking, blinkH };
}

// ─── Arm Swing / Wave Animation ───────────────────────────────────────────

// Gesture pose map — fixed arm angles for each gesture
const GESTURE_POSES: Record<string, { left: number; right: number }> = {
	default: { left: 0, right: 0 },
	waving: { left: -60, right: 10 },
	pointing: { left: -50, right: 20 },
	crossed: { left: -25, right: 25 },
	hips: { left: -35, right: -35 },
	thinking: { left: -45, right: -10 },
	surprised: { left: -55, right: -55 },
};

export function useArmAnimation(
	isSpeaking: boolean,
	speakingFrame: number,
	expression: Expression,
	opts?: {
		speakAmplitude?: number;
		speakFrequency?: number;
		idleAmplitude?: number;
		idleFrequency?: number;
		happyOffset?: number;
		angryOffset?: number;
		shockedOffset?: number;
		/** Additional static angle for the left arm (e.g. Doraemon's -30°) */
		defaultLeftOffset?: number;
		/** Additional static angle for the right arm (e.g. Doraemon's +30°) */
		defaultRightOffset?: number;
	},
	/** Per-line gesture override (overrides expression-based arm animation) */
	gesture?: Gesture,
) {
	const speakAmplitude = opts?.speakAmplitude ?? 16;
	const speakFrequency = opts?.speakFrequency ?? 0.22;
	const idleAmplitude = opts?.idleAmplitude ?? 3;
	const idleFrequency = opts?.idleFrequency ?? 0.04;
	const happyOffset = opts?.happyOffset ?? -15;
	const angryOffset = opts?.angryOffset ?? 10;
	const shockedOffset = opts?.shockedOffset ?? -22;
	const defaultLeft = opts?.defaultLeftOffset ?? 0;
	const defaultRight = opts?.defaultRightOffset ?? 0;

	// If a specific gesture is provided, use fixed pose angles
	if (gesture && gesture !== 'default') {
		const pose = GESTURE_POSES[gesture] ?? GESTURE_POSES.default!;
		// Add subtle idle sway to gesture poses for liveliness
		const sway = isSpeaking
			? Math.sin(speakingFrame * 0.1) * 3
			: Math.sin(speakingFrame * 0.03) * 1.5;
		return {
			leftArmAngle: pose.left + (gesture === 'waving' ? Math.sin(speakingFrame * 0.25) * 15 : sway),
			rightArmAngle: pose.right + sway,
			armSwing: 0,
		};
	}

	const armSwing = isSpeaking
		? Math.sin(speakingFrame * speakFrequency * Math.PI * 2) * speakAmplitude
		: Math.sin(speakingFrame * idleFrequency) * idleAmplitude;

	let exprArmOffset = 0;
	switch (expression) {
		case 'happy':
			exprArmOffset = happyOffset;
			break;
		case 'angry':
			exprArmOffset = angryOffset;
			break;
		case 'shocked':
			exprArmOffset = shockedOffset;
			break;
	}

	const leftArmAngle = defaultLeft + armSwing + exprArmOffset;
	const rightArmAngle = defaultRight - armSwing + exprArmOffset;

	return { leftArmAngle, rightArmAngle, armSwing };
}

// ─── Body Bounce / Wobble Animation ──────────────────────────────────────

export function useBodyMovement(
	isSpeaking: boolean,
	speakingFrame: number,
	expression: Expression,
	opts?: {
		bounceAmplitude?: number;
		bounceFrequency?: number;
		wobbleAmplitude?: number;
		wobbleFrequency?: number;
		/** Per-expression Y offsets for the entire body */
		happyExprOffset?: number;
		angryExprOffset?: number;
	},
) {
	const bounceAmplitude = opts?.bounceAmplitude ?? 3;
	const bounceFrequency = opts?.bounceFrequency ?? 0.2;
	const wobbleAmplitude = opts?.wobbleAmplitude ?? 0;
	const wobbleFrequency = opts?.wobbleFrequency ?? 0.15;
	const happyExprOffset = opts?.happyExprOffset ?? 0;
	const angryExprOffset = opts?.angryExprOffset ?? 0;

	const bodyBounce = isSpeaking
		? Math.sin(speakingFrame * bounceFrequency * Math.PI * 2) * bounceAmplitude
		: 0;

	const bodyWobble =
		wobbleAmplitude > 0
			? isSpeaking
				? Math.sin(speakingFrame * wobbleFrequency * Math.PI * 2) *
					wobbleAmplitude
				: 0
			: 0;

	let exprBounce = 0;
	switch (expression) {
		case 'happy':
			exprBounce = happyExprOffset;
			break;
		case 'angry':
			exprBounce = angryExprOffset;
			break;
	}

	return { bodyBounce: bodyBounce + exprBounce, bodyWobble };
}

// ─── Leg Bounce Animation ─────────────────────────────────────────────────

export function useLegBounce(
	isSpeaking: boolean,
	speakingFrame: number,
	opts?: {
		amplitude?: number;
		frequency?: number;
	},
) {
	const amplitude = opts?.amplitude ?? 4;
	const frequency = opts?.frequency ?? 0.25;

	return isSpeaking
		? Math.sin(speakingFrame * frequency * Math.PI * 2) * amplitude
		: 0;
}

// ─── Cape Sway Animation ─────────────────────────────────────────────────

export function useCapeSway(
	isSpeaking: boolean,
	speakingFrame: number,
	opts?: {
		amplitude?: number;
		frequency?: number;
		idleAmplitude?: number;
		idleFrequency?: number;
	},
) {
	const amplitude = opts?.amplitude ?? 6;
	const frequency = opts?.frequency ?? 0.15;
	const idleAmplitude = opts?.idleAmplitude ?? 2;
	const idleFrequency = opts?.idleFrequency ?? 0.03;

	return isSpeaking
		? Math.sin(speakingFrame * frequency * Math.PI * 2) * amplitude
		: Math.sin(speakingFrame * idleFrequency) * idleAmplitude;
}
