import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { type } from '../../config/type';
import { springs } from '../../config/springs';

interface TextRevealByLineProps {
	/** Array of text lines to reveal sequentially */
	lines: string[];
	/** Frame offset to start @default 0 */
	from?: number;
	/** Stagger offset between lines @default 6 */
	stagger?: number;
	/** Duration of each line's reveal @default 12 */
	duration?: number;
	/** Style overrides for the container */
	style?: React.CSSProperties;
	/** Typography token to use @default 'h2' */
	variant?: keyof typeof type;
	/** Text alignment @default 'center' */
	align?: 'left' | 'center' | 'right';
	/** Accent color for the reveal underline */
	accentColor?: string;
}

/**
 * Line-by-line text reveal with an accent underline.
 *
 * Instead of animating an entire paragraph from opacity 0→1,
 * reveal each line with a stagger offset.
 * The accent underline wipes in after the last line.
 *
 * Recommended pattern for a 2-line headline:
 * - Line 1 enters at frame 0
 * - Line 2 enters at frame 4–8
 * - Accent bar expands at frame 10
 */
export const TextRevealByLine: React.FC<TextRevealByLineProps> = ({
	lines,
	from = 0,
	stagger = 6,
	duration = 12,
	style,
	variant = 'h2',
	align = 'center',
	accentColor = '#FFD54F',
}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				textAlign: align,
				...style,
			}}
		>
			{lines.map((line, i) => {
				const localFrame = frame - from - i * stagger;
				const opacity = interpolate(localFrame, [0, duration], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const translateY = interpolate(localFrame, [0, duration], [30, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

				return (
					<div
						key={i}
						style={{
							fontSize: type[variant].fontSize,
							lineHeight: type[variant].lineHeight,
							fontWeight: type[variant].fontWeight,
							fontFamily: '"Helvetica Neue", "Segoe UI", Arial, sans-serif',
							color: '#fff',
							opacity: localFrame < 0 ? 0 : opacity,
							transform: `translateY(${localFrame < 0 ? 30 : translateY}px)`,
							marginBottom: 8,
							whiteSpace: 'nowrap',
						}}
					>
						{line}
					</div>
				);
			})}

			{/* Accent underline — wipes in after all lines */}
			{(() => {
				const accentStart = from + lines.length * stagger;
				const accentFrame = frame - accentStart;
				const accentWidth = interpolate(accentFrame, [0, 10], [0, 120], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

				if (accentFrame < 0) return null;

				return (
					<div
						style={{
							height: 4,
							width: accentWidth,
							backgroundColor: accentColor,
							borderRadius: 2,
							marginTop: 12,
							marginLeft: align === 'center' ? 'auto' : undefined,
							marginRight: align === 'center' ? 'auto' : undefined,
							boxShadow: `0 0 12px ${accentColor}66`,
						}}
					/>
				);
			})()}
		</div>
	);
};
