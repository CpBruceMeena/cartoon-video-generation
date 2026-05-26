import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const MisaeSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.28 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 8;

	const blinkCycle = speakingFrame % 105;
	const isBlinking = blinkCycle > 98 && blinkCycle < 103;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 11 : expression === 'happy' ? 7 : 8;

	const angryEyeOffset = expression === 'angry' ? -4 : 0;

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 130 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M75 126 Q100 ${baseY + 14} 125 126`;
				case 'angry': return `M78 120 Q100 ${baseY - 6} 122 120`;
				case 'shocked': return `M84 116 Q100 ${baseY + 4} 116 116`;
				default: return `M78 124 Q100 ${baseY + 10} 122 124`;
			}
		}
		switch (expression) {
			case 'happy': return 'M75 126 Q100 148 125 126';
			case 'angry': return 'M78 120 Q100 108 122 120';
			case 'shocked': return 'M84 116 Q100 134 116 116';
			default: return 'M78 124 Q100 138 122 124';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="260" height="340" viewBox="0 0 200 260">
			<defs>
				<radialGradient id="misae-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="misae-shirt" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#F48FB1" />
					<stop offset="100%" stopColor="#EC407A" />
				</linearGradient>
				<linearGradient id="misae-skirt" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#81C784" />
					<stop offset="100%" stopColor="#66BB6A" />
				</linearGradient>
				<linearGradient id="misae-hair" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#8D6E63" />
					<stop offset="100%" stopColor="#5D4037" />
				</linearGradient>
				<filter id="misae-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#misae-shadow)">
				{/* === LEGS === */}
				<rect x="70" y="218" width="14" height="28" rx="4" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="116" y="218" width="14" height="28" rx="4" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* Shoes */}
				<ellipse cx="77" cy="248" rx="13" ry="6" fill="#8D6E63" stroke="#6D4C41" strokeWidth="1.5" />
				<ellipse cx="123" cy="248" rx="13" ry="6" fill="#8D6E63" stroke="#6D4C41" strokeWidth="1.5" />

				{/* === SKIRT === */}
				<path d="M58 180 L142 180 L148 220 L52 220 Z" fill="url(#misae-skirt)" stroke="#43A047" strokeWidth="2" />
				{/* Skirt pleats */}
				<line x1="78" y1="180" x2="76" y2="220" stroke="#43A047" strokeWidth="1" opacity="0.5" />
				<line x1="100" y1="180" x2="100" y2="220" stroke="#43A047" strokeWidth="1" opacity="0.5" />
				<line x1="122" y1="180" x2="124" y2="220" stroke="#43A047" strokeWidth="1" opacity="0.5" />

				{/* === BODY SHIRT === */}
				<rect x="58" y="118" width="84" height="65" rx="8" fill="url(#misae-shirt)" stroke="#EC407A" strokeWidth="2" />
				{/* Collar */}
				<path d="M78 118 L100 134 L122 118" fill="url(#misae-shirt)" stroke="#EC407A" strokeWidth="1.5" />

				{/* === ARMS === */}
				<rect x="36" y="128" width="22" height="13" rx="6" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="142" y="128" width="22" height="13" rx="6" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="36" cy="134" r="8" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="164" cy="134" r="8" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HEAD === */}
				<ellipse cx="100" cy="70" rx="45" ry="52" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="55" cy="70" rx="6" ry="10" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="145" cy="70" rx="6" ry="10" fill="url(#misae-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR - brown, shoulder-length === */}
				<path d="M56 58 Q55 22 72 20 Q80 10 100 12 Q120 10 128 20 Q145 22 144 58" fill="url(#misae-hair)" />
				{/* Side hair */}
				<path d="M56 58 Q50 72 48 92 Q48 110 52 118" fill="url(#misae-hair)" />
				<path d="M144 58 Q150 72 152 92 Q152 110 148 118" fill="url(#misae-hair)" />
				{/* Hair highlight */}
				<path d="M68 30 Q80 24 100 26" fill="none" stroke="#A1887F" strokeWidth="2" opacity="0.4" />
				{/* Hair ties */}
				<circle cx="56" cy="110" r="5" fill="#F48FB1" stroke="#EC407A" strokeWidth="1" />
				<circle cx="144" cy="110" r="5" fill="#F48FB1" stroke="#EC407A" strokeWidth="1" />

				{/* === EYEBROWS === */}
				<path d="M64 54 Q78 48 90 54" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />
				<path d="M110 54 Q122 48 136 54" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />

				{/* Angry brows */}
				{expression === 'angry' && (
					<>
						<path d="M60 48 Q78 52 90 54" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
						<path d="M140 48 Q122 52 110 54" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
					</>
				)}

				{/* === EYES === */}
				<ellipse cx="80" cy={`${76 + angryEyeOffset}`} rx={10} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="120" cy={`${76 + angryEyeOffset}`} rx={10} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />

				{!isBlinking && (
					<>
						<circle cx="82" cy={`${78 + angryEyeOffset}`} r="4" fill="#1A1A1A" />
						<circle cx="122" cy={`${78 + angryEyeOffset}`} r="4" fill="#1A1A1A" />
						<circle cx="84" cy={`${75 + angryEyeOffset}`} r="1.8" fill="white" />
						<circle cx="124" cy={`${75 + angryEyeOffset}`} r="1.8" fill="white" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="90" rx="3" ry="2.5" fill="#E8945E" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{/* === EXPRESSION DETAILS === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="58" cy="90" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="142" cy="90" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{expression === 'shocked' && (
					<path d="M146 48 Q150 56 146 62 Q142 56 146 48" fill="#64B5F6" />
				)}
			</g>
		</svg>
	);
};
