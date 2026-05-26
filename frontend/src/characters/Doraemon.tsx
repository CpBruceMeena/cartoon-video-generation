import React from 'react';
import {
	useMouthOpen,
	useArmAnimation,
	useBodyMovement,
	type CharacterSVGProps,
} from './useCharacterAnimation';
import { CHARACTER_ANIMATION_CONFIGS } from './animationConfig';

const cfg = CHARACTER_ANIMATION_CONFIGS.doraemon!;

export const DoraemonSVG: React.FC<CharacterSVGProps> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	// ── Shared hooks ──────────────────────────────────────────────────────
	const { mouthOpen, mouthOpenAmount, showInterior } = useMouthOpen(
		isSpeaking,
		speakingFrame,
		cfg.mouth,
	);

	// Doraemon uses scale-based eye animation
	const eyeScale = expression === 'shocked' ? 1.45 : expression === 'happy' ? 0.8 : 1;
	const blinkCycle = speakingFrame % cfg.eyeBlink.cycleLength;
	const isBlinking = blinkCycle > cfg.eyeBlink.cycleLength - 7 && blinkCycle < cfg.eyeBlink.cycleLength - 1;
	const blinkScale = isBlinking ? 0.08 : eyeScale;
	const showPupils = !isBlinking;

	// Ear wiggle
	const earWiggle = isSpeaking ? Math.sin(speakingFrame * 0.2) * 3 : Math.sin(speakingFrame * 0.04) * 1;

	// Pocket glow
	const pocketGlow = isSpeaking ? 0.5 + Math.sin(speakingFrame * 0.15) * 0.2 : 0.3;

	// Bell swing
	const bellSwing = isSpeaking ? Math.sin(speakingFrame * 0.12) * 4 : Math.sin(speakingFrame * 0.03) * 2;

	// Head tilt
	const headTilt = expression === 'happy' ? 4 : expression === 'angry' ? -3 : expression === 'shocked' ? 0 : 0;

	const { leftArmAngle, rightArmAngle } = useArmAnimation(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.arm,
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
			const baseY = 138 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M56 128 Q100 ${baseY + 24} 144 128`;
				case 'angry': return `M56 118 Q100 ${baseY - 12} 144 118`;
				case 'shocked': return `M70 114 Q100 ${baseY + 8} 130 114`;
				default: return `M56 124 Q100 ${baseY + 18} 144 124`;
			}
		}
		switch (expression) {
			case 'happy': return 'M56 128 Q100 182 144 128';
			case 'angry': return 'M56 118 Q100 104 144 118';
			case 'shocked': return 'M70 114 Q100 156 130 114';
			default: return 'M56 124 Q100 172 144 124';
		}
	};

	const showMouthInterior = isSpeaking && mouthOpen > 0.3;
	const mouthFill = showMouthInterior ? '#1A1A1A' : expression === 'shocked' ? '#333' : 'none';

	const STROKE = {
		thick: '#1565C0',
		dark: '#0D47A1',
		thin: '#444',
	};

	return (
		<svg width='280' height='300' viewBox='0 0 200 220'>
			<defs>
				{/* Body gradient */}
				<radialGradient id='doraemon-body' cx='50%' cy='35%' r='70%'>
					<stop offset='0%' stopColor='#42A5F5' />
					<stop offset='60%' stopColor='#1E88E5' />
					<stop offset='100%' stopColor='#1565C0' />
				</radialGradient>
				{/* Head gradient */}
				<radialGradient id='doraemon-head' cx='50%' cy='30%' r='75%'>
					<stop offset='0%' stopColor='#42A5F5' />
					<stop offset='60%' stopColor='#1E88E5' />
					<stop offset='100%' stopColor='#1565C0' />
				</radialGradient>
				{/* Face gradient */}
				<radialGradient id='doraemon-face' cx='50%' cy='40%' r='65%'>
					<stop offset='0%' stopColor='#FFFFFF' />
					<stop offset='80%' stopColor='#FAFAFA' />
					<stop offset='100%' stopColor='#F0F0F0' />
				</radialGradient>
				{/* Belly gradient */}
				<radialGradient id='doraemon-belly' cx='50%' cy='45%' r='60%'>
					<stop offset='0%' stopColor='#FFFFFF' />
					<stop offset='80%' stopColor='#F5F5F5' />
					<stop offset='100%' stopColor='#EEEEEE' />
				</radialGradient>
				{/* Bell gradient */}
				<radialGradient id='doraemon-bell' cx='40%' cy='35%' r='60%'>
					<stop offset='0%' stopColor='#FFEE58' />
					<stop offset='100%' stopColor='#FDD835' />
				</radialGradient>
				{/* Shadow filter */}
				<filter id='doraemon-shadow'>
					<feDropShadow dx='0' dy='5' stdDeviation='4' floodColor='#000' floodOpacity='0.18' />
				</filter>
			</defs>

			<g filter='url(#doraemon-shadow)' transform={`translate(0, ${bodyBounce})`}>
				{/* === BODY — rounder === */}
				<ellipse cx='100' cy='130' rx='78' ry='70' fill='url(#doraemon-body)' stroke={STROKE.dark} strokeWidth='3.5' />

				{/* === WHITE BELLY === */}
				<ellipse cx='100' cy='148' rx='52' ry='44' fill='url(#doraemon-belly)' stroke='#E0E0E0' strokeWidth='2' />

				{/* === GADGET POUCH === */}
				<ellipse cx='100' cy='160' rx='34' ry='15' fill='#E3F2FD' stroke='#90CAF9' strokeWidth='2' />
				{/* Pouch opening */}
				<path d='M70 160 Q100 176 130 160' fill='#E3F2FD' stroke='#90CAF9' strokeWidth='1.5' />
				<path d='M70 158 Q100 172 130 158' fill='none' stroke='#BBDEFB' strokeWidth='1' />

				{/* === COLLAR === */}
				<rect x='48' y='100' width='104' height='16' rx='8' fill='#E53935' stroke='#B71C1C' strokeWidth={3} />
				<rect x='50' y='101' width='100' height='5' rx='2.5' fill='#EF5350' opacity='0.5' />

				{/* === ARMS (animated) — rounder paws === */}
				<g transform={`rotate(${leftArmAngle}, 22, 130)`}>
					<ellipse cx='14' cy='128' rx='18' ry='38' fill='url(#doraemon-body)' stroke={STROKE.dark} strokeWidth='3' />
					<circle cx='14' cy='162' r='14' fill='white' stroke='#E0E0E0' strokeWidth='2' />
					{/* Paw pads */}
					<circle cx='12' cy='158' r='3' fill='#FFCCBC' opacity='0.6' />
					<circle cx='17' cy='164' r='3' fill='#FFCCBC' opacity='0.6' />
					<circle cx='12' cy='168' r='2.5' fill='#FFCCBC' opacity='0.6' />
				</g>

				<g transform={`rotate(${rightArmAngle}, 178, 130)`}>
					<ellipse cx='186' cy='128' rx='18' ry='38' fill='url(#doraemon-body)' stroke={STROKE.dark} strokeWidth='3' />
					<circle cx='186' cy='162' r='14' fill='white' stroke='#E0E0E0' strokeWidth='2' />
					<circle cx='184' cy='158' r='3' fill='#FFCCBC' opacity='0.6' />
					<circle cx='189' cy='164' r='3' fill='#FFCCBC' opacity='0.6' />
					<circle cx='184' cy='168' r='2.5' fill='#FFCCBC' opacity='0.6' />
				</g>

				{/* === FEET — rounder === */}
				<ellipse cx='70' cy='196' rx='26' ry='15' fill='white' stroke='#E0E0E0' strokeWidth='2.5' />
				<ellipse cx='130' cy='196' rx='26' ry='15' fill='white' stroke='#E0E0E0' strokeWidth='2.5' />
				{/* Toes */}
				<circle cx='58' cy='196' r='4' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='82' cy='196' r='4' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='118' cy='196' r='4' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />
				<circle cx='142' cy='196' r='4' fill='none' stroke='#E0E0E0' strokeWidth='1.5' />

				{/* === HEAD (with tilt) === */}
				<g transform={`rotate(${headTilt}, 100, 72)`}>
					{/* Head — bigger circle */}
					<circle cx='100' cy='72' r='62' fill='url(#doraemon-head)' stroke={STROKE.dark} strokeWidth='3.5' />

					{/* White face oval */}
					<ellipse cx='100' cy='72' rx='50' ry='48' fill='url(#doraemon-face)' stroke='#E0E0E0' strokeWidth='2' />

					{/* Inner ears */}
					<g transform={`rotate(${-earWiggle}, 52, 28)`}>
						<circle cx='52' cy='28' r='18' fill='url(#doraemon-head)' stroke={STROKE.dark} strokeWidth='2.5' />
						<circle cx='52' cy='28' r='12' fill='#90CAF9' />
						<circle cx='50' cy='26' r='5' fill='#64B5F6' opacity='0.5' />
					</g>
					<g transform={`rotate(${earWiggle}, 148, 28)`}>
						<circle cx='148' cy='28' r='18' fill='url(#doraemon-head)' stroke={STROKE.dark} strokeWidth='2.5' />
						<circle cx='148' cy='28' r='12' fill='#90CAF9' />
						<circle cx='150' cy='26' r='5' fill='#64B5F6' opacity='0.5' />
					</g>

					{/* Eyes — bigger, more expressive */}
					<ellipse cx='76' cy='62' rx={14 * blinkScale} ry={17 * blinkScale} fill='white' stroke={STROKE.thin} strokeWidth='2.5' />
					<ellipse cx='124' cy='62' rx={14 * blinkScale} ry={17 * blinkScale} fill='white' stroke={STROKE.thin} strokeWidth='2.5' />

					{showPupils && (
						<>
							<circle cx='79' cy='65' r='7' fill='#1A1A1A' />
							<circle cx='121' cy='65' r='7' fill='#1A1A1A' />
							<circle cx='81' cy='61' r='3' fill='white' />
							<circle cx='119' cy='61' r='3' fill='white' />
							<circle cx='77' cy='68' r='1.5' fill='white' opacity='0.6' />
							<circle cx='123' cy='68' r='1.5' fill='white' opacity='0.6' />
						</>
					)}

					{/* Nose — red, slightly bigger */}
					<ellipse cx='100' cy='78' rx='9' ry='8' fill='#E53935' stroke='#B71C1C' strokeWidth='2' />
					<ellipse cx='97' cy='75' rx='3.5' ry='2.5' fill='#FF8A80' opacity='0.8' />

					{/* Mouth — dark outline */}
					<path d={getMouthPath()} fill={mouthFill} stroke='#333' strokeWidth='3' strokeLinecap='round' />

					{showMouthInterior && (
						<ellipse cx='100' cy={146 + mouthOpenAmount * 0.4} rx='18' ry='7' fill='#FF7979' opacity='0.5' />
					)}
				</g>

				{/* === NOSE TO MOUTH LINE — dark, not blue === */}
				<line x1='100' y1='86' x2='100' y2='94' stroke='#333' strokeWidth='2' />
				<path d='M90 92 Q100 98 110 92' fill='none' stroke='#333' strokeWidth='2.5' />

				{/* === WHISKERS === */}
				<g stroke={STROKE.thick} strokeWidth='2' strokeLinecap='round'>
					<line x1='44' y1='70' x2='66' y2='73' />
					<line x1='44' y1='77' x2='66' y2='79' />
					<line x1='44' y1='84' x2='66' y2='85' />
					<line x1='156' y1='70' x2='134' y2='73' />
					<line x1='156' y1='77' x2='134' y2='79' />
					<line x1='156' y1='84' x2='134' y2='85' />
				</g>

				{/* === EXPRESSION EFFECTS === */}
				{expression === 'happy' && (
					<>
						<ellipse cx='52' cy='76' rx='10' ry='6' fill='#FF8A80' opacity='0.35' />
						<ellipse cx='148' cy='76' rx='10' ry='6' fill='#FF8A80' opacity='0.35' />
					</>
				)}

				{expression === 'angry' && (
					<>
						<line x1='58' y1='42' x2='88' y2='50' stroke='#1A1A1A' strokeWidth='3.5' strokeLinecap='round' />
						<line x1='142' y1='42' x2='112' y2='50' stroke='#1A1A1A' strokeWidth='3.5' strokeLinecap='round' />
					</>
				)}

				{expression === 'shocked' && (
					<>
						<path d='M152 46 Q156 56 152 66 Q148 56 152 46' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
						<path d='M48 46 Q52 56 48 66 Q44 56 48 46' fill='#64B5F6' stroke='#42A5F5' strokeWidth='1.5' />
					</>
				)}

				{/* === POCKET GLOW === */}
				<ellipse cx='100' cy='160' rx='36' ry='17' fill='none' stroke='#42A5F5' strokeWidth='2.5' opacity={pocketGlow} />

				{/* === BELL SWING === */}
				<g transform={`translate(0, 0) rotate(${bellSwing}, 100, 115)`}>
					<circle cx='100' cy='115' r='12' fill='url(#doraemon-bell)' stroke='#F9A825' strokeWidth='2.5' />
					<circle cx='100' cy='120' r='5' fill='#F9A825' stroke='#F57F17' strokeWidth='1.5' />
					<line x1='93' y1='115' x2='107' y2='115' stroke='#F57F17' strokeWidth='2.5' strokeLinecap='round' />
					<circle cx='96' cy='111' r='2.5' fill='white' opacity='0.6' />
				</g>
			</g>
		</svg>
	);
};
