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

	// Eyebrow tilt: happy = raised, angry = lowered sharply, shocked = very high
	const browTilt = expression === 'happy' ? -6 : expression === 'angry' ? 12 : expression === 'shocked' ? -14 : 0;
	const browTiltRight = expression === 'happy' ? -6 : expression === 'angry' ? 10 : expression === 'shocked' ? -14 : 0;

	// Hair bounce: subtle wiggle from speaking + expression
	const hairSway = isSpeaking ? Math.sin(speakingFrame * 0.15) * 2 : 0;
	const hairSway2 = isSpeaking ? Math.sin(speakingFrame * 0.12 + 1.5) * 1.5 : 0;

	// Blush pulse: brighter when happy
	const blushOpacity = expression === 'happy' ? 0.35 + Math.sin(speakingFrame * 0.2) * 0.12 : 0;

	// Sweat drops: falling when shocked, loop every 40 frames
	const sweatDropY1 = expression === 'shocked' ? 60 + (speakingFrame % 40) * 0.4 : 60;
	const sweatDropY2 = expression === 'shocked' ? 52 + ((speakingFrame + 20) % 40) * 0.35 : 52;

	// ── Mouth path — extra wide for Shinchan's iconic big mouth ───────────
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseOpen = 130 + mouthOpenAmount;
			if (expression === 'happy') return `M55 126 Q95 ${baseOpen + 20} 135 126`;
			if (expression === 'angry') return `M60 122 Q95 ${baseOpen - 8} 130 122`;
			if (expression === 'shocked') return `M65 114 Q95 ${baseOpen + 10} 125 114`;
			return `M55 124 Q95 ${baseOpen + 16} 135 124`;
		}
		switch (expression) {
			case 'happy': return 'M55 126 Q95 168 135 126';
			case 'angry': return 'M60 122 Q95 108 130 122';
			case 'shocked': return 'M65 114 Q95 152 125 114';
			default: return 'M55 124 Q95 158 135 124';
		}
	};

	const mouthFill =
		isSpeaking && mouthOpen > 0.3
			? '#1A1A1A'
			: expression === 'shocked'
				? '#333'
				: 'none';

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
					<feDropShadow dx='0' dy='3' stdDeviation='3' floodColor='#000' floodOpacity='0.15' />
				</filter>
			</defs>

			<g
				filter='url(#shinchan-shadow)'
				transform={`translate(${bodyWobble}, ${bodyBounce})`}
			>
				{/* === LEGS (with bounce) === */}
				<g transform={`translate(0, ${legBounce})`}>
					<rect x='68' y='248' width='18' height='22' rx='4' fill='#FFCC80' stroke='#DBA56E' strokeWidth='1.5' />
					<rect x='114' y='248' width='18' height='22' rx='4' fill='#FFCC80' stroke='#DBA56E' strokeWidth='1.5' />
					<rect x='67' y='266' width='20' height='8' rx='3' fill='white' stroke='#E0E0E0' strokeWidth='1' />
					<rect x='113' y='266' width='20' height='8' rx='3' fill='white' stroke='#E0E0E0' strokeWidth='1' />
					<ellipse cx='77' cy='278' rx='15' ry='7' fill='#5D4037' stroke='#3E2723' strokeWidth='1.5' />
					<ellipse cx='123' cy='278' rx='15' ry='7' fill='#5D4037' stroke='#3E2723' strokeWidth='1.5' />
					<ellipse cx='74' cy='275' rx='6' ry='2' fill='#795548' opacity='0.5' />
					<ellipse cx='120' cy='275' rx='6' ry='2' fill='#795548' opacity='0.5' />
				</g>

				<rect x='58' y='212' width='84' height='38' rx='6' fill='url(#shinchan-shorts)' stroke='#F9A825' strokeWidth='2' />
				<rect x='58' y='210' width='84' height='6' rx='3' fill='#F9A825' />

				<rect x='56' y='135' width='88' height='82' rx='10' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth='2' />
				<path d='M82 135 L100 155 L118 135' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth='1.5' />
				<path d='M82 135 L95 150' fill='none' stroke='#C62828' strokeWidth='1' opacity='0.5' />
				<path d='M118 135 L105 150' fill='none' stroke='#C62828' strokeWidth='1' opacity='0.5' />

				{/* === ARMS === */}
				<g transform={`rotate(${leftArmAngle}, 56, 155)`}>
					<rect x='38' y='152' width='40' height='14' rx='7' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
					<circle cx='25' cy='155' r='10' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
				</g>
				<g transform={`rotate(${rightArmAngle}, 144, 155)`}>
					<rect x='122' y='152' width='40' height='14' rx='7' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
					<circle cx='175' cy='155' r='10' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
				</g>

				{/* === HEAD === */}
				<ellipse cx='100' cy='78' rx='50' ry='56' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='2.5' />

				{/* Hair with bounce */}
				<g transform={`translate(${hairSway}, ${Math.abs(hairSway) * 0.3})`}>
					<path d='M52 52 Q56 22 76 20 Q85 14 100 16 Q115 14 124 20 Q144 22 148 52' fill='url(#shinchan-hair)' />
					<path d='M52 52 Q48 58 50 64' fill='none' stroke='#1A1A1A' strokeWidth='4' strokeLinecap='round' />
					<path d='M148 52 Q152 58 150 64' fill='none' stroke='#1A1A1A' strokeWidth='4' strokeLinecap='round' />
					<path d='M75 28 Q85 22 100 24 Q115 22 125 28' fill='none' stroke='#444' strokeWidth='2' opacity='0.4' />
				</g>
				{/* Extra hair tufts that sway more */}
				<g transform={`translate(${hairSway2}, ${Math.abs(hairSway2) * 0.2})`}>
					<path d='M58 36 Q54 28 60 26' fill='none' stroke='#1A1A1A' strokeWidth='2.5' strokeLinecap='round' />
					<path d='M140 34 Q146 26 140 24' fill='none' stroke='#1A1A1A' strokeWidth='2.5' strokeLinecap='round' />
				</g>

				<ellipse cx='50' cy='76' rx='8' ry='12' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
				<ellipse cx='150' cy='76' rx='8' ry='12' fill='url(#shinchan-skin)' stroke='#DBA56E' strokeWidth='1.5' />
				<ellipse cx='50' cy='76' rx='4' ry='6' fill='#F4A460' opacity='0.5' />
				<ellipse cx='150' cy='76' rx='4' ry='6' fill='#F4A460' opacity='0.5' />

				{/* Animated eyebrows */}
				<g transform={`rotate(${browTilt}, 76, 65)`}>
					<rect x='60' y='58' width='32' height='10' rx='5' fill='#1A1A1A' />
				</g>
				<g transform={`rotate(${browTiltRight}, 124, 65)`}>
					<rect x='108' y='58' width='32' height='10' rx='5' fill='#1A1A1A' />
				</g>

				<ellipse cx='76' cy={`${80 + eyeOffsetY}`} rx={13} ry={blinkH} fill='white' stroke='#444' strokeWidth='1.5' />
				<ellipse cx='124' cy={`${80 + eyeOffsetY}`} rx={13} ry={blinkH} fill='white' stroke='#444' strokeWidth='1.5' />

				{!isBlinking && (
					<>
						<circle cx='78' cy={`${82 + eyeOffsetY}`} r='5' fill='#1A1A1A' />
						<circle cx='126' cy={`${82 + eyeOffsetY}`} r='5' fill='#1A1A1A' />
						<circle cx='80' cy={`${78 + eyeOffsetY}`} r='2.5' fill='white' />
						<circle cx='128' cy={`${78 + eyeOffsetY}`} r='2.5' fill='white' />
						<circle cx='75' cy={`${84 + eyeOffsetY}`} r='1' fill='white' opacity='0.6' />
						<circle cx='123' cy={`${84 + eyeOffsetY}`} r='1' fill='white' opacity='0.6' />
					</>
				)}

				<circle cx='100' cy='95' r='3.5' fill='#E8945E' stroke='#DBA56E' strokeWidth='1' />

				<path d={getMouthPath()} fill={mouthFill} stroke='#333' strokeWidth='2.5' strokeLinecap='round' />

				{showInterior && (
					<ellipse cx='95' cy={134 + mouthOpenAmount * 0.5} rx='12' ry='5' fill='#FF7979' opacity='0.7' />
				)}

				{/* Animated blush when happy */}
				{expression === 'happy' && (
					<>
						<ellipse cx='55' cy='98' rx='12' ry='7' fill='#FF8A80' opacity={blushOpacity} />
						<ellipse cx='145' cy='98' rx='12' ry='7' fill='#FF8A80' opacity={blushOpacity} />
					</>
				)}

				{expression === 'angry' && (
					<>
						<path d='M58 50 L54 42 L62 46' fill='none' stroke='#C62828' strokeWidth='2' strokeLinecap='round' />
						<rect x='58' y='56' width='34' height='10' rx='5' fill='#1A1A1A' transform='rotate(-8, 75, 60)' />
						<rect x='108' y='56' width='34' height='10' rx='5' fill='#1A1A1A' transform='rotate(8, 125, 60)' />
					</>
				)}

				{expression === 'shocked' && (
					<>
						<path d='M145 55 Q148 62 145 68 Q142 62 145 55' fill='#64B5F6' />
						<path d='M55 55 Q58 62 55 68 Q52 62 55 55' fill='#64B5F6' />
						{/* Sweat drops */}
						<ellipse cx='52' cy={sweatDropY1} rx='3' ry='4.5' fill='#64B5F6' opacity='0.7' />
						<ellipse cx='148' cy={sweatDropY2} rx='2.5' ry='3.5' fill='#64B5F6' opacity='0.5' />
					</>
				)}
			</g>
		</svg>
	);
};
