import React from 'react';
import {
	useMouthOpen,
	useArmAnimation,
	useBodyMovement,
	type CharacterSVGProps,
} from './useCharacterAnimation';
import { CHARACTER_ANIMATION_CONFIGS } from './animationConfig';
import { useExpressionMorph, useExpressionMorphValue } from './useExpressionMorph';

const cfg = CHARACTER_ANIMATION_CONFIGS.doraemon!;

// ── Expression eyebrow/eye config ──────────────────────────────────────────
const EXPR_CONFIG: Record<string, {
	browAngle: number;
	browAngleR: number;
	eyeWiden: number;
}> = {
	normal:   { browAngle: 0, browAngleR: 0, eyeWiden: 1 },
	happy:    { browAngle: -6, browAngleR: -6, eyeWiden: 0.8 },
	laughing: { browAngle: -10, browAngleR: -8, eyeWiden: 0.7 },
	angry:    { browAngle: 12, browAngleR: 10, eyeWiden: 0.85 },
	shocked:  { browAngle: -14, browAngleR: -14, eyeWiden: 1.45 },
	thinking: { browAngle: 6, browAngleR: -3, eyeWiden: 0.9 },
	sad:      { browAngle: 4, browAngleR: 3, eyeWiden: 0.85 },
	listening:{ browAngle: 0, browAngleR: 0, eyeWiden: 1 },
};

