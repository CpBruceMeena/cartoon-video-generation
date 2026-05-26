import React from 'react';
import {
	useMouthOpen,
	useEyeBlink,
	useArmAnimation,
	useBodyMovement,
	type CharacterSVGProps,
} from './useCharacterAnimation';
import { CHARACTER_ANIMATION_CONFIGS } from './animationConfig';

const cfg = CHARACTER_ANIMATION_CONFIGS.schoolgirl!;

export const SchoolgirlSVG: React.FC<CharacterSVGProps> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
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

	const { bodyBounce } = useBodyMovement(
		isSpeaking,
		speakingFrame,
		expression,
		cfg.bodyMovement,
	);

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 130 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M74 128 Q100 ${baseY + 16} 126 128`;
				case 'angry': return `M74 122 Q100 ${baseY - 6} 126 122`;
				case 'shocked': return `M84 116 Q100 ${baseY + 6} 116 116`;
				default: return `M76 126 Q100 ${baseY + 12} 124 126`;
			}
		}
		switch (expression) {
			case 'happy': return 'M74 128 Q100 154 126 128';
			case 'angry': return 'M74 122 Q100 112 126 122';
			case 'shocked': return 'M84 116 Q100 142 116 116';
			default: return 'M76 126 Q100 146 124 126';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="260" height="360" viewBox="0 0 200 280">
			<defs>
				<radialGradient id="sg-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="sg-skirt" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1E88E5" />
					<stop offset="100%" stopColor="#1565C0" />
				</linearGradient>
				<linearGradient id="sg-hair" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#333333" />
					<stop offset="100%" stopColor="#1A1A1A" />
				</linearGradient>
				<filter id="sg-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#sg-shadow)" transform={`translate(0, ${bodyBounce})`}>
				{/* === LEGS === */}
				<rect x="68" y="225" width="15" height="30" rx="4" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="117" y="225" width="15" height="30" rx="4" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* Socks */}
				<rect x="66" y="250" width="19" height="10" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
				<rect x="115" y="250" width="19" height="10" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />

				{/* Shoes */}
				<ellipse cx="75" cy="260" rx="13" ry="5.5" fill="#455A64" stroke="#263238" strokeWidth="1.5" />
				<ellipse cx="125" cy="260" rx="13" ry="5.5" fill="#455A64" stroke="#263238" strokeWidth="1.5" />

				{/* === SKIRT === */}
				<path d="M58 185 L142 185 L148 228 L52 228 Z" fill="url(#sg-skirt)" stroke="#0D47A1" strokeWidth="2" />
				<line x1="78" y1="185" x2="76" y2="228" stroke="#0D47A1" strokeWidth="1" opacity="0.5" />
				<line x1="100" y1="185" x2="100" y2="228" stroke="#0D47A1" strokeWidth="1" opacity="0.5" />
				<line x1="122" y1="185" x2="124" y2="228" stroke="#0D47A1" strokeWidth="1" opacity="0.5" />

				{/* === BODY - Sailor shirt === */}
				<rect x="58" y="118" width="84" height="68" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="2" />
				<path d="M58 118 L100 152 L142 118" fill="#1565C0" stroke="#0D47A1" strokeWidth="1.5" />
				<path d="M62 118 L100 150 L138 118" fill="white" />
				<path d="M96 148 L100 170 L104 148" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
				<circle cx="100" cy="148" r="4.5" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

				{/* === ANIMATED ARMS === */}
				<g transform={`rotate(${leftArmAngle}, 58, 130)`}>
					<rect x="36" y="128" width="22" height="32" rx="7" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
					<circle cx="36" cy="156" r="9" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				</g>

				<g transform={`rotate(${rightArmAngle}, 142, 130)`}>
					<rect x="142" y="128" width="22" height="32" rx="7" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
					<circle cx="164" cy="156" r="9" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				</g>

				{/* === HEAD === */}
				<ellipse cx="100" cy="75" rx="44" ry="50" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="56" cy="74" rx="6" ry="10" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="144" cy="74" rx="6" ry="10" fill="url(#sg-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR === */}
				<path d="M56 52 Q58 18 78 16 Q88 10 100 12 Q112 10 122 16 Q142 18 144 52" fill="url(#sg-hair)" />
				<path d="M56 52 Q50 68 46 90 Q44 108 48 125" fill="url(#sg-hair)" />
				<path d="M144 52 Q150 68 154 90 Q156 108 152 125" fill="url(#sg-hair)" />
				<path d="M52 60 Q50 80 48 100" fill="none" stroke="#444" strokeWidth="1.5" opacity="0.3" />
				<path d="M148 60 Q150 80 152 100" fill="none" stroke="#444" strokeWidth="1.5" opacity="0.3" />

				{/* === RIBBON === */}
				<path d="M68 18 Q80 10 92 18 Q85 28 72 28 Q65 28 68 18" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
				<path d="M132 18 Q120 10 108 18 Q115 28 128 28 Q135 28 132 18" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

				{/* === EYEBROWS === */}
				<path d="M68 58 Q80 52 92 58" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
				<path d="M108 58 Q120 52 132 58" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

				{/* === EYES === */}
				<ellipse cx="82" cy="75" rx={10} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="118" cy="75" rx={10} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />

				{!isBlinking && (
					<>
						<circle cx="84" cy="76" r="4.5" fill="#1A1A1A" />
						<circle cx="120" cy="76" r="4.5" fill="#1A1A1A" />
						<circle cx="86" cy="73" r="2.2" fill="white" />
						<circle cx="122" cy="73" r="2.2" fill="white" />
						<circle cx="82" cy="78" r="1" fill="white" opacity="0.5" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="88" rx="3" ry="2.5" fill="#E8945E" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{isSpeaking && mouthOpen > 0.4 && (
					<ellipse cx="100" cy={132 + mouthOpenAmount * 0.4} rx="14" ry="4" fill="#FF7979" opacity="0.6" />
				)}

				{/* === CHEEK BLUSH === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="64" cy="88" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="136" cy="88" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{expression === 'shocked' && (
					<path d="M146 48 Q150 56 146 62 Q142 56 146 48" fill="#64B5F6" />
				)}
			</g>
		</svg>
	);
};
