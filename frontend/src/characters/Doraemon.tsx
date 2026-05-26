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

	// Doraemon uses scale-based eye animation (not height-based like humans)
	const eyeScale = expression === 'shocked' ? 1.4 : expression === 'happy' ? 0.82 : 1;
	const blinkCycle = speakingFrame % cfg.eyeBlink.cycleLength;
	const isBlinking = blinkCycle > cfg.eyeBlink.cycleLength - 7 && blinkCycle < cfg.eyeBlink.cycleLength - 1;
	const blinkScale = isBlinking ? 0.08 : eyeScale;
	const showPupils = !isBlinking;

	// Ear wiggle: subtle movement when speaking
	const earWiggle = isSpeaking ? Math.sin(speakingFrame * 0.2) * 3 : Math.sin(speakingFrame * 0.04) * 1;

	// Pocket glow: gentle pulse
	const pocketGlow = isSpeaking ? 0.5 + Math.sin(speakingFrame * 0.15) * 0.2 : 0.3;

	// Bell swing: gentle sway from movement
	const bellSwing = isSpeaking ? Math.sin(speakingFrame * 0.12) * 4 : Math.sin(speakingFrame * 0.03) * 2;

	// Head tilt: subtle expression-based tilt
	const headTilt = expression === 'happy' ? 3 : expression === 'angry' ? -2 : expression === 'shocked' ? 0 : 0;

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

	// --- Mouth path - BIG semicircle below white face (Doraemon's trademark) ---
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 138 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M58 128 Q100 ${baseY + 22} 142 128`;
				case 'angry': return `M58 118 Q100 ${baseY - 10} 142 118`;
				case 'shocked': return `M72 114 Q100 ${baseY + 6} 128 114`;
				default: return `M58 124 Q100 ${baseY + 16} 142 124`;
			}
		}
		switch (expression) {
			case 'happy': return 'M58 128 Q100 178 142 128';
			case 'angry': return 'M58 118 Q100 106 142 118';
			case 'shocked': return 'M72 114 Q100 152 128 114';
			default: return 'M58 124 Q100 168 142 124';
		}
	};

	const showMouthInterior = isSpeaking && mouthOpen > 0.3;
	const mouthFill = showMouthInterior ? '#1A1A1A' : expression === 'shocked' ? '#333' : 'none';

	return (
		<svg width="280" height="300" viewBox="0 0 200 220">
			<defs>
				{/* Body gradient */}
				<radialGradient id="doraemon-body" cx="50%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#42A5F5" />
					<stop offset="60%" stopColor="#1E88E5" />
					<stop offset="100%" stopColor="#1565C0" />
				</radialGradient>
				{/* Head gradient */}
				<radialGradient id="doraemon-head" cx="50%" cy="35%" r="70%">
					<stop offset="0%" stopColor="#42A5F5" />
					<stop offset="60%" stopColor="#1E88E5" />
					<stop offset="100%" stopColor="#1565C0" />
				</radialGradient>
				{/* Belly gradient */}
				<radialGradient id="doraemon-belly" cx="50%" cy="45%" r="60%">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="80%" stopColor="#F5F5F5" />
					<stop offset="100%" stopColor="#E0E0E0" />
				</radialGradient>
				{/* Face gradient */}
				<radialGradient id="doraemon-face" cx="50%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="80%" stopColor="#FAFAFA" />
					<stop offset="100%" stopColor="#EEEEEE" />
				</radialGradient>
				{/* Bell gradient */}
				<radialGradient id="doraemon-bell" cx="40%" cy="35%" r="60%">
					<stop offset="0%" stopColor="#FFEE58" />
					<stop offset="100%" stopColor="#FDD835" />
				</radialGradient>
				{/* Body shadow */}
				<filter id="doraemon-shadow">
					<feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
				</filter>
			</defs>

			<g filter="url(#doraemon-shadow)" transform={`translate(0, ${bodyBounce})`}>
				{/* === BODY === */}
				<ellipse cx="100" cy="130" rx="75" ry="68" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2.5" />

				{/* === WHITE BELLY === */}
				<ellipse cx="100" cy="148" rx="50" ry="42" fill="url(#doraemon-belly)" stroke="#E0E0E0" strokeWidth="1.5" />

				{/* === GADGET POUCH === */}
				<ellipse cx="100" cy="158" rx="32" ry="14" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
				{/* Pouch opening line */}
				<path d="M72 158 Q100 172 128 158" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
				<path d="M72 156 Q100 168 128 156" fill="none" stroke="#BBDEFB" strokeWidth="0.5" />

				{/* === COLLAR === */}
				<rect x="52" y="100" width="96" height="15" rx="7.5" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
				<rect x="55" y="101" width="90" height="4" rx="2" fill="#EF5350" opacity="0.6" />

				{/* === ARMS (animated) === */}
				{/* Left arm + paw - longer arm with bigger paw */}
				<g transform={`rotate(${leftArmAngle}, 25, 130)`}>
					<ellipse cx="16" cy="128" rx="16" ry="36" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2" />
					<circle cx="16" cy="160" r="13" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
					<circle cx="14" cy="156" r="2.5" fill="#FFCCBC" opacity="0.6" />
					<circle cx="18" cy="162" r="2.5" fill="#FFCCBC" opacity="0.6" />
					<circle cx="14" cy="165" r="2" fill="#FFCCBC" opacity="0.6" />
				</g>

				{/* Right arm + paw - longer arm with bigger paw */}
				<g transform={`rotate(${rightArmAngle}, 175, 130)`}>
					<ellipse cx="184" cy="128" rx="16" ry="36" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2" />
					<circle cx="184" cy="160" r="13" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
					<circle cx="182" cy="156" r="2.5" fill="#FFCCBC" opacity="0.6" />
					<circle cx="186" cy="162" r="2.5" fill="#FFCCBC" opacity="0.6" />
					<circle cx="186" cy="165" r="2" fill="#FFCCBC" opacity="0.6" />
				</g>

				{/* === FEET === */}
				<ellipse cx="72" cy="192" rx="24" ry="14" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				<ellipse cx="128" cy="192" rx="24" ry="14" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Foot toes */}
				<circle cx="62" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="82" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="118" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="138" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />

				{/* === HEAD (with tilt) === */}
				<g transform={`rotate(${headTilt}, 100, 72)`}>
					<circle cx="100" cy="72" r="58" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="2.5" />

				{/* === FACE (white oval) === */}
				<ellipse cx="100" cy="72" rx="46" ry="44" fill="url(#doraemon-face)" stroke="#E0E0E0" strokeWidth="1" />

				{/* === INNER EARS (with wiggle) === */}
				<g transform={`rotate(${-earWiggle}, 55, 32)`}>
					<circle cx="55" cy="32" r="15" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="1.5" />
					<circle cx="55" cy="32" r="10" fill="#90CAF9" />
					<circle cx="53" cy="30" r="4" fill="#64B5F6" opacity="0.5" />
				</g>
				<g transform={`rotate(${earWiggle}, 145, 32)`}>
					<circle cx="145" cy="32" r="15" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="1.5" />
					<circle cx="145" cy="32" r="10" fill="#90CAF9" />
					<circle cx="143" cy="30" r="4" fill="#64B5F6" opacity="0.5" />
				</g>

				{/* === EYES === */}
				<ellipse cx="78" cy="62" rx={12 * blinkScale} ry={15 * blinkScale} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="122" cy="62" rx={12 * blinkScale} ry={15 * blinkScale} fill="white" stroke="#444" strokeWidth="1.5" />

				{showPupils && (
					<>
						<circle cx="81" cy="65" r="6" fill="#1A1A1A" />
						<circle cx="119" cy="65" r="6" fill="#1A1A1A" />
						<circle cx="83" cy="61" r="2.5" fill="white" />
						<circle cx="117" cy="61" r="2.5" fill="white" />
						<circle cx="79" cy="67" r="1.2" fill="white" opacity="0.6" />
						<circle cx="121" cy="67" r="1.2" fill="white" opacity="0.6" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="78" rx="8" ry="7" fill="#E53935" stroke="#B71C1C" strokeWidth="1.5" />
				<ellipse cx="97" cy="75" rx="3" ry="2" fill="#FF8A80" opacity="0.8" />

				{/* === MOUTH - wide semicircle below face === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2.5" strokeLinecap="round" />

				{/* Mouth interior */}
				{showMouthInterior && (
					<>
						<ellipse cx="100" cy={142 + mouthOpenAmount * 0.4} rx="16" ry="6" fill="#FF7979" opacity="0.5" />
					</>
				)}

				</g>

				{/* === WHISKERS === */}
				<g stroke="#333" strokeWidth="1.3" strokeLinecap="round">
					<line x1="48" y1="70" x2="68" y2="73" />
					<line x1="48" y1="76" x2="68" y2="78" />
					<line x1="48" y1="82" x2="68" y2="83" />
					<line x1="152" y1="70" x2="132" y2="73" />
					<line x1="152" y1="76" x2="132" y2="78" />
					<line x1="152" y1="82" x2="132" y2="83" />
				</g>

				{/* === MOUTH CENTER LINE === */}
				<line x1="100" y1="85" x2="100" y2="108" stroke="#333" strokeWidth="1.2" />

				{/* === NOSE TO MOUTH LINE === */}
				<line x1="100" y1="85" x2="100" y2="92" stroke="#333" strokeWidth="1.2" />
				<path d="M92 90 Q100 94 108 90" fill="none" stroke="#333" strokeWidth="1.2" />

				{/* === EXPRESSION EFFECTS === */}

				{expression === 'happy' && (
					<>
						<ellipse cx="55" cy="74" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="145" cy="74" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{expression === 'angry' && (
					<>
						<line x1="62" y1="44" x2="90" y2="50" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
						<line x1="138" y1="44" x2="110" y2="50" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
					</>
				)}

				{expression === 'shocked' && (
					<>
						<path d="M148 48 Q152 56 148 62 Q144 56 148 48" fill="#64B5F6" />
						<path d="M52 48 Q56 56 52 62 Q48 56 52 48" fill="#64B5F6" />
						{/* Bigger eyes from eyeScale */}
					</>
				)}

				{/* === POCKET GLOW === */}
				<ellipse cx="100" cy="158" rx="34" ry="16" fill="none" stroke="#42A5F5" strokeWidth="2" opacity={pocketGlow} />

				{/* === BELL SWING (overlays on top) === */}
				<g transform={`translate(0, 0) rotate(${bellSwing}, 100, 115)`}>
					<circle cx="100" cy="115" r="11" fill="url(#doraemon-bell)" stroke="#F9A825" strokeWidth="2" />
					<circle cx="100" cy="119" r="4.5" fill="#F9A825" stroke="#F57F17" strokeWidth="1" />
					<line x1="94" y1="115" x2="106" y2="115" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" />
					<circle cx="96" cy="112" r="2" fill="white" opacity="0.6" />
				</g>
			</g>
		</svg>
	);
};
