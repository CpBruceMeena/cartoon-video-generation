import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface SceneTransitionProps {
	/** Type of transition effect */
	type?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'zoomIn' | 'wipeLeft';
	/** Duration in frames @default 12 */
	duration?: number;
	/** Frame offset to start @default 0 */
	from?: number;
	children: React.ReactNode;
}

/**
 * Scene transition wrapper.
 * Applies the exit animation to the outgoing content.
 *
 * For entrance transitions, wrap the incoming scene content instead.
 *
 * Transition families to vary across the edit:
 * - Directional push/slide
 * - Mask/wipe reveal
 * - Match-cut based on scale, position, or color
 */
export const SceneTransition: React.FC<SceneTransitionProps> = ({
	type = 'fade',
	duration = 12,
	from = 0,
	children,
}) => {
	const frame = useCurrentFrame();
	const progress = frame - from;

	const t = Math.min(1, Math.max(0, progress / duration));

	const getTransform = () => {
		switch (type) {
			case 'fade':
				return { opacity: 1 - t };
			case 'slideLeft':
				return {
					opacity: 1 - t,
					transform: `translateX(${-1920 * t}px)`,
				};
			case 'slideRight':
				return {
					opacity: 1 - t,
					transform: `translateX(${1920 * t}px)`,
				};
			case 'slideUp':
				return {
					opacity: 1 - t,
					transform: `translateY(${-1080 * t}px)`,
				};
			case 'zoomIn':
				return {
					opacity: 1 - t,
					transform: `scale(${1 + 0.3 * t})`,
				};
			case 'wipeLeft': {
				const clip = interpolate(t, [0, 1], [100, 0]);
				return {
					clipPath: `inset(0 0 0 ${clip}%)`,
				};
			}
			default:
				return { opacity: 1 - t };
		}
	};

	return (
		<AbsoluteFill
			style={{
				...getTransform(),
				transformOrigin: 'center center',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
