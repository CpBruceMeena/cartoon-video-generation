import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { getSubtitleColors, normalizeCharacterName, type Expression } from '../characters/registry';
import { type, fonts } from '../config/type';
import { springs } from '../config/springs';

interface SubtitleProps {
	text: string;
	speaker?: string;
	expression?: Expression;
}

/**
 * Anime-style subtitle with line-by-line typewriter reveal,
 * character-colored accents, and expressive animations.
 */
export const Subtitle: React.FC<SubtitleProps> = ({ text, speaker, expression }) => {
	const frame = useCurrentFrame();
	const { durationInFrames, fps } = useVideoConfig();

	// ── Split text into logical lines for staggered reveal ──────────────
	const lines = useMemo(() => {
		// Split by natural pauses (periods, question marks, exclamations, ellipsis)
		const raw = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
		// If only one chunk, split long text at word boundaries
		if (raw.length <= 1 && text.length > 30) {
			const midpoint = Math.ceil(text.length / 2);
			const breakAt = text.indexOf(' ', midpoint);
			if (breakAt > 0) {
				return [text.slice(0, breakAt), text.slice(breakAt + 1)];
			}
		}
		return raw.length > 0 ? raw : [text];
	}, [text]);

	// ── Fade in / out ──────────────────────────────────────────────────
	const fadeInEnd = Math.min(6, Math.floor(durationInFrames * 0.08));
	const fadeOutStart = Math.max(
		durationInFrames - 10,
		Math.floor(durationInFrames * 0.82),
	);

	const opacity = interpolate(
		frame,
		[0, fadeInEnd, fadeOutStart, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
	);

	// ── Spring entrance (pop-in from meta-review: damping:15, stiffness:300) ──
	const entrance = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 300, mass: 0.6 },
	});
	const slideUp = interpolate(entrance, [0, 1], [20, 0]);
	const bubbleScale = interpolate(entrance, [0, 1], [0.92, 1]);

	// ── Line-by-line stagger reveal ─────────────────────────────────────
	const LINE_STAGGER = 6;
	const LINE_REVEAL = 10;

	// ── Typewriter for current line (characters reveal progressively) ───
	const currentLineIndex = lines.length > 0
		? Math.min(Math.floor(frame / LINE_STAGGER), lines.length - 1)
		: 0;
	const typewriterFrame = frame - currentLineIndex * LINE_STAGGER - LINE_REVEAL;
	const CHARS_PER_SECOND = 20;
	const charsPerFrame = CHARS_PER_SECOND / fps;
	const currentLine = lines.length > 0 ? lines[currentLineIndex] : undefined;
	const currentLineLen = currentLine?.length ?? 0;
	const typewriterProgress = Math.max(
		0,
		Math.min(typewriterFrame * charsPerFrame, currentLineLen),
	);

	// Build the displayed text: fully revealed lines + partly revealed current
	const displayLines = lines.map((line, i) => {
		if (i < currentLineIndex) return line;
		if (i === currentLineIndex) return line.slice(0, Math.floor(typewriterProgress));
		return '';
	});

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
	const badgePulse = 1 + Math.sin(frame * 0.18) * 0.04;

	// ── Key word emphasis ──────────────────────────────────────────────
	const formattedLines = useMemo(() => {
		return displayLines.map((line, lineIdx) => {
			if (!line) return null;
			const words = line.split(/(\s+)/);
			return (
				<div key={lineIdx} style={{ marginBottom: lineIdx < lines.length - 1 ? 6 : 0 }}>
					{words.map((word, w) => {
						const clean = word.replace(/[^a-zA-Z]/g, '');
						if (clean.length >= 7 && frame > 5) {
							const emphasis = 1 + Math.sin(frame * 0.12 + w) * 0.05;
							return (
								<span
									key={w}
									style={{
										color: speakerColors?.accent || '#FFD54F',
										transform: `scale(${emphasis})`,
										display: 'inline-block',
										WebkitTextStroke: '1.5px rgba(0,0,0,0.4)',
									}}
								>
									{word}
								</span>
							);
						}
						return <span key={w} style={{ WebkitTextStroke: '1.5px rgba(0,0,0,0.4)' }}>{word}</span>;
					})}
				</div>
			);
		});
	}, [displayLines, frame, speakerColors]);

	// ── Cursor blink while typewriter is active ─────────────────────────
	const showCursor = lines.length > 0 && (currentLineIndex < lines.length - 1 || typewriterProgress < currentLineLen);
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
						backgroundColor: speakerColors?.bg || 'rgba(0,0,0,0.7)',
						borderRadius: '20px 20px 4px 4px',
						fontSize: type.meta.fontSize,
						fontWeight: type.meta.fontWeight,
						letterSpacing: type.eyebrow.letterSpacing,
						fontFamily: fonts.display,
						color: speakerColors?.text || '#fff',
						textAlign: 'center',
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
					padding: '16px 32px 16px 40px',
					maxWidth: '78%',
					backgroundColor: 'rgba(0, 0, 0, 0.82)',
					borderRadius: 18,
					fontSize: type.body.fontSize,
					lineHeight: type.body.lineHeight,
					fontFamily: fonts.jp,
					fontWeight: type.body.fontWeight,
					color: '#fff',
					textAlign: 'center',
					boxShadow: `
						0 6px 30px rgba(0,0,0,0.5),
						0 0 60px ${speakerColors?.accent || 'transparent'}22,
						inset 0 1px 0 rgba(255,255,255,0.08)
					`,
					border: '2px solid rgba(255,255,255,0.1)',
					borderLeft: speakerColors
						? `6px solid ${speakerColors.accent}`
						: '6px solid transparent',
					transform: `scale(${bubbleScale * textScale})`,
					backdropFilter: 'blur(6px)',
					WebkitBackdropFilter: 'blur(6px)',
					textShadow: '0 2px 8px rgba(0,0,0,0.3)',
				}}
			>
				{/* Speech bubble tail */}
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

				{/* Line-by-line typewriter text */}
				{formattedLines}

				{/* Cursor blink */}
				{showCursor && (
					<span
						style={{
							opacity: cursorOpacity,
							color: speakerColors?.accent || '#FFD54F',
							fontSize: type.body.fontSize * 0.85,
							marginLeft: 2,
							WebkitTextStroke: '1.5px rgba(0,0,0,0.4)',
						}}
					>
						▍
					</span>
				)}

				{/* Accent underline on fully revealed lines */}
				{lines.length > 0 && currentLineIndex >= lines.length - 1 && typewriterProgress >= currentLineLen && (
					<div
						style={{
							height: 3,
							width: 80,
							backgroundColor: speakerColors?.accent || '#FFD54F',
							borderRadius: 2,
							margin: '12px auto 0',
							opacity: 0.6,
							boxShadow: `0 0 8px ${speakerColors?.accent || '#FFD54F'}44`,
						}}
					/>
				)}
			</div>
		</div>
	);
};
