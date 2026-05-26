import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const RayneSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.25 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 8;

	const blinkCycle = speakingFrame % 90;
	const isBlinking = blinkCycle > 84 && blinkCycle < 88;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 11 : expression === 'happy' ? 7 : 8;

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 82 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M70 80 Q80 ${baseY + 8} 90 80`;
				case 'angry': return `M70 78 Q80 ${baseY - 6} 90 78`;
				case 'shocked': return `M74 76 Q80 ${baseY + 2} 86 76`;
				default: return `M72 80 Q80 ${baseY + 6} 88 80`;
			}
		}
		switch (expression) {
			case 'happy': return 'M70 80 Q80 94 90 80';
			case 'angry': return 'M70 78 Q80 72 90 78';
			case 'shocked': return 'M74 76 Q80 90 86 76';
			default: return 'M72 80 Q80 90 88 80';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	const eyeOffsetY = 62;

	return (
		<svg width="260" height="360" viewBox="0 0 160 240">
			<defs>
				<radialGradient id="rayne-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="rayne-armor" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1976D2" />
					<stop offset="100%" stopColor="#0D47A1" />
				</linearGradient>
				<linearGradient id="rayne-cape" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#8E24AA" />
					<stop offset="100%" stopColor="#4A148C" />
				</linearGradient>
				<filter id="rayne-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
				</filter>
			</defs>

			<g filter="url(#rayne-shadow)">
				{/* === CAPE === */}
				<path d="M60 140 L18 200 Q80 206 142 200 L100 140" fill="url(#rayne-cape)" stroke="#4A148C" strokeWidth="2" opacity="0.9" />
				<path d="M18 200 Q6 216 28 232 Q60 218 80 210" fill="#6A1B9A" opacity="0.6" />

				{/* === LEGS === */}
				<rect x="58" y="162" width="16" height="45" rx="5" fill="url(#rayne-armor)" stroke="#0D47A1" strokeWidth="2" />
				<rect x="86" y="162" width="16" height="45" rx="5" fill="url(#rayne-armor)" stroke="#0D47A1" strokeWidth="2" />
				{/* Boots */}
				<rect x="56" y="204" width="20" height="18" rx="7" fill="#37474F" stroke="#263238" strokeWidth="2" />
				<rect x="84" y="204" width="20" height="18" rx="7" fill="#37474F" stroke="#263238" strokeWidth="2" />
				<rect x="56" y="218" width="20" height="4" rx="2" fill="#263238" />
				<rect x="84" y="218" width="20" height="4" rx="2" fill="#263238" />
				{/* Boot gold trim */}
				<rect x="56" y="202" width="20" height="4" rx="2" fill="#FDD835" />
				<rect x="84" y="202" width="20" height="4" rx="2" fill="#FDD835" />

				{/* === BODY ARMOR === */}
				<rect x="54" y="100" width="52" height="64" rx="8" fill="url(#rayne-armor)" stroke="#0D47A1" strokeWidth="2" />
				{/* Chest emblem */}
				<path d="M72 110 L84 120 L72 130 L60 120 Z" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />
				{/* Armor lines */}
				<path d="M55 110 L105 110" stroke="#0D47A1" strokeWidth="1" opacity="0.4" />
				<path d="M55 140 L105 140" stroke="#0D47A1" strokeWidth="1" opacity="0.4" />
				{/* Belt */}
				<rect x="54" y="154" width="52" height="8" rx="3" fill="#263238" stroke="#1A1A1A" strokeWidth="1.5" />
				<rect x="75" y="152" width="10" height="12" rx="2" fill="#FDD835" stroke="#F9A825" strokeWidth="1" />

				{/* === ARMS === */}
				<rect x="32" y="108" width="20" height="14" rx="7" fill="url(#rayne-armor)" stroke="#0D47A1" strokeWidth="2" />
				<rect x="108" y="108" width="20" height="14" rx="7" fill="url(#rayne-armor)" stroke="#0D47A1" strokeWidth="2" />
				{/* Gloves */}
				<rect x="30" y="120" width="12" height="18" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				<rect x="118" y="120" width="12" height="18" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Glove gold trim */}
				<rect x="30" y="118" width="12" height="3" rx="1.5" fill="#FDD835" />
				<rect x="118" y="118" width="12" height="3" rx="1.5" fill="#FDD835" />

				{/* === HEAD === */}
				<ellipse cx="80" cy="62" rx="36" ry="38" fill="url(#rayne-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="44" cy="60" rx="6" ry="10" fill="url(#rayne-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="116" cy="60" rx="6" ry="10" fill="url(#rayne-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR - long flowing === */}
				<path d="M46 42 Q44 14 54 10 Q64 6 80 8 Q96 6 106 10 Q116 14 114 42" fill="#1A1A1A" />
				<path d="M46 42 Q40 56 36 78 Q34 96 38 118" fill="#1A1A1A" />
				<path d="M114 42 Q120 56 124 78 Q126 96 122 118" fill="#1A1A1A" />
				{/* Hair highlights */}
				<path d="M50 50 Q48 70 44 90" fill="none" stroke="#444" strokeWidth="2" opacity="0.3" />
				<path d="M110 50 Q112 70 116 90" fill="none" stroke="#444" strokeWidth="2" opacity="0.3" />

				{/* === CROWN/HEADBAND === */}
				<path d="M46 42 Q60 34 80 32 Q100 34 114 42" fill="none" stroke="#FDD835" strokeWidth="3" />
				<circle cx="80" cy="32" r="5" fill="#FDD835" stroke="#F9A825" strokeWidth="1" />
				<circle cx="80" cy="32" r="3" fill="#E53935" />

				{/* === EYEBROWS === */}
				<path d="M58 52 Q68 48 76 52" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
				<path d="M84 52 Q92 48 102 52" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

				{/* === EYES === */}
				<ellipse cx="68" cy={`${eyeOffsetY}`} rx={8} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="92" cy={`${eyeOffsetY}`} rx={8} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />

				{!isBlinking && (
					<>
						<circle cx="70" cy={`${eyeOffsetY + 1}`} r="4.5" fill="#4A148C" />
						<circle cx="94" cy={`${eyeOffsetY + 1}`} r="4.5" fill="#4A148C" />
						<circle cx="72" cy={`${eyeOffsetY - 2}`} r="2.2" fill="white" />
						<circle cx="96" cy={`${eyeOffsetY - 2}`} r="2.2" fill="white" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="80" cy="76" rx="3" ry="2.5" fill="#E8945E" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{/* === EXPRESSION EFFECTS === */}
				{expression === 'angry' && (
					<>
						{/* Power glow */}
						<ellipse cx="80" cy="62" rx="44" ry="46" fill="none" stroke="#7B1FA2" strokeWidth="2" opacity="0.4" />
					</>
				)}

				{expression === 'happy' && (
					<>
						<ellipse cx="52" cy="72" rx="7" ry="4" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="108" cy="72" rx="7" ry="4" fill="#FF8A80" opacity="0.35" />
					</>
				)}
			</g>
		</svg>
	);
};
