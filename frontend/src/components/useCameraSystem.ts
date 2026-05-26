import { useRef } from 'react';
import { spring, useVideoConfig, interpolate } from 'remotion';
import { springs } from '../config/springs';
import type { Expression } from '../types';

// ── Expression-to-camera mappings ────────────────────────────────────────
// Each expression defines zoom, shake (on onset, decaying), and optional
// comedy windup+punch. All driven by expression changes — no hardcoded
// frame numbers.

const EXPRESSION_ZOOM: Record<string, number> = {
	normal: 1,
	happy: 1.01,
	laughing: 0.98,
	shocked: 1.06,
	angry: 1.04,
	thinking: 1.02,
	sad: 1.03,
	listening: 1,
};

/** Shake: triggered on expression onset, decays exponentially */
interface ShakeDef {
	intensity: number;
	frequency: number;
	decayRate: number;
}

const EXPRESSION_SHAKE: Record<string, ShakeDef> = {
	shocked: { intensity: 3.5, frequency: 50, decayRate: 0.15 },
	laughing: { intensity: 1.8, frequency: 40, decayRate: 0.2 },
	angry: { intensity: 1.2, frequency: 30, decayRate: 0.1 },
	happy: { intensity: 0.6, frequency: 25, decayRate: 0.25 },
};

/** Comedy windup+punch: pull back then spring-snap on expression onset */
interface PunchlineDef {
	windupFrames: number;
	punchDistance: number;
}

const EXPRESSION_PUNCHLINE: Record<string, PunchlineDef> = {
	shocked: { windupFrames: 5, punchDistance: 14 },
	laughing: { windupFrames: 6, punchDistance: 10 },
	angry: { windupFrames: 4, punchDistance: 8 },
};

// ── Hook ──────────────────────────────────────────────────────────────────

export interface UseCameraSystemOptions {
	/** Scene-relative frame */
	sceneFrame: number;
	/** Active dialogue expression (null if no active dialogue) */
	expression: Expression | null;
	/** Number of speakers in the current scene */
	numSpeakers: number;
	/** Index of active speaker among speakersInScene (-1 if none) */
	activeSpeakerIndex: number;
}

export interface CameraSystemResult {
	/** CSS transform string (translateX + translateY + scale) */
	transform: string;
	panX: number;
	panY: number;
	zoom: number;
}

/**
 * useCameraSystem — Expression-driven camera with spring transitions.
 *
 * Replaces all hardcoded frame-magic-number camera logic with a declarative
 * system driven by dialogue expressions:
 *
 * - **Pan** toward active speaker (spring-heavy for smooth following)
 * - **Zoom** per expression (shocked→closeup, laughing→wide, etc.)
 * - **Shake** on expression onset (decays exponentially)
 * - **Windup + punch** on comedy-beat expressions (shocked, laughing, angry)
 *
 * Effects trigger naturally when a new dialogue line's expression starts,
 * eliminating the need for scene-specific frame offsets.
 */
export function useCameraSystem({
	sceneFrame,
	expression,
	numSpeakers,
	activeSpeakerIndex,
}: UseCameraSystemOptions): CameraSystemResult {
	const { fps } = useVideoConfig();

	// ── Track expression onset ─────────────────────────────────────────
	const prevRef = useRef<{ expression: string | null; startFrame: number }>({
		expression: null,
		startFrame: 0,
	});

	const keyChanged = expression !== prevRef.current.expression;
	if (keyChanged) {
		prevRef.current = { expression, startFrame: sceneFrame };
	}
	const onsetFrame = sceneFrame - prevRef.current.startFrame;

	// ── Pan toward active speaker ──────────────────────────────────────
	let targetPanX = 0;
	if (activeSpeakerIndex >= 0 && numSpeakers > 1) {
		targetPanX = interpolate(
			activeSpeakerIndex,
			[0, numSpeakers - 1],
			[-40, 40],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
		);
	}

	const panSpringProgress = spring({
		frame: sceneFrame,
		fps,
		config: springs.heavy, // slow, smooth follow
	});
	const panX = targetPanX * panSpringProgress;

	// ── Expression-driven zoom ─────────────────────────────────────────
	const targetZoom = expression ? (EXPRESSION_ZOOM[expression] ?? 1) : 1;

	const zoomSpringProgress = spring({
		frame: Math.max(0, onsetFrame),
		fps,
		config: { damping: 18, stiffness: 150, mass: 1.0 }, // gentle zoom transition
	});
	const zoom = 1 + (targetZoom - 1) * zoomSpringProgress;

	// ── Expression shake (onset only, decays) ──────────────────────────
	let shakeX = 0;
	let shakeY = 0;

	if (expression && EXPRESSION_SHAKE[expression]) {
		const def = EXPRESSION_SHAKE[expression];
		const decayedIntensity = def.intensity * Math.exp(-onsetFrame * def.decayRate);
		if (decayedIntensity > 0.15) {
			shakeX = Math.sin(onsetFrame * def.frequency) * decayedIntensity;
			shakeY = Math.cos(onsetFrame * def.frequency * 0.8) * decayedIntensity * 0.6;
		}
	}

	// ── Comedy windup + punch ──────────────────────────────────────────
	let windupOffset = 0;

	if (expression && EXPRESSION_PUNCHLINE[expression] && onsetFrame < 30) {
		const def = EXPRESSION_PUNCHLINE[expression];

		// Windup: pull back
		const windupProgress = onsetFrame < def.windupFrames
			? interpolate(onsetFrame, [0, def.windupFrames], [0, -def.punchDistance], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: -def.punchDistance;

		// Punch: spring snap after windup
		const punchSpringProgress = onsetFrame >= def.windupFrames
			? spring({
					frame: onsetFrame - def.windupFrames,
					fps,
					config: { damping: 8, stiffness: 300, mass: 0.6 },
				})
			: 0;

		windupOffset = windupProgress + punchSpringProgress * def.punchDistance * 1.5;
	}

	// ── Compose transform ──────────────────────────────────────────────
	const transform = `
		translateX(${(panX + shakeX + windupOffset).toFixed(1)}px)
		translateY(${shakeY.toFixed(1)}px)
		scale(${zoom.toFixed(4)})
	`;

	return { transform, panX, panY: shakeY, zoom };
}
