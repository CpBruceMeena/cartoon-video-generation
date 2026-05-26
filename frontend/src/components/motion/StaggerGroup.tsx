import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface StaggerGroupProps {
	/** Frame offset to start the stagger @default 0 */
	from?: number;
	/** Frame offset between each child @default 4 */
	stagger?: number;
	/** Duration of each child's fade-in @default 12 */
	duration?: number;
	/** Slide-up distance per child @default 20 */
	y?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Staggered entrance for a group of children.
 * Each child enters `stagger` frames after the previous one,
 * with a fade + slide-up animation.
 *
 * Use staggered offsets instead of everything appearing at once.
 * - Related chips/cards: 3–5 frame offset
 * - Text lines: 4–8 frame offset
 * - Section items: 6–10 frame offset
 * - Final CTA stacks: 2–4 frame offset
 */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
	from = 0,
	stagger = 4,
	duration = 12,
	y = 20,
	children,
	style,
}) => {
	const frame = useCurrentFrame();

	const items = React.Children.toArray(children);

	return (
		<div style={style}>
			{items.map((child, i) => {
				const localFrame = frame - from - i * stagger;
				const opacity = interpolate(localFrame, [0, duration], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const translateY = interpolate(localFrame, [0, duration], [y, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

				return (
					<div
						key={i}
						style={{
							opacity: localFrame < 0 ? 0 : opacity,
							transform: `translateY(${localFrame < 0 ? y : translateY}px)`,
						}}
					>
						{child}
					</div>
				);
			})}
		</div>
	);
};
