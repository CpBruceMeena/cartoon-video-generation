import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface ScaleInProps {
	from?: number;
	duration?: number;
	/** Starting scale @default 0.94 */
	startScale?: number;
	/** Whether to use as a fill wrapper or inline */
	mode?: 'fill' | 'inline';
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Scale-in entrance animation.
 * Use for cards, UI panels, and hero objects.
 *
 * Dominant transformation: scale + opacity (one axis at a time).
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
	from = 0,
	duration = 14,
	startScale = 0.94,
	mode = 'inline',
	children,
	style,
}) => {
	const frame = useCurrentFrame();
	const progress = frame - from;

	const opacity = interpolate(progress, [0, Math.min(6, duration)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(progress, [0, duration], [startScale, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const merged: React.CSSProperties = {
		opacity: progress < 0 ? 0 : opacity,
		transform: `scale(${progress < 0 ? startScale : scale})`,
		...style,
	};

	if (mode === 'fill') {
		return <AbsoluteFill style={merged}>{children}</AbsoluteFill>;
	}

	return <div style={merged}>{children}</div>;
};
