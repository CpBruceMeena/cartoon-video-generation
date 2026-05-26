import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface FadeSlideInProps {
	/** Frame offset to start the animation @default 0 */
	from?: number;
	/** Slide distance in pixels @default 40 */
	y?: number;
	/** Duration of the animation in frames @default 16 */
	duration?: number;
	/** Easing function @default undefined (linear) */
	easing?: (t: number) => number;
	/** Whether to apply as a wrapper (AbsoluteFill) or as inline style */
	mode?: 'fill' | 'inline';
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Fade + slide-up entrance animation.
 * Use for headlines, cards, and UI elements.
 *
 * Dominant transformation: Y-translate + opacity (one axis at a time).
 */
export const FadeSlideIn: React.FC<FadeSlideInProps> = ({
	from = 0,
	y = 40,
	duration = 16,
	mode = 'inline',
	children,
	style,
}) => {
	const frame = useCurrentFrame();
	const progress = frame - from;

	const opacity = interpolate(progress, [0, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(progress, [0, duration], [y, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const merged: React.CSSProperties = {
		opacity: opacity < 0 ? 0 : opacity,
		transform: `translateY(${translateY}px)`,
		...style,
	};

	if (mode === 'fill') {
		return <AbsoluteFill style={merged}>{children}</AbsoluteFill>;
	}

	return <div style={merged}>{children}</div>;
};
