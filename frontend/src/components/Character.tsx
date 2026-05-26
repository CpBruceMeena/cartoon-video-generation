import React from 'react';
import { getCharacterSvg, getCharacterColor, getCharacterDisplayName, normalizeCharacterName, isKnownCharacter, type Expression } from '../characters/registry';

interface CharacterProps {
	type: string;
	style?: React.CSSProperties;
	expression?: Expression;
	isSpeaking?: boolean;
	/** Scene-relative frame */
	sceneFrame?: number;
	/** Frame within scene when this character started speaking (scene-relative) */
	speakingStartFrame?: number;
}

export const Character: React.FC<CharacterProps> = ({
	type,
	style,
	expression = 'normal',
	isSpeaking = false,
	sceneFrame = 0,
	speakingStartFrame = 0,
}) => {
	const normalized = normalizeCharacterName(type);
	const SvgComponent = getCharacterSvg(normalized);
	const accentColor = getCharacterColor(normalized);
	const displayName = getCharacterDisplayName(normalized);
	const svgRef = React.useRef<HTMLDivElement>(null);

	// Speaking animation: sinusoidal bob and subtle scale oscillation
	const speakingProgress = isSpeaking ? Math.max(0, sceneFrame - speakingStartFrame) : 0;

	let translateY = 0;
	let scale = 1;
	let rotate = 0;
	let filter = 'none';

	if (isSpeaking && speakingProgress >= 0) {
		// Speaking bob: more pronounced body movement when talking
		const bobAmplitude = 6;
		const bobSpeed = 0.3;
		const bob = Math.sin(speakingProgress * bobSpeed * Math.PI * 2) * bobAmplitude;
		translateY = bob;

		// Scale pulse to simulate breathing while talking
		const breathPulse = 1 + Math.sin(speakingProgress * 0.12) * 0.025;
		scale = breathPulse;

		// Head wobble / body sway
		rotate = Math.sin(speakingProgress * 0.18) * 2.5;
	} else {
		// Idle animation: gentle breathing sway
		const idleSway = Math.sin(sceneFrame * 0.04) * 2;
		translateY = idleSway;
		scale = 1;
		rotate = Math.sin(sceneFrame * 0.025) * 0.8;
	}

	// Expression-based visual effects
	switch (expression) {
		case 'happy':
			scale *= 1.04;
			filter = 'brightness(1.05) saturate(1.1)';
			break;
		case 'shocked':
			scale *= 1.08;
			filter = 'brightness(1.1) contrast(1.08) saturate(1.15)';
			break;
		case 'angry':
			scale *= 0.95;
			filter = 'saturate(1.3) hue-rotate(-8deg) brightness(0.95)';
			break;
	}

	// Entrance animation: slide up from bottom with bounce
	const entranceDuration = 14;
	let entranceOffset = 0;
	if (sceneFrame < entranceDuration) {
		const t = sceneFrame / entranceDuration;
		// Ease-out bounce effect
		const eased = 1 - Math.pow(1 - t, 3);
		const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 8;
		entranceOffset = (1 - eased) * 70 + bounce;
	}

	const transform = `translateX(-50%) translateY(${translateY + entranceOffset}px) scale(${scale}) rotate(${rotate}deg)`;

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
				transition: 'filter 0.2s ease',
			}}
			ref={svgRef}
		>
			{/* Speaking glow ring */}
			{isSpeaking && (
				<div
					style={{
						position: 'absolute',
						bottom: 30,
						width: 220,
						height: 40,
						background: `radial-gradient(ellipse, ${accentColor}33 0%, transparent 70%)`,
						borderRadius: '50%',
						opacity: 0.6,
						pointerEvents: 'none',
					}}
				/>
			)}

			{/* Speaking indicator pulse */}
			{isSpeaking && (
				<div
					style={{
						position: 'absolute',
						top: -10,
						width: 12,
						height: 12,
						borderRadius: '50%',
						backgroundColor: accentColor,
						opacity: 0.5 + Math.sin(sceneFrame * 0.3) * 0.3,
						boxShadow: `0 0 8px ${accentColor}`,
					}}
				/>
			)}

			{/* Character SVG */}
			<div style={{ position: 'relative' }}>
				{SvgComponent ? (
					<SvgComponent expression={expression} isSpeaking={isSpeaking} speakingFrame={speakingProgress} />
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
						<span style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10 }}>
							{isKnownCharacter(normalized) ? displayName : type}
						</span>
					</div>
				)}
			</div>

			{/* Character name label with accent color */}
			<div
				style={{
					marginTop: 6,
					padding: '4px 14px',
					backgroundColor: accentColor,
					borderRadius: 12,
					fontSize: 15,
					fontWeight: 'bold',
					fontFamily: 'Arial, sans-serif',
					color: '#fff',
					textAlign: 'center',
					boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
					opacity: isSpeaking ? 1 : 0.75,
				}}
			>
				{isKnownCharacter(normalized) ? displayName : type}
			</div>
		</div>
	);
};
