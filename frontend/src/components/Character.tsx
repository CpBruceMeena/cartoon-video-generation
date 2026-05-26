import React from 'react';
import { spring, useVideoConfig, interpolate, Easing } from 'remotion';
import { getCharacterSvg, getCharacterColor, getCharacterDisplayName, normalizeCharacterName, isKnownCharacter, type Expression } from '../characters/registry';

interface CharacterProps {
	type: string;
	style?: React.CSSProperties;
	expression?: Expression;
	/** Expression this character should show when listening (not speaking) */
	listeningExpression?: Expression;
	isSpeaking?: boolean;
	/** Scene-relative frame */
	sceneFrame?: number;
	/** Frame within scene when this character started speaking (scene-relative) */
	speakingStartFrame?: number;
	/** Facing direction: 1 = right (default), -1 = left (mirrored) */
	facing?: 1 | -1;
	/** Per-frame amplitude (0–1) for audio-driven mouth animation */
	amplitude?: number;
}

/**
 * Character component — wraps the SVG with entrance animation,
 * speaking indicators, expression effects, and idle movement.
 */
export const Character: React.FC<CharacterProps> = React.memo(({
	type,
	style,
	expression = 'normal',
	listeningExpression,
	isSpeaking = false,
	sceneFrame = 0,
	speakingStartFrame = 0,
	facing = 1,
	amplitude = 0,
}) => {
	const normalized = normalizeCharacterName(type);
	const SvgComponent = getCharacterSvg(normalized);
	const accentColor = getCharacterColor(normalized);
	const displayName = getCharacterDisplayName(normalized);
	const { fps } = useVideoConfig();

	// Determine effective expression: if speaking, use speaking expression;
	// if not speaking and we have a listening expression, use that;
	// otherwise fall through to normal
	const effectiveExpression = isSpeaking
		? expression
		: !isSpeaking && listeningExpression
			? listeningExpression
			: expression;

	// Speaking animation: sinusoidal bob and subtle scale oscillation
	const speakingProgress = isSpeaking
		? Math.max(0, sceneFrame - speakingStartFrame)
		: 0;

	let translateY = 0;
	let scale = 1;
	let rotate = 0;
	let filter = 'none';

	if (isSpeaking && speakingProgress >= 0) {
		// Speaking bob: more pronounced body movement when talking
		const bobAmplitude = 6;
		const bobSpeed = 0.28;
		const bob = Math.sin(speakingProgress * bobSpeed * Math.PI * 2) * bobAmplitude;
		translateY = bob;

		// Scale pulse to simulate breathing while talking
		const breathPulse = 1 + Math.sin(speakingProgress * 0.12) * 0.025;
		scale = breathPulse;

		// Head wobble / body sway — more expressive when talking
		rotate = Math.sin(speakingProgress * 0.2) * 3;
	} else if (effectiveExpression === 'listening') {
		// Listening animation: gentle nod / head tilt toward speaker
		const listenNod = Math.sin(sceneFrame * 0.06) * 2;
		const listenTilt = Math.sin(sceneFrame * 0.04) * 1.5;
		translateY = listenNod;
		scale = 1 + Math.sin(sceneFrame * 0.02) * 0.01;
		rotate = listenTilt;

		// Subtle dim when listening
		filter = 'brightness(0.95)';
	} else {
		// Idle animation: gentle breathing sway with slight rotation
		const idleSway = Math.sin(sceneFrame * 0.04) * 2.5;
		translateY = idleSway;
		scale = 1 + Math.sin(sceneFrame * 0.02) * 0.01;
		rotate = Math.sin(sceneFrame * 0.03) * 1.2;
	}

	// Expression-based visual effects (applied on top)
	switch (effectiveExpression) {
		case 'happy':
		case 'laughing':
			scale *= 1.05;
			filter = 'brightness(1.06) saturate(1.15)';
			break;
		case 'shocked':
			scale *= 1.08;
			filter = 'brightness(1.1) contrast(1.08) saturate(1.15)';
			break;
		case 'angry':
			scale *= 0.95;
			filter = 'saturate(1.35) hue-rotate(-8deg) brightness(0.93)';
			break;
		case 'thinking':
			scale *= 1.02;
			filter = 'saturate(0.9) brightness(0.96)';
			break;
		case 'listening':
			filter = 'brightness(0.95)';
			break;
		case 'sad':
			scale *= 0.97;
			filter = 'saturate(0.85) brightness(0.92)';
			break;
	}

	// ── Spring-based entrance animation with overshoot bounce ──────────
	const entranceSpring = spring({
		frame: Math.min(sceneFrame, 25),
		fps,
		config: { damping: 12, stiffness: 200, mass: 0.5 }, // overshoot bounce
	});
	const entranceOffset = interpolate(entranceSpring, [0, 1], [100, 0]);

	// ── Squash & stretch on entrance landing ───────────────────────────
	// Creates a brief elastic squash in Y (volume-preserving stretch in X)
	// at the moment the entrance lands (~frame 12-18)
	const squashFrame = Math.min(sceneFrame, 30);
	const squash = interpolate(
		squashFrame,
		[12, 15, 20],
		[1, 0.93, 1],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.elastic(1) },
	);
	const stretchX = 1 / squash;

	// Subtle idle dim when not speaking
	const idleOpacity = isSpeaking
		? 1
		: effectiveExpression === 'listening'
			? 0.95
			: 0.9 + Math.sin(sceneFrame * 0.02) * 0.05;

	// ── Speaking glow ring animation ───────────────────────────────────
	const glowPulse = 0.4 + Math.sin(sceneFrame * 0.12) * 0.25;
	const glowScale = 1 + Math.sin(sceneFrame * 0.08) * 0.05;

	const transform = `
		translateX(-50%)
		translateY(${translateY + entranceOffset}px)
		scaleX(${scale * stretchX * facing})
		scaleY(${scale * squash})
		rotate(${rotate}deg)
	`;

	return (
		<div
			style={{
				...style,
				position: 'absolute' as const,
				display: 'flex',
				flexDirection: 'column' as const,
				alignItems: 'center' as const,
				transform,
				filter,
				transition: 'filter 0.25s ease, opacity 0.3s ease',
				opacity: idleOpacity,
			}}
		>
			{/* Speaking glow ring */}
			{isSpeaking && (
				<div
					style={{
						position: 'absolute',
						bottom: 20,
						width: 240,
						height: 50,
						background: `radial-gradient(ellipse, ${accentColor}44 0%, ${accentColor}22 40%, transparent 70%)`,
						borderRadius: '50%',
						opacity: glowPulse,
						transform: `scale(${glowScale})`,
						pointerEvents: 'none',
					}}
				/>
			)}

			{/* Speaking indicator pulse — colored dot that pulses */}
			{isSpeaking && (
				<div
					style={{
						position: 'absolute',
						top: -14,
						width: 14,
						height: 14,
						borderRadius: '50%',
						backgroundColor: accentColor,
						opacity: 0.5 + Math.sin(sceneFrame * 0.35) * 0.35,
						boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}66`,
					}}
				/>
			)}

			{/* Character SVG */}
			<div style={{ position: 'relative' }}>
				{SvgComponent ? (
					<SvgComponent
						expression={expression}
						isSpeaking={isSpeaking}
						speakingFrame={speakingProgress}
						amplitude={amplitude}
					/>
				) : (
					<div
						style={{
							width: 150,
							height: 180,
							backgroundColor: '#ddd',
							border: '3px dashed #666',
							borderRadius: 15,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
							fontFamily: 'sans-serif',
						}}
					>
						<span style={{ fontSize: 40 }}>👤</span>
						<span
							style={{
								fontSize: 14,
								fontWeight: 'bold',
								color: '#333',
								marginTop: 10,
							}}
						>
							{isKnownCharacter(normalized)
								? displayName
								: type}
						</span>
					</div>
				)}
			</div>

			{/* Character name label with accent color */}
			<div
				style={{
					marginTop: 6,
					padding: '4px 15px',
					backgroundColor: accentColor,
					borderRadius: 14,
					fontSize: 15,
					fontWeight: 'bold',
					fontFamily: 'Arial, sans-serif',
					color: '#fff',
					textAlign: 'center',
					boxShadow: `0 2px 8px ${accentColor}66`,
					opacity: isSpeaking ? 1 : 0.7,
					transition: 'opacity 0.3s ease',
				}}
			>
				{isKnownCharacter(normalized) ? displayName : type}
			</div>
		</div>
	);
});