// ── Expression body posture ────────────────────────────────────────────────
const BODY_LEAN: Record<string, number> = {
	normal: 0, happy: -2, laughing: -4, angry: 4,
	shocked: -6, thinking: 2, sad: -3, listening: 1,
};	export const DoraemonSVG: React.FC<CharacterSVGProps> = ({
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

	// ── EXPRESSION MORPHING ──────────────────────────────────────────────
	// Smooth spring-based interpolation between expression states
	const exprMorph = useExpressionMorph(expression, speakingFrame, EXPR_CONFIG);
	const bodyLean = useExpressionMorphValue(expression, speakingFrame, BODY_LEAN);

	// Head tilt also morphs smoothly
	const headTilt = useExpressionMorphValue(expression, speakingFrame, {
		normal: 0, happy: 4, laughing: 4, angry: -3,
		shocked: 0, thinking: 1, sad: -1, listening: 0,
	});

	// Doraemon uses scale-based eye animation with morphed eyeWiden
	const morphEyeWiden = exprMorph.eyeWiden;
	const blinkCycle = speakingFrame % cfg.eyeBlink.cycleLength;
	const isBlinking = blinkCycle > cfg.eyeBlink.cycleLength - 7 && blinkCycle < cfg.eyeBlink.cycleLength - 1;

	// Eye widen/squish from expression config (applied on top of blink)
	const eyeScaleWiden = isBlinking ? 0.08 : morphEyeWiden;
	const showPupils = !isBlinking;

	// Ear wiggle
	const earWiggle = isSpeaking ? Math.sin(speakingFrame * 0.2) * 3 : Math.sin(speakingFrame * 0.04) * 1;

	// Pocket glow
	const pocketGlow = isSpeaking ? 0.5 + Math.sin(speakingFrame * 0.15) * 0.2 : 0.3;

	// Bell swing
	const bellSwing = isSpeaking ? Math.sin(speakingFrame * 0.12) * 4 : Math.sin(speakingFrame * 0.03) * 2;

	const { leftArmAngle, rightArmAngle } = useArmAnimation(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.arm,
		gesture,
	);

	const { bodyBounce } = useBodyMovement(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.bodyMovement,
	);

	// ── Mouth path — wide semicircle below white face ─────────────────────
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 142 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M54 130 Q100 ${baseY + 28} 146 130`;
				case 'angry': return `M56 116 Q100 ${baseY - 10} 144 116`;
				case 'shocked': return `M68 110 Q100 ${baseY + 12} 132 110`;
				case 'thinking': return `M60 120 Q100 ${baseY + 14} 140 120`;
				default: return `M56 124 Q100 ${baseY + 20} 144 124`;
			}
		}
		switch (expression) {
			case 'happy': return 'M54 130 Q100 188 146 130';
			case 'laughing': return 'M50 134 Q100 196 150 134';
			case 'angry': return 'M56 116 Q100 98 144 116';
			case 'shocked': return 'M68 110 Q100 164 132 110';
			case 'thinking': return 'M60 120 Q100 114 140 120';
			case 'sad': return 'M58 126 Q100 142 142 126';
			default: return 'M56 124 Q100 176 144 124';
		}
	};

	const showMouthInterior = isSpeaking && mouthOpen > 0.3;
	const mouthFill = showMouthInterior ? '#1A1A1A' : expression === 'shocked' ? '#333' : 'none';

	const STROKE_DARK = '#0D47A1';
	const STROKE_NOSE = '#B71C1C';

	return (
		<svg width='280' height='320' viewBox='0 0 200 240'>
			<defs>
				{/* Body gradient — lighter top for 3D effect */}
				<radialGradient id='doraemon-body' cx='50%' cy='30%' r='75%'>
					<stop offset='0%' stopColor='#4FC3F7' />
					<stop offset='40%' stopColor='#29B6F6' />
					<stop offset='80%' stopColor='#039BE5' />
					<stop offset='100%' stopColor='#0277BD' />
				</radialGradient>
				{/* Head gradient */}
				<radialGradient id='doraemon-head' cx='50%' cy='25%' r='80%'>
					<stop offset='0%' stopColor='#4FC3F7' />
					<stop offset='50%' stopColor='#1E88E5' />
					<stop offset='100%' stopColor='#1565C0' />
				</radialGradient>
				{/* Face gradient */}
				<radialGradient id='doraemon-face' cx='50%' cy='40%' r='65%'>
					<stop offset='0%' stopColor='#FFFFFF' />
					<stop offset='75%' stopColor='#FAFAFA' />
					<stop offset='100%' stopColor='#F0F0F0' />
				</radialGradient>
				{/* Belly gradient */}
				<radialGradient id='doraemon-belly' cx='50%' cy='40%' r='65%'>
					<stop offset='0%' stopColor='#FFFFFF' />
					<stop offset='80%' stopColor='#F5F5F5' />
					<stop offset='100%' stopColor='#EEEEEE' />
				</radialGradient>
				{/* Bell gradient */}
				<radialGradient id='doraemon-bell' cx='40%' cy='30%' r='65%'>
					<stop offset='0%' stopColor='#FFF176' />
					<stop offset='50%' stopColor='#FFEE58' />
					<stop offset='100%' stopColor='#F9A825' />
				</radialGradient>
				{/* Collar gradient */}
				<linearGradient id='doraemon-collar' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#E53935' />
					<stop offset='100%' stopColor='#B71C1C' />
				</linearGradient>
				{/* Shadow filter */}
				<filter id='doraemon-shadow'>
					<feDropShadow dx='0' dy='5' stdDeviation='4' floodColor='#000' floodOpacity='0.18' />
				</filter>
			</defs>

			{/* Floor shadow */}
			<ellipse cx='100' cy='230' rx='55' ry='10' fill='rgba(0,0,0,0.12)' />

			<g filter='url(#doraemon-shadow)' transform={`translate(0, ${bodyBounce}) rotate(${bodyLean}, 100, 150)`}>
				{/* === BODY — rounder, wider === */}
				<ellipse cx='100' cy='135' rx='80' ry='72' fill='url(#doraemon-body)' stroke={STROKE_DARK} strokeWidth='3.5' />

				{/* === WHITE BELLY — larger === */}
				<ellipse cx='100' cy='155' rx='54' ry='46' fill='url(#doraemon-belly)' stroke='#E0E0E0' strokeWidth='2' />

				{/* === GADGET POUCH (4D Pocket) — crescent shape === */}
				<ellipse cx='100' cy='168' rx='38' ry='16' fill='#E3F2FD' stroke='#90CAF9' strokeWidth='2' />
				{/* Pocket opening — curved line */}
				<path d='M65 167 Q100 186 135 167' fill='#E3F2FD' stroke='#90CAF9' strokeWidth='1.5' />
				<path d='M68 165 Q100 182 132 165' fill='none' stroke='#BBDEFB' strokeWidth='1' />
				{/* Pocket glow effect */}
				<ellipse cx='100' cy='168' rx='36' ry='14' fill='none' stroke='#64B5F6' strokeWidth='2' opacity={pocketGlow} />

				{/* === COLLAR — wider, more detailed === */}
				<rect x='44' y='96' width='112' height='18' rx='9' fill='url(#doraemon-collar)' stroke={STROKE_NOSE} strokeWidth={3} />
				{/* Collar highlight */}
				<rect x='46' y='97' width='108' height='6' rx='3' fill='#EF5350' opacity='0.5' />

				{/* === BELL — more detailed with gold gradient === */}
				<g transform={`rotate(${bellSwing}, 100, 115)`}>
					<circle cx='100' cy='116' r='14' fill='url(#doraemon-bell)' stroke='#F57F17' strokeWidth='2.5' />
					<circle cx='100' cy='122' r='6' fill='#F9A825' stroke='#F57F17' strokeWidth='1.5' />
					{/* Bell horizontal line */}
					<line x1='90' y1='116' x2='110' y2='116' stroke='#F57F17' strokeWidth='3' strokeLinecap='round' />
					{/* Bell highlight */}
					<ellipse cx='95' cy='111' rx='3' ry='2' fill='white' opacity='0.6' />
					{/* Bell rattle opening */}
					<rect x='98' y='124' width='4' height='3' rx='1' fill='#F57F17' />
				</g>

				{/* === ARMS (animated) — rounder paws === */}
				<g transform={`rotate(${leftArmAngle}, 20, 130)`}>
					<ellipse cx='12' cy='128' rx='20' ry='40' fill='url(#doraemon-body)' stroke={STROKE_DARK} strokeWidth='3' />
					<circle cx='12' cy='165' r='15' fill='white' stroke='#E0E0E0' strokeWidth='2' />
					{/* Paw pads — three dots */}
					<circle cx='10' cy='160' r='3.5' fill='#FFCCBC' opacity='0.5' />
					<circle cx='16' cy='167' r='3.5' fill='#FFCCBC' opacity='0.5' />
					<circle cx='10' cy='172' r='3' fill='#FFCCBC' opacity='0.5' />
				</g>

				<g transform={`rotate(${rightArmAngle}, 180, 130)`}>
					<ellipse cx='188' cy='128' rx='20' ry='40' fill='url(#doraemon-body)' stroke={STROKE_DARK} strokeWidth='3' />
					<circle cx='188' cy='165' r='15' fill='white' stroke='#E0E0E0' strokeWidth='2' />
					<circle cx='186' cy='160' r='3.5' fill='#FFCCBC' opacity='0.5' />
					<circle cx='192' cy='167' r='3.5' fill='#FFCCBC' opacity='0.5' />
					<circle cx='186' cy='172' r='3' fill='#FFCCBC' opacity='0.5' />
				</g>

				{/* === FEET — rounder, wider === */}
				<ellipse cx='68' cy='210' rx='28' ry='16' fill='white' stroke='#E0E0E0' strokeWidth='2.5' />
				<ellipse cx='132' cy='210' rx='28' ry='16' fill='white' stroke='#E0E0E0' strokeWidth='2.5' />
				{/* Toe bumps */}
				<circle cx='54' cy='210' r='5' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='82' cy='210' r='5' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='118' cy='210' r='5' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='146' cy='210' r='5' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />

				{/* === HEAD (with tilt) — PERFECT CIRCLE === */}
				<g transform={`rotate(${headTilt}, 100, 68)`}>
					{/* Head — perfect circle */}
					<circle cx='100' cy='68' r='64' fill='url(#doraemon-head)' stroke={STROKE_DARK} strokeWidth='3.5' />

					{/* White face oval — large, covering most of lower face */}
					<ellipse cx='100' cy='72' rx='52' ry='50' fill='url(#doraemon-face)' stroke='#E0E0E0' strokeWidth='2' />

					{/* Ear bumps (Doraemon has very subtle ear bumps) */}
					<g transform={`rotate(${-earWiggle}, 42, 20)`}>
						<circle cx='42' cy='20' r='16' fill='url(#doraemon-head)' stroke={STROKE_DARK} strokeWidth='2.5' />
						<circle cx='42' cy='20' r='10' fill='#90CAF9' />
						<circle cx='41' cy='18' r='4' fill='#64B5F6' opacity='0.4' />
					</g>
					<g transform={`rotate(${earWiggle}, 158, 20)`}>
						<circle cx='158' cy='20' r='16' fill='url(#doraemon-head)' stroke={STROKE_DARK} strokeWidth='2.5' />
						<circle cx='158' cy='20' r='10' fill='#90CAF9' />
						<circle cx='159' cy='18' r='4' fill='#64B5F6' opacity='0.4' />
					</g>

					{/* Eyes — white ellipses with dark pupils, expression-driven widen/squish */}
					<ellipse cx='74' cy='60' rx={14 * eyeScaleWiden} ry={16 * eyeScaleWiden} fill='white' stroke='#444' strokeWidth='2.5' />
					<ellipse cx='126' cy='60' rx={14 * eyeScaleWiden} ry={16 * eyeScaleWiden} fill='white' stroke='#444' strokeWidth='2.5' />

					{showPupils && (
						<>
							{/* Pupils */}
							<circle cx='77' cy='63' r='7' fill='#1A1A1A' />
							<circle cx='123' cy='63' r='7' fill='#1A1A1A' />
							{/* Eye shine */}
							<circle cx='79' cy='59' r='3.5' fill='white' />
							<circle cx='121' cy='59' r='3.5' fill='white' />
							{/* Secondary shine */}
							<circle cx='74' cy='66' r='2' fill='white' opacity='0.6' />
							<circle cx='126' cy='66' r='2' fill='white' opacity='0.6' />
						</>
					)}

					{/* Eyebrow lines above eyes (subtle, Doraemon-style) — now with smooth morphing */}
					{/* Show with any opacity when morphing away from normal, or fully when expression !== normal */}
					<g transform={`rotate(${exprMorph.browAngle}, 74, 40)`}>
						<line x1='60' y1='40' x2='88' y2='40' stroke='#1565C0' strokeWidth='3.5' strokeLinecap='round' />
					</g>
					<g transform={`rotate(${exprMorph.browAngleR}, 126, 40)`}>
						<line x1='112' y1='40' x2='140' y2='40' stroke='#1565C0' strokeWidth='3.5' strokeLinecap='round' />
					</g>

					{/* Nose — red circle with shine */}
					<circle cx='100' cy='78' rx='10' ry='9' fill='#E53935' stroke={STROKE_NOSE} strokeWidth='2' />
					<ellipse cx='97' cy='75' rx='4' ry='3' fill='#FF8A80' opacity='0.8' />

					{/* Nose-to-mouth vertical line */}
					<line x1='100' y1='87' x2='100' y2='95' stroke='#333' strokeWidth='2.5' />

					{/* Mouth (below nose line) */}
					<path d={getMouthPath()} fill={mouthFill} stroke='#333' strokeWidth='3' strokeLinecap='round' />

					{showMouthInterior && (
						<ellipse cx='100' cy={150 + mouthOpenAmount * 0.4} rx='20' ry='8' fill='#FF7979' opacity='0.5' />
					)}

					{/* Mouth corner lines */}
					<path d='M56 124 Q62 120 68 122' fill='none' stroke='#333' strokeWidth='2' strokeLinecap='round' />
					<path d='M144 124 Q138 120 132 122' fill='none' stroke='#333' strokeWidth='2' strokeLinecap='round' />
				</g>

				{/* === WHISKERS — 3 per side, properly positioned from nose area === */}
				<g stroke='#1565C0' strokeWidth='2.5' strokeLinecap='round'>
					{/* Left whiskers */}
					<line x1='56' y1='78' x2='20' y2='70' />
					<line x1='56' y1='84' x2='18' y2='84' />
					<line x1='56' y1='90' x2='22' y2='98' />
					{/* Right whiskers */}
					<line x1='144' y1='78' x2='180' y2='70' />
					<line x1='144' y1='84' x2='182' y2='84' />
					<line x1='144' y1='90' x2='178' y2='98' />
				</g>

				{/* === EXPRESSION EFFECTS === */}
				{expression === 'happy' && (
					<>
						<ellipse cx='52' cy='76' rx='10' ry='6' fill='#FF8A80' opacity='0.3' />
						<ellipse cx='148' cy='76' rx='10' ry='6' fill='#FF8A80' opacity='0.3' />
					</>
				)}

				{expression === 'angry' && (
					<>
						<line x1='56' y1='40' x2='88' y2='48' stroke='#1A1A1A' strokeWidth='4' strokeLinecap='round' />
						<line x1='144' y1='40' x2='112' y2='48' stroke='#1A1A1A' strokeWidth='4' strokeLinecap='round' />
					</>
				)}

				{expression === 'shocked' && (
					<>
						<path d='M162 42 Q166 54 162 66 Q158 54 162 42' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
						<path d='M38 42 Q42 54 38 66 Q34 54 38 42' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
					</>
				)}

				{expression === 'thinking' && (
					<>
						<text x='162' y='44' fontFamily='Arial' fontSize='18' fontWeight='bold' fill='#5C6BC0' opacity='0.6'>?</text>
					</>
				)}

				{expression === 'sad' && (
					<>
						<ellipse cx='58' cy='78' rx='3' ry='5' fill='#64B5F6' opacity='0.5' />
					</>
				)}
			</g>
		</svg>
	);
};
