import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const VillainSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.22 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 10;

	const blinkCycle = speakingFrame % 100;
	const isBlinking = blinkCycle > 94 && blinkCycle < 98;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 9 : 7;

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 122 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M68 115 Q95 ${baseY + 12} 122 115`;
				case 'angry': return `M68 112 Q95 ${baseY - 6} 122 112`;
				case 'shocked': return `M82 108 Q95 ${baseY + 4} 108 108`;
				default: return `M72 118 Q95 ${baseY + 8} 118 118`;
			}
		}
		switch (expression) {
			case 'happy': return 'M68 115 Q95 138 122 115';
			case 'angry': return 'M68 112 Q95 104 122 112';
			case 'shocked': return 'M82 108 Q95 128 108 108';
			default: return 'M72 118 Q95 132 118 118';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="300" height="380" viewBox="0 0 200 270">
			<defs>
				<radialGradient id="villain-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="villain-suit" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#37474F" />
					<stop offset="100%" stopColor="#263238" />
				</linearGradient>
				<linearGradient id="villain-cape" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#333" />
					<stop offset="100%" stopColor="#1A1A1A" />
				</linearGradient>
				<linearGradient id="villain-pants" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#263238" />
					<stop offset="100%" stopColor="#1A1A1A" />
				</linearGradient>
				<filter id="villain-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
				</filter>
			</defs>

			<g filter="url(#villain-shadow)">
				{/* === CAPE === */}
				<path d="M52 128 L12 222 Q100 234 188 222 L148 128" fill="url(#villain-cape)" stroke="#333" strokeWidth="2" />
				<path d="M12 222 Q2 238 22 254 Q68 238 100 232" fill="#111" />
				{/* Cape clasp */}
				<circle cx="100" cy="130" r="7" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />
				<circle cx="100" cy="130" r="2.5" fill="#F9A825" />

				{/* === LEGS === */}
				<rect x="62" y="172" width="30" height="55" rx="6" fill="url(#villain-pants)" stroke="#1A1A1A" strokeWidth="2" />
				<rect x="108" y="172" width="30" height="55" rx="6" fill="url(#villain-pants)" stroke="#1A1A1A" strokeWidth="2" />
				{/* Boots */}
				<rect x="60" y="224" width="34" height="18" rx="7" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
				<rect x="106" y="224" width="34" height="18" rx="7" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
				{/* Boot gold trim */}
				<rect x="60" y="238" width="34" height="5" rx="2" fill="#FDD835" />
				<rect x="106" y="238" width="34" height="5" rx="2" fill="#FDD835" />

				{/* === BODY SUIT === */}
				<rect x="56" y="102" width="88" height="72" rx="8" fill="url(#villain-suit)" stroke="#1A1A1A" strokeWidth="2" />
				{/* Suit lapels */}
				<path d="M74 102 L100 134 L126 102" fill="#37474F" stroke="#263238" strokeWidth="1" />
				{/* Belt */}
				<rect x="56" y="164" width="88" height="8" rx="3" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
				<rect x="94" y="162" width="12" height="12" rx="2" fill="#FDD835" stroke="#F9A825" strokeWidth="1" />

				{/* === ARMS === */}
				<rect x="34" y="110" width="22" height="16" rx="8" fill="url(#villain-suit)" stroke="#1A1A1A" strokeWidth="2" />
				<rect x="144" y="110" width="22" height="16" rx="8" fill="url(#villain-suit)" stroke="#1A1A1A" strokeWidth="2" />
				{/* Gloves */}
				<rect x="30" y="124" width="14" height="20" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
				<rect x="156" y="124" width="14" height="20" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
				{/* Hands */}
				<circle cx="37" cy="118" r="9" fill="url(#villain-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="163" cy="118" r="9" fill="url(#villain-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HEAD === */}
				<ellipse cx="100" cy="65" rx="42" ry="46" fill="url(#villain-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="58" cy="66" rx="7" ry="11" fill="url(#villain-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="142" cy="66" rx="7" ry="11" fill="url(#villain-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR - slicked back === */}
				<path d="M60 42 Q62 14 78 10 Q88 6 100 8 Q112 6 122 10 Q138 14 140 42" fill="#1A1A1A" />
				<path d="M60 42 Q56 48 54 58" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
				<path d="M140 42 Q144 48 146 58" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
				{/* Widow's peak */}
				<path d="M92 8 L100 4 L108 8" fill="#1A1A1A" />
				{/* Hair shine */}
				<path d="M80 20 Q100 16 120 20" fill="none" stroke="#444" strokeWidth="2" opacity="0.3" />

				{/* === EYEBROWS - angled for villainy === */}
				<path d="M62 48 Q78 42 90 48" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
				<path d="M110 48 Q122 42 138 48" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

				{/* Angry brows (even more angled) */}
				{expression === 'angry' && (
					<>
						<path d="M58 44 Q78 40 90 48" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
						<path d="M110 48 Q122 40 142 44" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
					</>
				)}

				{/* === EYES - narrowed, red === */}
				<ellipse cx="78" cy="64" rx={9} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="122" cy="64" rx={9} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />

				{!isBlinking && (
					<>
						<ellipse cx="79" cy="65" rx="5" ry="4.5" fill="#E53935" />
						<ellipse cx="121" cy="65" rx="5" ry="4.5" fill="#E53935" />
						{/* Eye shine */}
						<circle cx="81" cy="63" r="2" fill="white" />
						<circle cx="123" cy="63" r="2" fill="white" />
					</>
				)}

				{/* === NOSE - sharp === */}
				<path d="M100 68 L104 84 L96 84 Z" fill="#E8945E" stroke="#DBA56E" strokeWidth="1" />

				{/* === SCAR === */}
				<path d="M56 68 Q60 65 64 70" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2.5" strokeLinecap="round" />

				{/* === CHIN SHADOW === */}
				<path d="M84 108 Q100 114 116 108" fill="none" stroke="#DBA56E" strokeWidth="1" opacity="0.4" />

				{/* === EXPRESSION EFFECTS === */}
				{expression === 'happy' && (
					<path d="M68 118 Q95 142 122 118" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
				)}

				{expression === 'angry' && (
					<ellipse cx="100" cy="65" rx="52" ry="56" fill="none" stroke="#E53935" strokeWidth="2" opacity="0.3" />
				)}

				{expression === 'shocked' && (
					<path d="M148 36 Q154 48 148 56 Q142 48 148 36" fill="#64B5F6" />
				)}
			</g>
		</svg>
	);
};
