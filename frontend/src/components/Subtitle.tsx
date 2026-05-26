import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { getSubtitleColors, normalizeCharacterName, type Expression } from '../characters/registry';

interface SubtitleProps {
	text: string;
	speaker?: string;
	expression?: Expression;
}

/**
 * Anime-style subtitle with typewriter effect, character speech bubble,
 * and expressive animations driven by the dialogue expression.
 */
export const Subtitle: React.FC<SubtitleProps> = ({ text, speaker, expression }) => {
	const frame = useCurrentFrame();
	const { durationInFrames, fps } = useVideoConfig();

	// ── Fade in / out ──────────────────────────────────────────────────
	const fadeInEnd = Math.min(6, Math.floor(durationInFrames * 0.1));
	const fadeOutStart = Math.max(
		durationInFrames - 8,
		Math.floor(durationInFrames * 0.85),
	);

	const opacity = interpolate(
		frame,
		[0, fadeInEnd, fadeOutStart, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
	);

	// ── Spring entrance (bouncy slide-up) ──────────────────────────────
	const entrance = spring({
		frame,
		fps,
		config: { damping: 14, stiffness: 100, mass: 0.6 },
	});
	const slideUp = interpolate(entrance, [0, 1], [30, 0]);
	const bubbleScale = interpolate(entrance, [0, 1], [0.85, 1]);

	// ── Typewriter: reveal characters progressively ────────────────────
	const CHARS_PER_SECOND = 20; // ~20 chars/sec
	const charsPerFrame = CHARS_PER_SECOND / fps;
	const typewriterProgress = Math.min(frame * charsPerFrame, text.length);
	const displayText = text.slice(0, Math.floor(typewriterProgress));

	// ── Expression-driven scale pulse ──────────────────────────────────
	const textScale =
		expression === 'shocked'
			? 1 + Math.sin(frame * 0.3) * 0.03
			: expression === 'happy'
				? 1 + Math.sin(frame * 0.2) * 0.015
				: 1;

	// ── Speaker badge colors ───────────────────────────────────────────
	const speakerColors = speaker
		? getSubtitleColors(normalizeCharacterName(speaker))
		: undefined;

	// Badge bouncy pulse
	const badgePulse = 1 + Math.sin(frame * 0.18) * 0.04;

	// ── Key word emphasis: bold highlight words longer than 6 chars ────
	const formattedText = useMemo(() => {
		const words = displayText.split(/(\s+)/);
		return words.map((word, i) => {
			const clean = word.replace(/[^a-zA-Z]/g, '');
			if (clean.length >= 7 && frame > 5) {
				// Emphasize longer words with a subtle highlight
				const emphasis = 1 + Math.sin(frame * 0.12 + i) * 0.05;
				return (
					<span
						key={i}
						style={{
							color: speakerColors?.accent || '#FFD54F',
							transform: `scale(${emphasis})`,
							display: 'inline-block',
						}}
					>
						{word}
					</span>
				);
			}
			return <span key={i}>{word}</span>;
		});
	}, [displayText, frame, speakerColors]);

	// ── Trailing ellipsis blink while typewriter is active ──────────────
	const showCursor = typewriterProgress < text.length;
	const cursorOpacity = 0.5 + Math.sin(frame * 0.2) * 0.4;

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
			{/* ── Speaker name badge ──────────────────────────────────── */}
			{speaker && (
				<div
					style={{
						padding: '5px 20px',
						marginBottom: 8,
						backgroundColor:
							speakerColors?.bg || 'rgba(0,0,0,0.7)',
						borderRadius: '20px 20px 4px 4px',
						fontSize: 22,
						fontWeight: 'bold',
						fontFamily:
							'Arial, "Hiragino Sans", "Noto Sans JP", sans-serif',
						color: speakerColors?.text || '#fff',
						textAlign: 'center',
						letterSpacing: 1.5,
						boxShadow: `0 2px 14px ${speakerColors?.accent || 'transparent'}66`,
						transform: `scale(${badgePulse})`,
					}}
				>
					{speaker}
				</div>
			)}

			{/* ── Speech bubble ───────────────────────────────────────── */}
			<div
				style={{
					position: 'relative',
					padding: '16px 32px',
					maxWidth: '78%',
					backgroundColor: 'rgba(0, 0, 0, 0.82)',
					borderRadius: 18,
					fontSize: 42,
					fontFamily:
						'Arial, "Hiragino Sans", "Noto Sans JP", sans-serif',
					fontWeight: 'bold',
					color: '#fff',
					textAlign: 'center',
					lineHeight: 1.35,
					boxShadow: `
						0 6px 30px rgba(0,0,0,0.5),
						0 0 60px ${speakerColors?.accent || 'transparent'}22,
						inset 0 1px 0 rgba(255,255,255,0.08)
					`,
					border: speakerColors
						? `2px solid ${speakerColors.accent}44`
						: '2px solid rgba(255,255,255,0.1)',
					transform: `scale(${bubbleScale * textScale})`,
					backdropFilter: 'blur(6px)',
					WebkitBackdropFilter: 'blur(6px)',
					textShadow: '0 2px 8px rgba(0,0,0,0.3)',
				}}
			>
				{/* Speech bubble tail pointing down toward speaker */}
				<div
					style={{
						position: 'absolute',
						bottom: -10,
						left: '50%',
						marginLeft: -10,
						width: 0,
						height: 0,
						borderLeft: '10px solid transparent',
						borderRight: '10px solid transparent',
						borderTop: `10px solid ${speakerColors?.bg || 'rgba(0,0,0,0.82)'}`,
						filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
					}}
				/>

				{/* Typewriter text with word emphasis */}
				{formattedText}

				{/* Cursor blink while typing */}
				{showCursor && (
					<span
						style={{
							opacity: cursorOpacity,
							color: speakerColors?.accent || '#FFD54F',
							fontSize: 36,
							marginLeft: 2,
						}}
					>
						▍
					</span>
				)}
			</div>
		</div>
	);
};
