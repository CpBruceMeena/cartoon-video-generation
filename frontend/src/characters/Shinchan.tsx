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
import { useExpressionMorph } from './useExpressionMorph';

const cfg = CHARACTER_ANIMATION_CONFIGS.shinchan!;

// ── Expression-based body silhouette transforms ───────────────────────────
// These change the character's full-body posture per expression, not just the face.
interface BodySilhouette {
	lean: number;        // forward/backward lean (degrees)
	squash: number;      // vertical squash (1 = normal)
	hipShift: number;    // horizontal hip shift
}

const BODY_SILHOUETTES: Record<string, BodySilhouette> = {
	normal:   { lean: 0, squash: 1, hipShift: 0 },
	happy:    { lean: -3, squash: 0.96, hipShift: 2 },
	laughing: { lean: -5, squash: 0.94, hipShift: 3 },
	angry:    { lean: 6, squash: 0.97, hipShift: 0 },
	shocked:  { lean: -8, squash: 0.92, hipShift: 0 },
	thinking: { lean: 3, squash: 0.98, hipShift: -2 },
	sad:      { lean: -4, squash: 0.95, hipShift: 0 },
	listening:{ lean: 2, squash: 0.99, hipShift: 0 },
};

// ── Expression eyebrow/eye config ──────────────────────────────────────────
const EXPR_CONFIG: Record<string, { browAngle: number; browAngleR: number; browY: number; eyeSquint: number }> = {
	normal:   { browAngle: 0, browAngleR: 0, browY: 0, eyeSquint: 1 },
	happy:    { browAngle: -8, browAngleR: -8, browY: -2, eyeSquint: 0.65 },
	laughing: { browAngle: -12, browAngleR: -10, browY: -3, eyeSquint: 0.5 },
	angry:    { browAngle: 16, browAngleR: 14, browY: -3, eyeSquint: 0.75 },
	shocked:  { browAngle: -18, browAngleR: -18, browY: -5, eyeSquint: 1.35 },
	thinking: { browAngle: 8, browAngleR: -4, browY: -2, eyeSquint: 0.85 },
	sad:      { browAngle: 6, browAngleR: 4, browY: 1, eyeSquint: 0.85 },
	listening:{ browAngle: 0, browAngleR: 0, browY: 0, eyeSquint: 1 },
};	export const ShinchanSVG: React.FC<CharacterSVGProps> = ({
	expression = 'normal',
	isSpeaking = false,
	speakingFrame = 0,
	amplitude = 0,
	gesture,
}) => {
	// ── Shared hooks ──────────────────────────────────────────────────────
	const { mouthOpen, mouthOpenAmount, showInterior } = useMouthOpen(
		isSpeaking,
		speakingFrame,
		{ ...cfg.mouth, externalAmplitude: amplitude },
	);

	const { isBlinking, blinkH } = useEyeBlink(speakingFrame, expression, cfg.eyeBlink);

	const { leftArmAngle, rightArmAngle } = useArmAnimation(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.arm,
		gesture,
	);

	const { bodyBounce, bodyWobble } = useBodyMovement(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.bodyMovement,
	);

	const legBounce = useLegBounce(isSpeaking, speakingFrame, cfg.legBounce);

	// ── EXPRESSION MORPHING ──────────────────────────────────────────────
	// Smooth spring-based interpolation between expression states.
	// Eyebrows, eyes, and body silhouette blend smoothly when expression changes.
	const exprMorph = useExpressionMorph(expression, speakingFrame, EXPR_CONFIG);
	const bodyMorph = useExpressionMorph(expression, speakingFrame, BODY_SILHOUETTES);

	// Extract morphed values
	const browAngle = exprMorph.browAngle;
	const browAngleR = exprMorph.browAngleR;
	const browY = exprMorph.browY;
	const eyeSquint = exprMorph.eyeSquint;
	const silhouette = bodyMorph;
	const armLeanAdjustment = silhouette.lean * 0.4;

	// ── Hair animation ────────────────────────────────────────────────────
	const hairSway = isSpeaking ? Math.sin(speakingFrame * 0.15) * 2 : 0;
	const hairSway2 = isSpeaking ? Math.sin(speakingFrame * 0.12 + 1.5) * 1.5 : 0;

	// ── Expression-specific brush opacity (morphs smoothly for blush fade) ──
	const blushOpacity = useExpressionMorph(expression, speakingFrame, {
		normal: { v: 0 },
		happy: { v: 0.4 },
		laughing: { v: 0.5 },
		angry: { v: 0 },
		shocked: { v: 0 },
		thinking: { v: 0 },
		sad: { v: 0 },
		listening: { v: 0 },
	}).v;

	// Add sin oscillation on top for liveliness
	const blushPulse = blushOpacity * (isSpeaking
		? 1 + Math.sin(speakingFrame * 0.2) * 0.25
		: 1);

	// Sweat drops and effects still snap instantly (they're binary on/off effects)
	const sweatDropY1 = expression === 'shocked' ? 60 + (speakingFrame % 40) * 0.4 : 60;
	const sweatDropY2 = expression === 'shocked' ? 52 + ((speakingFrame + 20) % 40) * 0.35 : 52;

	// ── Mouth path ────────────────────────────────────────────────────────
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseOpen = 130 + mouthOpenAmount;
			if (expression === 'happy' || expression === 'laughing') return `M55 126 Q95 ${baseOpen + 26} 135 126`;
			if (expression === 'angry') return `M60 118 Q95 ${baseOpen - 8} 130 118`;
			if (expression === 'shocked') return `M60 110 Q95 ${baseOpen + 16} 130 110`;
			if (expression === 'thinking') return `M58 120 Q95 ${baseOpen + 12} 132 120`;
			if (expression === 'sad') return `M58 122 Q95 ${baseOpen - 4} 132 122`;
			return `M55 124 Q95 ${baseOpen + 18} 135 124`;
		}
		switch (expression) {
			case 'happy': return 'M55 126 Q95 172 135 126';
			case 'laughing': return 'M50 128 Q95 180 140 128';
			case 'angry': return 'M60 118 Q95 102 130 118';
			case 'shocked': return 'M60 110 Q95 158 130 110';
			case 'thinking': return 'M58 120 Q95 116 132 120';
			case 'sad': return 'M58 122 Q95 140 132 122';
			default: return 'M55 124 Q95 162 135 124';
		}
	};

	const mouthFill =
		isSpeaking && mouthOpen > 0.3
			? '#1A1A1A'
			: expression === 'shocked'
				? '#333'
				: 'none';

	const STROKE = '#1A1A1A';
	const SW = 3;

	// ── Eye height offsets ────────────────────────────────────────────────
	// Eye height offset now also morphs smoothly
	const eyeOffsetY = useExpressionMorph(expression, speakingFrame, {
		normal: { v: 0 },
		happy: { v: -3 },
		laughing: { v: -3 },
		angry: { v: 3 },
		shocked: { v: -2 },
		thinking: { v: 0 },
		sad: { v: 1 },
		listening: { v: 0 },
	}).v;

	// ── Body posture transform ────────────────────────────────────────────
	// Apply lean, squash from silhouette
	// SVG transform: translate, rotate, then scale(1/squash, squash) = volume-preserving squash/stretch
	const bodyPostureTransform = `
		translate(${silhouette.hipShift}, 0)
		rotate(${silhouette.lean}, 100, 200)
		scale(${1 / silhouette.squash}, ${silhouette.squash})
	`;

	return (
		<svg width='280' height='360' viewBox='0 0 200 280'>
			<defs>
				<radialGradient id='shinchan-skin' cx='50%' cy='40%' r='60%'>
					<stop offset='0%' stopColor='#FFE082' />
					<stop offset='60%' stopColor='#FFCC80' />
					<stop offset='100%' stopColor='#F4A460' />
				</radialGradient>
				<linearGradient id='shinchan-shirt' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#EF5350' />
					<stop offset='50%' stopColor='#E53935' />
					<stop offset='100%' stopColor='#B71C1C' />
				</linearGradient>
				<linearGradient id='shinchan-shorts' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#FFEE58' />
					<stop offset='100%' stopColor='#F9A825' />
				</linearGradient>
				<linearGradient id='shinchan-hair' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#2C2C2C' />
					<stop offset='100%' stopColor='#1A1A1A' />
				</linearGradient>
				<filter id='shinchan-shadow'>
					<feDropShadow dx='0' dy='4' stdDeviation='4' floodColor='#000' floodOpacity='0.2' />
				</filter>
			</defs>

			{/* Floor shadow */}
			<ellipse cx='100' cy='270' rx='50' ry='10' fill='rgba(0,0,0,0.15)' />

			<g
				filter='url(#shinchan-shadow)'
				transform={`translate(${bodyWobble}, ${bodyBounce})`}
			>
				{/* ── BODY GROUP with expression silhouette ────────────── */}
				<g transform={bodyPostureTransform}>
					{/* === LEGS (with bounce) === */}
					<g transform={`translate(0, ${legBounce})`}>
						<rect x='68' y='248' width='18' height='22' rx='6' fill='#FFCC80' stroke={STROKE} strokeWidth={SW} />
						<rect x='114' y='248' width='18' height='22' rx='6' fill='#FFCC80' stroke={STROKE} strokeWidth={SW} />
						{/* Socks */}
						<rect x='67' y='266' width='20' height='8' rx='3' fill='white' stroke='#CCC' strokeWidth='1.5' />
						<rect x='113' y='266' width='20' height='8' rx='3' fill='white' stroke='#CCC' strokeWidth='1.5' />
						{/* Shoes — rounder */}
						<ellipse cx='77' cy='278' rx='17' ry='9' fill='#5D4037' stroke='#3E2723' strokeWidth='2' />
						<ellipse cx='123' cy='278' rx='17' ry='9' fill='#5D4037' stroke='#3E2723' strokeWidth='2' />
					</g>

					{/* === SHORTS — rounder, more anime-authentic === */}
					<rect x='56' y='210' width='88' height='42' rx='8' fill='url(#shinchan-shorts)' stroke='#F9A825' strokeWidth={SW} />
					<rect x='56' y='208' width='88' height='8' rx='4' fill='#F9A825' />

					{/* === BODY / SHIRT — rounder shape === */}
					<rect x='52' y='135' width='96' height='80' rx='16' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth={SW} />

					{/* Shirt collar — more detailed */}
					<path d='M78 135 L100 158 L122 135' fill='url(#shinchan-shirt)' stroke='#B71C1C' strokeWidth='2.5' />
					<path d='M78 135 L96 152' fill='none' stroke='#C62828' strokeWidth='1.5' opacity='0.5' />
					<path d='M122 135 L104 152' fill='none' stroke='#C62828' strokeWidth='1.5' opacity='0.5' />
					{/* V-neck line */}
					<line x1='100' y1='158' x2='100' y2='135' stroke='#B71C1C' strokeWidth='2' opacity='0.3' />

					{/* === ARMS — tapered with rounded hands === */}
					<g transform={`rotate(${leftArmAngle + armLeanAdjustment}, 52, 155)`}>
						{/* Arm */}
						<path d='M36 152 Q34 162 46 168 L52 155 Z' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
						{/* Hand */}
						<circle cx='26' cy='158' r='12' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
					</g>
					<g transform={`rotate(${rightArmAngle - armLeanAdjustment}, 148, 155)`}>
						<path d='M164 152 Q166 162 154 168 L148 155 Z' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
						<circle cx='174' cy='158' r='12' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
					</g>

					{/* === HEAD — larger oval for anime look === */}
					<ellipse cx='100' cy='75' rx='58' ry='54' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />

					{/* === HAIR — spikier with 5 distinctive tufts === */}
					<g transform={`translate(${hairSway}, ${Math.abs(hairSway) * 0.3})`}>
						{/* Main hair block */}
						<path d='M44 52 Q46 22 62 16 Q74 10 88 14 Q100 8 112 14 Q126 10 138 16 Q154 22 156 52' fill='url(#shinchan-hair)' stroke={STROKE} strokeWidth='2.5' />
						{/* 5 hair spikes/tufts */}
						<path d='M56 28 Q52 12 60 8' fill='none' stroke='#1A1A1A' strokeWidth='5' strokeLinecap='round' />
						<path d='M74 18 Q72 4 82 2' fill='none' stroke='#1A1A1A' strokeWidth='5' strokeLinecap='round' />
						<path d='M100 14 Q100 0 108 2' fill='none' stroke='#1A1A1A' strokeWidth='5' strokeLinecap='round' />
						<path d='M126 18 Q128 4 118 2' fill='none' stroke='#1A1A1A' strokeWidth='5' strokeLinecap='round' />
						<path d='M144 28 Q148 12 140 8' fill='none' stroke='#1A1A1A' strokeWidth='5' strokeLinecap='round' />
						{/* Hair highlight */}
						<path d='M68 24 Q80 16 100 18 Q120 16 132 24' fill='none' stroke='#555' strokeWidth='2.5' opacity='0.25' />
					</g>
					{/* Side tufts */}
					<g transform={`translate(${hairSway2}, ${Math.abs(hairSway2) * 0.2})`}>
						<path d='M44 52 Q38 58 40 66' fill='none' stroke={STROKE} strokeWidth='5' strokeLinecap='round' />
						<path d='M156 52 Q162 58 160 66' fill='none' stroke={STROKE} strokeWidth='5' strokeLinecap='round' />
					</g>

					{/* === EARS — round, mid-head position === */}
					<ellipse cx='42' cy='75' rx='10' ry='15' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
					<ellipse cx='158' cy='75' rx='10' ry='15' fill='url(#shinchan-skin)' stroke={STROKE} strokeWidth={SW} />
					<ellipse cx='42' cy='75' rx='5' ry='8' fill='#F4A460' opacity='0.5' />
					<ellipse cx='158' cy='75' rx='5' ry='8' fill='#F4A460' opacity='0.5' />

					{/* === EYEBROWS — Shinchan's iconic thick brows (most expressive feature) === */}
					<g transform={`rotate(${browAngle}, 76, ${58 + browY}) translate(0, ${browY})`}>
						<rect x='54' y='54' width='44' height='14' rx='7' fill={STROKE} />
					</g>
					<g transform={`rotate(${browAngleR}, 124, ${58 + browY}) translate(0, ${browY})`}>
						<rect x='102' y='54' width='44' height='14' rx='7' fill={STROKE} />
					</g>

					{/* === EYES — big round anime eyes (>40% of face width) === */}
					<ellipse cx='74' cy={`${80 + eyeOffsetY}`} rx='17' ry={blinkH * eyeSquint} fill='white' stroke='#444' strokeWidth='2.5' />
					<ellipse cx='126' cy={`${80 + eyeOffsetY}`} rx='17' ry={blinkH * eyeSquint} fill='white' stroke='#444' strokeWidth='2.5' />

					{!isBlinking && (
						<>
							{/* Pupils */}
							<circle cx='77' cy={`${82 + eyeOffsetY}`} r='7' fill={STROKE} />
							<circle cx='129' cy={`${82 + eyeOffsetY}`} r='7' fill={STROKE} />
							{/* Primary eye shine */}
							<circle cx='79' cy={`${78 + eyeOffsetY}`} r='3.5' fill='white' />
							<circle cx='131' cy={`${78 + eyeOffsetY}`} r='3.5' fill='white' />
							{/* Secondary eye shine */}
							<circle cx='73' cy={`${85 + eyeOffsetY}`} r='2' fill='white' opacity='0.6' />
							<circle cx='125' cy={`${85 + eyeOffsetY}`} r='2' fill='white' opacity='0.6' />
							{/* Under-eye highlight */}
							<ellipse cx='74' cy={`${88 + eyeOffsetY}`} rx='8' ry='2' fill='rgba(0,0,0,0.04)' />
							<ellipse cx='126' cy={`${88 + eyeOffsetY}`} rx='8' ry='2' fill='rgba(0,0,0,0.04)' />
						</>
					)}

					{/* === NOSE — tiny dot === */}
					<circle cx='100' cy='96' r='4' fill='#E8945E' stroke={STROKE} strokeWidth='1.5' />

					{/* === MOUTH — wide expressive curve === */}
					<path d={getMouthPath()} fill={mouthFill} stroke={STROKE} strokeWidth='3' strokeLinecap='round' />
					{showInterior && (
						<ellipse cx='95' cy={134 + mouthOpenAmount * 0.5} rx='16' ry='7' fill='#FF7979' opacity='0.7' />
					)}

					{/* === CHEEK BLUSH (when happy/laughing) === */}
				{/* Blush with smooth morphing opacity — visible during and just after happy/laughing */}
					<ellipse cx='50' cy='100' rx='15' ry='9' fill='#FF8A80' opacity={blushPulse} />
					<ellipse cx='150' cy='100' rx='15' ry='9' fill='#FF8A80' opacity={blushPulse} />

					{/* === ANGRY EFFECTS — forehead veins + furrowed intensity === */}
					{expression === 'angry' && (
						<>
							<path d='M88 44 L92 36 L96 44' fill='none' stroke='#C62828' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
							<path d='M96 42 L100 34 L104 42' fill='none' stroke='#C62828' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
							{/* Shadow under brows for angry depth */}
							<ellipse cx='76' cy='70' rx='18' ry='4' fill='rgba(0,0,0,0.12)' />
							<ellipse cx='124' cy='70' rx='18' ry='4' fill='rgba(0,0,0,0.12)' />
						</>
					)}

					{/* === SHOCKED EFFECTS — sweat drops + exclamation marks === */}
					{expression === 'shocked' && (
						<>
							<path d='M152 48 Q156 58 152 68 Q148 58 152 48' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
							<path d='M48 48 Q52 58 48 68 Q44 58 48 48' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
							{/* Sweat drops */}
							<ellipse cx='46' cy={sweatDropY1} rx='4' ry='6' fill='#64B5F6' opacity='0.8' />
							<ellipse cx='154' cy={sweatDropY2} rx='3.5' ry='5' fill='#64B5F6' opacity='0.6' />
						</>
					)}

					{/* === THINKING EFFECTS — question mark / thought bubble hint === */}
					{expression === 'thinking' && (
						<>
							<text x='152' y='42' fontFamily='Arial' fontSize='16' fontWeight='bold' fill='#5C6BC0' opacity='0.7'>?</text>
						</>
					)}

					{/* === SAD EFFECTS — tiny tear drop === */}
					{expression === 'sad' && (
						<>
							<ellipse cx='50' cy='96' rx='3' ry='5' fill='#64B5F6' opacity='0.6' />
						</>
					)}
				</g>
			</g>
		</svg>
	);
};
