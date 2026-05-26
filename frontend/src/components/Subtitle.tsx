import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { getSubtitleColors, normalizeCharacterName, type Expression } from '../characters/registry';

interface SubtitleProps {
	text: string;
	speaker?: string;
	expression?: Expression;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, speaker, expression }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// Subtle fade-in/out
	const fadeInEnd = Math.min(4, Math.floor(durationInFrames * 0.08));
	const fadeOutStart = Math.max(durationInFrames - 6, Math.floor(durationInFrames * 0.88));

	const opacity = interpolate(frame, [0, fadeInEnd, fadeOutStart, durationInFrames], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Slide-up animation
	const slideUp = interpolate(frame, [0, fadeInEnd], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Text scale pulse for emphasis
	const textScale = expression === 'shocked'
		? 1 + Math.sin(frame * 0.3) * 0.02
		: expression === 'happy'
			? 1 + Math.sin(frame * 0.2) * 0.01
			: 1;

	const speakerColors = speaker ? getSubtitleColors(normalizeCharacterName(speaker)) : undefined;

	// Pulse animation on the speaker badge when the character is speaking
	const badgePulse = 1 + Math.sin(frame * 0.15) * 0.03;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 80,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity,
				transform: `translateY(${slideUp}px)`,
				zIndex: 100,
			}}
		>
			{/* Speaker name badge with accent color and pulse */}
			{speaker && (
				<div
					style={{
						padding: '6px 22px',
						marginBottom: 10,
						backgroundColor: speakerColors?.bg || 'rgba(0,0,0,0.7)',
						borderRadius: '24px 24px 6px 6px',
						fontSize: 24,
						fontWeight: 'bold',
						fontFamily: 'Arial, Helvetica, sans-serif',
						color: speakerColors?.text || '#fff',
						textAlign: 'center',
						letterSpacing: 1,
						boxShadow: `0 2px 12px ${speakerColors?.accent || 'transparent'}66`,
						transform: `scale(${badgePulse})`,
						transition: 'transform 0.1s ease',
					}}
				>
					{speaker}
				</div>
			)}

			{/* Speech bubble with enhanced styling */}
			<div
				style={{
					padding: '18px 36px',
					maxWidth: '78%',
					backgroundColor: 'rgba(0, 0, 0, 0.78)',
					borderRadius: 20,
					fontSize: 44,
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontWeight: 'bold',
					color: '#fff',
					textAlign: 'center',
					lineHeight: 1.4,
					boxShadow: `0 6px 30px rgba(0,0,0,0.5), 0 0 60px ${speakerColors?.accent || 'transparent'}22`,
					border: speakerColors ? `2px solid ${speakerColors.accent}55` : '2px solid rgba(255,255,255,0.12)',
					transform: `scale(${textScale})`,
					transition: 'transform 0.15s ease',
					backdropFilter: 'blur(4px)',
					WebkitBackdropFilter: 'blur(4px)',
					textShadow: '0 2px 8px rgba(0,0,0,0.3)',
				}}
			>
				{text}
			</div>
		</div>
	);
};
