import { useRef } from 'react';
import { spring, useVideoConfig } from 'remotion';

/**
 * useExpressionMorph — Smooth spring-based interpolation between expression states.
 *
 * When `expression` changes, this hook:
 * 1. Captures the current expression's config as the "from" state
 * 2. Uses Remotion's spring physics to smoothly transition to the "to" state
 * 3. Returns the interpolated config values
 *
 * The mouth/path-based changes snap instantly while eyebrows, eyes, body posture
 * morph smoothly — creating a natural, expressive look.
 *
 * @param expression - Current expression name (e.g. 'happy', 'angry')
 * @param frame - A monotonically increasing frame counter (e.g. speakingFrame or sceneFrame)
 * @param configs - Expression config map where each expression maps to { [key: string]: number }
 * @param springConfig - Optional spring config for the transition
 * @returns Smoothly interpolated config values for the current expression
 */
export function useExpressionMorph<T extends {}>(
	expression: string,
	frame: number,
	configs: Record<string, T>,
	springConfig?: {
		damping?: number;
		stiffness?: number;
		mass?: number;
	},
): T {
	const { fps } = useVideoConfig();

	// Track the expression state across renders
	const stateRef = useRef<{
		currentExpression: string;
		fromConfig: T;
		transitionStartFrame: number;
		prevExpression: string;
	}>({
		currentExpression: expression,
		fromConfig: configs[expression] ?? (configs as any).normal,
		transitionStartFrame: 0,
		prevExpression: expression,
	});

	// When expression changes, freeze the "from" config and reset transition timer
	if (expression !== stateRef.current.prevExpression) {
		const prevExpr = stateRef.current.prevExpression;
		stateRef.current = {
			currentExpression: expression,
			fromConfig: configs[prevExpr] ?? (configs as any).normal,
			transitionStartFrame: frame,
			prevExpression: expression,
		};
	}

	const { fromConfig, transitionStartFrame } = stateRef.current;
	const elapsed = frame - transitionStartFrame;
	const toConfig: T = configs[expression] ?? (configs as any).normal;

	// Use spring for natural-feeling morphing
	const springProgress = spring({
		frame: elapsed,
		fps,
		config: {
			damping: springConfig?.damping ?? 15,
			stiffness: springConfig?.stiffness ?? 120,
			mass: springConfig?.mass ?? 0.8,
		},
	});

	// Interpolate all numeric keys in the config
	const interpolated = {} as T;
	const keys = Object.keys(toConfig) as Array<keyof T>;

	for (const key of keys) {
		const fromVal = Number((fromConfig as any)[key]) ?? 0;
		const toVal = Number((toConfig as any)[key]) ?? 0;
		(interpolated as any)[key] = fromVal + (toVal - fromVal) * springProgress;
	}

	return interpolated;
}

/**
 * useExpressionMorphValue — For a single numeric value that changes with expression.
 * Simpler alternative to useExpressionMorph when you only need to interpolate one value.
 */
export function useExpressionMorphValue(
	expression: string,
	frame: number,
	values: Record<string, number>,
	springConfig?: {
		damping?: number;
		stiffness?: number;
		mass?: number;
	},
): number {
	const { fps } = useVideoConfig();

	const stateRef = useRef({
		prevExpression: expression,
		fromValue: values[expression] ?? 0,
		transitionStartFrame: 0,
	});

	if (expression !== stateRef.current.prevExpression) {
		stateRef.current = {
			prevExpression: expression,
			fromValue: values[stateRef.current.prevExpression] ?? 0,
			transitionStartFrame: frame,
		};
	}

	const elapsed = frame - stateRef.current.transitionStartFrame;
	const toValue = values[expression] ?? 0;

	const springProgress = spring({
		frame: elapsed,
		fps,
		config: {
			damping: springConfig?.damping ?? 15,
			stiffness: springConfig?.stiffness ?? 120,
			mass: springConfig?.mass ?? 0.8,
		},
	});

	return stateRef.current.fromValue + (toValue - stateRef.current.fromValue) * springProgress;
}
