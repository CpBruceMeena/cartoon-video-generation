import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const ShinchanSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	// --- Expression offsets ---
	const bodyYOffset = expression === 'happy' ? -4 : expression === 'angry' ? 3 : 0;
	const eyeOffsetY = expression === 'happy' ? -3 : expression === 'angry' ? 2 : 0;

	// --- Speaking mouth animation ---
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.28 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 10;

	// --- Eye blinking ---
	const blinkCycle = speakingFrame % 100;
	const isBlinking = blinkCycle > 92 && blinkCycle < 97;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 17 : expression === 'happy' ? 9 : 13;

	// --- Mouth path ---
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseOpen = 140 + mouthOpenAmount;
			if (expression === 'happy') return `M72 132 Q95 ${baseOpen + 12} 118 132`;
			if (expression === 'angry') return `M72 128 Q95 ${baseOpen - 10} 118 128`;
			if (expression === 'shocked') return `M82 122 Q95 ${baseOpen + 6} 108 122`;
			return `M72 130 Q95 ${baseOpen + 8} 118 130`;
		}
		switch (expression) {
			case 'happy': return 'M72 132 Q95 158 118 132';
			case 'angry': return 'M72 128 Q95 116 118 128';
			case 'shocked': return 'M82 122 Q95 142 108 122';
			default: return 'M72 130 Q95 148 118 130';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : expression === 'shocked' ? '#333' : 'none';

	return (
		<svg width="280" height="360" viewBox="0 0 200 280">
			<defs>
				{/* Skin gradient */}
				<radialGradient id="shinchan-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFD54F" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				{/* Shirt gradient */}
				<linearGradient id="shinchan-shirt" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#EF5350" />
					<stop offset="50%" stopColor="#E53935" />
					<stop offset="100%" stopColor="#C62828" />
				</linearGradient>
				{/* Shorts gradient */}
				<linearGradient id="shinchan-shorts" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#FFEE58" />
					<stop offset="100%" stopColor="#FDD835" />
				</linearGradient>
				{/* Hair shadow */}
				<linearGradient id="shinchan-hair" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2C2C2C" />
					<stop offset="100%" stopColor="#1A1A1A" />
				</linearGradient>
				{/* Body shadow */}
				<filter id="shinchan-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
				</filter>
			</defs>

			<g filter="url(#shinchan-shadow)" transform={`translate(0, ${bodyYOffset})`}>
				{/* === LEGS === */}
				<rect x="68" y="248" width="18" height="22" rx="4" fill="#FFCC80" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="114" y="248" width="18" height="22" rx="4" fill="#FFCC80" stroke="#DBA56E" strokeWidth="1.5" />

				{/* Socks */}
				<rect x="67" y="266" width="20" height="8" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
				<rect x="113" y="266" width="20" height="8" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />

				{/* Shoes */}
				<ellipse cx="77" cy="278" rx="15" ry="7" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
				<ellipse cx="123" cy="278" rx="15" ry="7" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
				{/* Shoe highlights */}
				<ellipse cx="74" cy="275" rx="6" ry="2" fill="#795548" opacity="0.5" />
				<ellipse cx="120" cy="275" rx="6" ry="2" fill="#795548" opacity="0.5" />

				{/* === SHORTS === */}
				<rect x="58" y="212" width="84" height="38" rx="6" fill="url(#shinchan-shorts)" stroke="#F9A825" strokeWidth="2" />
				{/* Shorts waistband */}
				<rect x="58" y="210" width="84" height="6" rx="3" fill="#F9A825" />

				{/* === BODY / SHIRT === */}
				<rect x="56" y="135" width="88" height="82" rx="10" fill="url(#shinchan-shirt)" stroke="#B71C1C" strokeWidth="2" />

				{/* Shirt collar detail */}
				<path d="M82 135 L100 155 L118 135" fill="url(#shinchan-shirt)" stroke="#B71C1C" strokeWidth="1.5" />
				{/* Collar fold */}
				<path d="M82 135 L95 150" fill="none" stroke="#C62828" strokeWidth="1" opacity="0.5" />
				<path d="M118 135 L105 150" fill="none" stroke="#C62828" strokeWidth="1" opacity="0.5" />

				{/* === ARMS === */}
				{/* Left arm */}
				<rect x="34" y="148" width="22" height="15" rx="7" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="34" cy="155" r="9" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				{/* Right arm */}
				<rect x="144" y="148" width="22" height="15" rx="7" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="166" cy="155" r="9" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HEAD === */}
				<ellipse cx="100" cy="78" rx="50" ry="56" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="2.5" />

				{/* === HAIR === */}
				<path d="M52 52 Q56 22 76 20 Q85 14 100 16 Q115 14 124 20 Q144 22 148 52" fill="url(#shinchan-hair)" />
				{/* Hair edges - side tufts */}
				<path d="M52 52 Q48 58 50 64" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
				<path d="M148 52 Q152 58 150 64" fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
				{/* Hair highlight */}
				<path d="M75 28 Q85 22 100 24 Q115 22 125 28" fill="none" stroke="#444" strokeWidth="2" opacity="0.4" />

				{/* === EARS === */}
				<ellipse cx="50" cy="76" rx="8" ry="12" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="150" cy="76" rx="8" ry="12" fill="url(#shinchan-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				{/* Inner ear */}
				<ellipse cx="50" cy="76" rx="4" ry="6" fill="#F4A460" opacity="0.5" />
				<ellipse cx="150" cy="76" rx="4" ry="6" fill="#F4A460" opacity="0.5" />

				{/* === EYEBROWS - SHINCHAN'S TRADEMARK THICK BROWS === */}
				<rect x="60" y="58" width="32" height="10" rx="5" fill="#1A1A1A" />
				<rect x="108" y="58" width="32" height="10" rx="5" fill="#1A1A1A" />

				{/* === EYES === */}
				<ellipse cx="76" cy={`${80 + eyeOffsetY}`} rx={13} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="124" cy={`${80 + eyeOffsetY}`} rx={13} ry={blinkH} fill="white" stroke="#444" strokeWidth="1.5" />

				{!isBlinking && (
					<>
						{/* Pupils */}
						<circle cx="78" cy={`${82 + eyeOffsetY}`} r="5" fill="#1A1A1A" />
						<circle cx="126" cy={`${82 + eyeOffsetY}`} r="5" fill="#1A1A1A" />
						{/* Eye shine */}
						<circle cx="80" cy={`${78 + eyeOffsetY}`} r="2.5" fill="white" />
						<circle cx="128" cy={`${78 + eyeOffsetY}`} r="2.5" fill="white" />
						{/* Second shine (small) */}
						<circle cx="75" cy={`${84 + eyeOffsetY}`} r="1" fill="white" opacity="0.6" />
						<circle cx="123" cy={`${84 + eyeOffsetY}`} r="1" fill="white" opacity="0.6" />
					</>
				)}

				{/* === NOSE - tiny dot === */}
				<circle cx="100" cy="95" r="3.5" fill="#E8945E" stroke="#DBA56E" strokeWidth="1" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2.5" strokeLinecap="round" />

				{/* Mouth interior when open */}
				{isSpeaking && mouthOpen > 0.4 && (
					<>
						{/* Tongue hint */}
						<ellipse cx="95" cy={136 + mouthOpenAmount * 0.5} rx="10" ry="4" fill="#FF7979" opacity="0.7" />
					</>
				)}

				{/* === CHEEK BLUSH === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="55" cy="98" rx="10" ry="6" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="145" cy="98" rx="10" ry="6" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{/* Angry veins/brows */}
				{expression === 'angry' && (
					<>
						{/* Angry vein mark */}
						<path d="M58 50 L54 42 L62 46" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
						{/* Tighter angled brows */}
						<rect x="58" y="56" width="34" height="10" rx="5" fill="#1A1A1A" transform="rotate(-8, 75, 60)" />
						<rect x="108" y="56" width="34" height="10" rx="5" fill="#1A1A1A" transform="rotate(8, 125, 60)" />
					</>
				)}

				{/* Shocked effect */}
				{expression === 'shocked' && (
					<>
						{/* Sweat drop */}
						<path d="M145 55 Q148 62 145 68 Q142 62 145 55" fill="#64B5F6" />
						{/* Straight brows */}
						<rect x="60" y="56" width="32" height="10" rx="5" fill="#1A1A1A" />
						<rect x="108" y="56" width="32" height="10" rx="5" fill="#1A1A1A" />
					</>
				)}
			</g>
		</svg>
	);
};
