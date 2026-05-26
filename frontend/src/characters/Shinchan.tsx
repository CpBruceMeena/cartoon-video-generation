import React from 'react';
import {
	useMouthOpen,
	useEyeBlink,
	useArmAnimation,
	useBodyMovement,
	useLegBounce,
	type CharacterSVGProps,
} from './useCharacterAnimation';
import { CHARACTER_ANIMATION_CONFIGS } from './animationConfig';

const cfg = CHARACTER_ANIMATION_CONFIGS.shinchan!;

export const ShinchanSVG: React.FC<CharacterSVGProps> = ({
	expression = 'normal',
	isSpeaking = false,
	speakingFrame = 0,
}) => {
	// ── Shared hooks ──────────────────────────────────────────────────────
	const { mouthOpen, mouthOpenAmount, showInterior } = useMouthOpen(
		isSpeaking,
		speakingFrame,
		cfg.mouth,
	);

	const { isBlinking, blinkH } = useEyeBlink(speakingFrame, expression, cfg.eyeBlink);

	const { leftArmAngle, rightArmAngle } = useArmAnimation(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.arm,
	);

	const { bodyBounce, bodyWobble } = useBodyMovement(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.bodyMovement,
	);

	const legBounce = useLegBounce(isSpeaking, speakingFrame, cfg.legBounce);

	// ── Character-specific offsets & expressions ──────────────────────────
	const eyeOffsetY = expression === 'happy' ? -3 : expression === 'angry' ? 2 : 0;

	// Eyebrow tilt — thicker anime-style brows
	const browTilt = expression === 'happy' ? -8 : expression === 'angry' ? 14 : expression === 'shocked' ? -16 : 0;
	const browTiltRight = expression === 'happy' ? -8 : expression === 'angry' ? 12 : expression === 'shocked' ? -16 : 0;

	// Hair bounce
	const hairSway = isSpeaking ? Math.sin(speakingFrame * 0.15) * 2 : 0;
	const hairSway2 = isSpeaking ? Math.sin(speakingFrame * 0.12 + 1.5) * 1.5 : 0;

	// Blush pulse
	const blushOpacity = expression === 'happy' ? 0.35 + Math.sin(speakingFrame * 0.2) * 0.12 : 0;

	// Sweat drops
	const sweatDropY1 = expression === 'shocked' ? 60 + (speakingFrame % 40) * 0.4 : 60;
	const sweatDropY2 = expression === 'shocked' ? 52 + ((speakingFrame + 20) % 40) * 0.35 : 52;

	// ── Mouth path — Shinchan's big expressive mouth ──────────────────────
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseOpen = 130 + mouthOpenAmount;
			if (expression === 'happy') return `M55 126 Q95 ${baseOpen + 22} 135 126`;
			if (expression === 'angry') return `M60 122 Q95 ${baseOpen - 10} 130 122`;
			if (expression === 'shocked') return `M65 114 Q95 ${baseOpen + 12} 125 114`;
			return `M55 124 Q95 ${baseOpen + 18} 135 124`;
		}
		switch (expression) {
			case 'happy': return 'M55 126 Q95 170 135 126';
			case 'angry': return 'M60 122 Q95 106 130 122';
			case 'shocked': return 'M65 114 Q95 155 125 114';
			default: return 'M55 124 Q95 160 135 124';
		}
	};

	const mouthFill =
		isSpeaking && mouthOpen > 0.3
			? '#1A1A1A'
			: expression === 'shocked'
				? '#333'
				: 'none';

	const STROKE = {
		thick: '#1A1A1A',
		thin: '#444',
		skin: '#A0784C',
	};

	const SW = 3; // thick stroke width for anime outlines

	return (
		<svg width='280' height='360' viewBox='0 0 200 280'>
			<defs>
				<radialGradient id='shinchan-skin' cx='50%' cy='40%' r='60%'>
					<stop offset='0%' stopColor='#FFD54F' />
					<stop offset='70%' stopColor='#FFCC80' />
					<stop offset='100%' stopColor='#F4A460' />
				</radialGradient>
				<linearGradient id='shinchan-shirt' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#EF5350' />
					<stop offset='50%' stopColor='#E53935' />
					<stop offset='100%' stopColor='#C62828' />
				</linearGradient>
				<linearGradient id='shinchan-shorts' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#FFEE58' />
					<stop offset='100%' stopColor='#FDD835' />
				</linearGradient>
				<linearGradient id='shinchan-hair' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#2C2C2C' />
					<stop offset='100%' stopColor='#1A1A1A' />
				</linearGradient>
				<filter id='shinchan-shadow'>
					<feDropShadow dx='0' dy='4' stdDeviation='4' floodColor='#000' floodOpacity='0.2' />
				</filter>
			</defs>

			<g
				filter='url(#shinchan-shadow)'
				transform={`translate(${bodyWobble}, ${bodyBounce})`}
			>
				{/* === LEGS (with bounce) === */}
				<g transform={`translate(0, ${legBounce})`}>
					<rect x='68' y='248' width='18' height='22' rx='5' fill='#FFCC80' stroke={STROKE.skin} strokeWidth={SW} />
					<rect x='114' y='248' width='18' height='22' rx='5' fill='#FFCC80' stroke={STROKE.skin} strokeWidth={SW} />
					{/* Socks */}
					<rect x='67' y='266' width='20' height='8' rx='3' fill='white' stroke='#CCC' strokeWidth='1.5' />
					<rect x='113' y='266' width='20' height='8' rx='3' fill='white' stroke='#CCC' strokeWidth='1.5' />
					{/* Shoes */}
					<ellipse cx='77' cy='278' rx='16' ry='8' fill='#5D4037' stroke='#3E2723' strokeWidth='2' />
					<ellipse cx='123' cy='278' rx='16' ry='8' fill='#5D4037' stroke='#3E2723' strokeWidth='2' />
				</g>

				{/* === SHORTS === */}
				<rect x='56' y='212' width='88' height='40' rx='6' fill='url(#shinchan-shorts)' stroke='#F9A825' strokeWidth={SW} />
				<rect x='56' y='210' width='88' height='7' rx='3.5' fill='#F9A825' />

				{/* === BODY / SHIRT === */}
				<rect x='54' y='135' width='92' height='82' rx='12' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth={SW} />

				{/* Shirt collar */}
				<path d='M80 135 L100 155 L120 135' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth='2.5' />
				<path d='M80 135 L95 150' fill='none' stroke='#C62828' strokeWidth='1.5' opacity='0.5' />
				<path d='M120 135 L105 150' fill='none' stroke='#C62828' strokeWidth='1.5' opacity='0.5' />

				{/* === ARMS === */}
				<g transform={`rotate(${leftArmAngle}, 54, 155)`}>
					<rect x='36' y='152' width='42' height='16' rx='8' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
					<circle cx='24' cy='156' r='11' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
				</g>
				<g transform={`rotate(${rightArmAngle}, 146, 155)`}>
					<rect x='122' y='152' width='42' height='16' rx='8' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
					<circle cx='176' cy='156' r='11' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
				</g>

				{/* === HEAD — larger oval for anime look === */}
				<ellipse cx='100' cy='78' rx='54' ry='60' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />

				{/* Hair — spikier, more character */}
				<g transform={`translate(${hairSway}, ${Math.abs(hairSway) * 0.3})`}>
					<path d='M48 54 Q52 18 76 16 Q85 10 100 12 Q115 10 124 16 Q148 18 152 54' fill='url(#shinchan-hair)' stroke={STROKE.thick} strokeWidth='2.5' />
					{/* Side tufts */}
					<path d='M48 54 Q42 60 44 68' fill='none' stroke={STROKE.thick} strokeWidth='5' strokeLinecap='round' />
					<path d='M152 54 Q158 60 156 68' fill='none' stroke={STROKE.thick} strokeWidth='5' strokeLinecap='round' />
					{/* Hair highlight */}
					<path d='M72 26 Q85 18 100 20 Q115 18 128 26' fill='none' stroke='#555' strokeWidth='2.5' opacity='0.35' />
				</g>
				{/* Extra hair tufts */}
				<g transform={`translate(${hairSway2}, ${Math.abs(hairSway2) * 0.2})`}>
					<path d='M56 34 Q50 24 58 20' fill='none' stroke={STROKE.thick} strokeWidth='3' strokeLinecap='round' />
					<path d='M144 32 Q150 22 142 18' fill='none' stroke={STROKE.thick} strokeWidth='3' strokeLinecap='round' />
				</g>

				{/* === EARS === */}
				<ellipse cx='46' cy='78' rx='9' ry='14' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
				<ellipse cx='154' cy='78' rx='9' ry='14' fill='url(#shinchan-skin)' stroke={STROKE.skin} strokeWidth={SW} />
				<ellipse cx='46' cy='78' rx='4' ry='7' fill='#F4A460' opacity='0.5' />
				<ellipse cx='154' cy='78' rx='4' ry='7' fill='#F4A460' opacity='0.5' />

				{/* === EYEBROWS — Shinchan's iconic thick brows === */}
				<g transform={`rotate(${browTilt}, 76, 64)`}>
					<rect x='58' y='56' width='36' height='12' rx='6' fill={STROKE.thick} />
				</g>
				<g transform={`rotate(${browTiltRight}, 124, 64)`}>
					<rect x='106' y='56' width='36' height='12' rx='6' fill={STROKE.thick} />
				</g>
				{/* Brow outline for extra thickness */}
				<g transform={`rotate(${browTilt}, 76, 64)`}>
					<rect x='58' y='56' width='36' height='12' rx='6' fill='none' stroke={STROKE.thick} strokeWidth='1' />
				</g>
				<g transform={`rotate(${browTiltRight}, 124, 64)`}>
					<rect x='106' y='56' width='36' height='12' rx='6' fill='none' stroke={STROKE.thick} strokeWidth='1' />
				</g>

				{/* === EYES — big round anime eyes === */}
				<ellipse cx='76' cy={`${82 + eyeOffsetY}`} rx='15' ry={blinkH} fill='white' stroke={STROKE.thin} strokeWidth='2.5' />
				<ellipse cx='124' cy={`${82 + eyeOffsetY}`} rx='15' ry={blinkH} fill='white' stroke={STROKE.thin} strokeWidth='2.5' />

				{!isBlinking && (
					<>
						{/* Pupils */}
						<circle cx='79' cy={`${84 + eyeOffsetY}`} r='6' fill={STROKE.thick} />
						<circle cx='127' cy={`${84 + eyeOffsetY}`} r='6' fill={STROKE.thick} />
						{/* Eye shines */}
						<circle cx='81' cy={`${80 + eyeOffsetY}`} r='3' fill='white' />
						<circle cx='129' cy={`${80 + eyeOffsetY}`} r='3' fill='white' />
						<circle cx='76' cy={`${86 + eyeOffsetY}`} r='1.5' fill='white' opacity='0.6' />
						<circle cx='124' cy={`${86 + eyeOffsetY}`} r='1.5' fill='white' opacity='0.6' />
					</>
				)}

				{/* === NOSE — tiny dot === */}
				<circle cx='100' cy='97' r='4' fill='#E8945E' stroke={STROKE.skin} strokeWidth='1.5' />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke={STROKE.thick} strokeWidth='3' strokeLinecap='round' />

				{showInterior && (
					<ellipse cx='95' cy={134 + mouthOpenAmount * 0.5} rx='14' ry='6' fill='#FF7979' opacity='0.7' />
				)}

				{/* === CHEEK BLUSH (when happy) === */}
				{expression === 'happy' && (
					<>
						<ellipse cx='52' cy='100' rx='14' ry='8' fill='#FF8A80' opacity={blushOpacity} />
						<ellipse cx='148' cy='100' rx='14' ry='8' fill='#FF8A80' opacity={blushOpacity} />
					</>
				)}

				{/* === ANGRY EFFECTS === */}
				{expression === 'angry' && (
					<>
						{/* Angry veins / forehead marks */}
						<path d='M90 46 L94 38 L98 46' fill='none' stroke='#C62828' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
						<path d='M98 44 L102 36 L106 44' fill='none' stroke='#C62828' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
					</>
				)}

				{/* === SHOCKED EFFECTS === */}
				{expression === 'shocked' && (
					<>
						<path d='M150 52 Q154 60 150 68 Q146 60 150 52' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1' />
						<path d='M50 52 Q54 60 50 68 Q46 60 50 52' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1' />
						{/* Sweat drops */}
						<ellipse cx='48' cy={sweatDropY1} rx='3.5' ry='5.5' fill='#64B5F6' opacity='0.8' />
						<ellipse cx='152' cy={sweatDropY2} rx='3' ry='4.5' fill='#64B5F6' opacity='0.6' />
					</>
				)}
			</g>
		</svg>
	);
};
