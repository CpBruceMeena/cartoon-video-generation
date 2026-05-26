import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface AccentWipeProps {
	/** Frame offset to start @default 0 */
	from?: number;
	/** Duration of the wipe @default 10 */
	duration?: number;
	/** Width of the accent bar @default 120 */
	width?: number;
	/** Height of the accent bar @default 4 */
	height?: number;
	/** Color of the accent @default '#FFD54F' */
	color?: string;
	/** Border radius @default 2 */
	radius?: number;
	style?: React.CSSProperties;
}

/**
 * Accent rectangle that wipes from left to right.
 * Use as a highlight under headlines or key information.
 *
 * Animation: width from 0 → target (left-to-right wipe).
 * Dominant transformation: width (one axis only).
 */
export const AccentWipe: React.FC<AccentWipeProps> = ({
	from = 0,
	duration = 10,
	width = 120,
	height = 4,
	color = '#FFD54F',
	radius = 2,
	style,
}) => {
	const frame = useCurrentFrame();
	const progress = frame - from;

	const wipeWidth = interpolate(progress, [0, duration], [0, width], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (progress < 0) return null;

	return (
		<div
			style={{
				height,
				width: wipeWidth,
				backgroundColor: color,
				borderRadius: radius,
				boxShadow: `0 0 12px ${color}66`,
				...style,
			}}
		/>
	);
};
