import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const NobitaSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.25 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 8;

	// --- Eye blinking ---
	const blinkCycle = speakingFrame % 110;
	const isBlinking = blinkCycle > 104 && blinkCycle < 108;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 12 : 8;

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 132 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M78 130 Q100 ${baseY + 12} 122 130`;
				case 'angry': return `M78 125 Q100 ${baseY - 8} 122 125`;
				case 'shocked': return `M86 118 Q100 ${baseY + 4} 114 118`;
				default: return `M78 128 Q100 ${baseY + 8} 122 128`;
			}
		}
		switch (expression) {
			case 'happy': return 'M78 130 Q100 150 122 130';
			case 'angry': return 'M78 125 Q100 114 122 125';
			case 'shocked': return 'M86 118 Q100 138 114 118';
			default: return 'M78 128 Q100 140 122 128';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="260" height="340" viewBox="0 0 200 260">
			<defs>
				<radialGradient id="nobita-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="nobita-shirt" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#FFEE58" />
					<stop offset="100%" stopColor="#FDD835" />
				</linearGradient>
				<linearGradient id="nobita-shorts" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#5C6BC0" />
					<stop offset="100%" stopColor="#3949AB" />
				</linearGradient>
				<filter id="nobita-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#nobita-shadow)">
				{/* === LEGS - SKINNY === */}
				<rect x="72" y="225" width="16" height="28" rx="4" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="112" y="225" width="16" height="28" rx="4" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* Socks */}
				<rect x="71" y="248" width="18" height="8" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
				<rect x="111" y="248" width="18" height="8" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />

				{/* Shoes */}
				<ellipse cx="80" cy="258" rx="14" ry="6" fill="#455A64" stroke="#263238" strokeWidth="1.5" />
				<ellipse cx="120" cy="258" rx="14" ry="6" fill="#455A64" stroke="#263238" strokeWidth="1.5" />

				{/* === SHORTS === */}
				<rect x="64" y="192" width="72" height="34" rx="5" fill="url(#nobita-shorts)" stroke="#283593" strokeWidth="2" />
				<rect x="64" y="190" width="72" height="6" rx="3" fill="#283593" />

				{/* === BODY SHIRT === */}
				<rect x="62" y="125" width="76" height="72" rx="8" fill="url(#nobita-shirt)" stroke="#F9A825" strokeWidth="2" />
				{/* Collar */}
				<path d="M80 125 L100 142 L120 125" fill="url(#nobita-shirt)" stroke="#F9A825" strokeWidth="1.5" />

				{/* === THIN ARMS === */}
				<rect x="40" y="136" width="22" height="12" rx="6" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<rect x="138" y="136" width="22" height="12" rx="6" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="40" cy="142" r="8" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="160" cy="142" r="8" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HEAD === */}
				<ellipse cx="100" cy="80" rx="46" ry="50" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="54" cy="78" rx="6" ry="10" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="146" cy="78" rx="6" ry="10" fill="url(#nobita-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR === */}
				<path d="M55 52 Q62 22 80 22 Q88 14 100 16 Q112 14 120 22 Q138 22 145 52" fill="#1A1A1A" />
				<path d="M55 52 Q52 58 53 64" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
				<path d="M145 52 Q148 58 147 64" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
				{/* Hair tufts */}
				<path d="M78 22 Q84 14 90 18" fill="#1A1A1A" />
				<path d="M110 18 Q116 14 122 22" fill="#1A1A1A" />
				{/* Hair highlight */}
				<path d="M75 30 Q88 24 100 26" fill="none" stroke="#444" strokeWidth="1.5" opacity="0.3" />

				{/* === GLASSES === */}
				<circle cx="76" cy="80" r="20" fill="none" stroke="#607D8B" strokeWidth="2.5" />
				<circle cx="124" cy="80" r="20" fill="none" stroke="#607D8B" strokeWidth="2.5" />
				<line x1="96" y1="78" x2="104" y2="78" stroke="#607D8B" strokeWidth="2.5" />
				{/* Glass shine */}
				<path d="M66 72 Q70 68 74 70" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
				<path d="M114 72 Q118 68 122 70" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />

				{/* === EYES (behind glasses) === */}
				<ellipse cx="76" cy="80" rx={8} ry={blinkH} fill="white" stroke="#444" strokeWidth="1" />
				<ellipse cx="124" cy="80" rx={8} ry={blinkH} fill="white" stroke="#444" strokeWidth="1" />

				{!isBlinking && (
					<>
						<circle cx="78" cy="81" r="4.5" fill="#1A1A1A" />
						<circle cx="126" cy="81" r="4.5" fill="#1A1A1A" />
						<circle cx="80" cy="78" r="2" fill="white" />
						<circle cx="128" cy="78" r="2" fill="white" />
					</>
				)}

				{/* === EYEBROWS === */}
				<path d="M60 56 Q76 50 90 58" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
				<path d="M110 58 Q124 50 140 56" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />

				{/* Angry brows */}
				{expression === 'angry' && (
					<>
						<path d="M58 52 Q76 48 90 58" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
						<path d="M110 58 Q124 48 142 52" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="95" rx="3" ry="2.5" fill="#E8945E" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{/* === EXPRESSION DETAILS === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="58" cy="95" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="142" cy="95" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{expression === 'shocked' && (
					<>
						<path d="M144 52 Q148 60 144 66 Q140 60 144 52" fill="#64B5F6" />
					</>
				)}

				{expression === 'angry' && (
					<>
						<path d="M52 48 L48 42 L56 45" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
					</>
				)}
			</g>
		</svg>
	);
};
