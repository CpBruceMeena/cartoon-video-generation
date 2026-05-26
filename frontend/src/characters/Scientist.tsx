import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const ScientistSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.32 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 8;

	const blinkCycle = speakingFrame % 100;
	const isBlinking = blinkCycle > 94 && blinkCycle < 98;
	const blinkH = isBlinking ? 1.5 : expression === 'shocked' ? 10 : 7;

	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 130 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M74 128 Q95 ${baseY + 12} 116 128`;
				case 'angry': return `M74 122 Q95 ${baseY - 8} 116 122`;
				case 'shocked': return `M82 118 Q95 ${baseY + 2} 108 118`;
				default: return `M76 126 Q95 ${baseY + 8} 114 126`;
			}
		}
		switch (expression) {
			case 'happy': return 'M74 128 Q95 150 116 128';
			case 'angry': return 'M74 122 Q95 112 116 122';
			case 'shocked': return 'M82 118 Q95 136 108 118';
			default: return 'M76 126 Q95 142 114 126';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="270" height="370" viewBox="0 0 200 280">
			<defs>
				<radialGradient id="sci-skin" cx="50%" cy="40%" r="60%">
					<stop offset="0%" stopColor="#FFE082" />
					<stop offset="70%" stopColor="#FFCC80" />
					<stop offset="100%" stopColor="#F4A460" />
				</radialGradient>
				<linearGradient id="sci-coat" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="100%" stopColor="#F5F5F5" />
				</linearGradient>
				<linearGradient id="sci-pants" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#546E7A" />
					<stop offset="100%" stopColor="#455A64" />
				</linearGradient>
				<filter id="sci-shadow">
					<feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#sci-shadow)">
				{/* === LEGS & SHOES === */}
				<rect x="62" y="230" width="34" height="40" rx="5" fill="url(#sci-pants)" stroke="#37474F" strokeWidth="1.5" />
				<rect x="104" y="230" width="34" height="40" rx="5" fill="url(#sci-pants)" stroke="#37474F" strokeWidth="1.5" />
				<ellipse cx="79" cy="270" rx="16" ry="7" fill="#37474F" stroke="#263238" strokeWidth="2" />
				<ellipse cx="121" cy="270" rx="16" ry="7" fill="#37474F" stroke="#263238" strokeWidth="2" />

				{/* === BODY - LAB COAT === */}
				<rect x="52" y="108" width="96" height="128" rx="8" fill="url(#sci-coat)" stroke="#E0E0E0" strokeWidth="2" />
				{/* Coat lapels */}
				<path d="M68 108 L100 140 L132 108" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="1" />
				{/* Buttons */}
				<circle cx="100" cy="155" r="3.5" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="0.5" />
				<circle cx="100" cy="172" r="3.5" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="0.5" />
				{/* Pocket */}
				<rect x="130" y="160" width="16" height="14" rx="2" fill="none" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Pens in pocket */}
				<rect x="134" y="152" width="2.5" height="10" rx="1" fill="#1E88E5" />
				<rect x="138" y="154" width="2.5" height="8" rx="1" fill="#E53935" />
				{/* Shirt collar hint */}
				<rect x="72" y="112" width="8" height="6" rx="2" fill="#E3F2FD" />
				<rect x="120" y="112" width="8" height="6" rx="2" fill="#E3F2FD" />
				{/* Tie */}
				<rect x="96" y="118" width="8" height="32" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

				{/* === ARMS === */}
				<rect x="30" y="116" width="22" height="15" rx="7" fill="url(#sci-coat)" stroke="#E0E0E0" strokeWidth="1.5" />
				<rect x="148" y="116" width="22" height="15" rx="7" fill="url(#sci-coat)" stroke="#E0E0E0" strokeWidth="1.5" />
				<circle cx="30" cy="123" r="9" fill="url(#sci-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<circle cx="170" cy="123" r="9" fill="url(#sci-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HEAD === */}
				<ellipse cx="100" cy="68" rx="46" ry="52" fill="url(#sci-skin)" stroke="#DBA56E" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="54" cy="70" rx="7" ry="11" fill="url(#sci-skin)" stroke="#DBA56E" strokeWidth="1.5" />
				<ellipse cx="146" cy="70" rx="7" ry="11" fill="url(#sci-skin)" stroke="#DBA56E" strokeWidth="1.5" />

				{/* === HAIR - messy grey/white === */}
				<path d="M52 50 Q55 18 74 15 Q85 8 100 10 Q115 8 126 15 Q145 18 148 50" fill="#BDBDBD" />
				<path d="M52 50 Q48 60 46 75" fill="#BDBDBD" />
				<path d="M148 50 Q152 60 154 75" fill="#BDBDBD" />
				{/* Hair tufts (mad scientist) */}
				<path d="M72 15 Q66 4 76 8" fill="#BDBDBD" />
				<path d="M128 15 Q134 4 124 8" fill="#BDBDBD" />
				{/* Hair highlight */}
				<path d="M78 26 Q90 20 110 22" fill="none" stroke="#D6D6D6" strokeWidth="2" opacity="0.4" />

				{/* === GLASSES === */}
				<circle cx="76" cy="70" r="18" fill="none" stroke="#607D8B" strokeWidth="2.5" />
				<circle cx="124" cy="70" r="18" fill="none" stroke="#607D8B" strokeWidth="2.5" />
				<line x1="94" y1="68" x2="106" y2="68" stroke="#607D8B" strokeWidth="2" />
				<path d="M66 64 Q70 60 74 62" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
				<path d="M114 64 Q118 60 122 62" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />

				{/* === EYES (behind glasses) === */}
				<ellipse cx="76" cy="70" rx={6} ry={blinkH} fill="white" stroke="#444" strokeWidth="1" />
				<ellipse cx="124" cy="70" rx={6} ry={blinkH} fill="white" stroke="#444" strokeWidth="1" />

				{!isBlinking && (
					<>
						<circle cx="78" cy="71" r="4" fill="#1A1A1A" />
						<circle cx="126" cy="71" r="4" fill="#1A1A1A" />
						<circle cx="80" cy="68" r="2" fill="white" />
						<circle cx="128" cy="68" r="2" fill="white" />
					</>
				)}

				{/* === EYEBROWS - BUSHY === */}
				<path d="M58 48 Q76 40 94 48" fill="none" stroke="#757575" strokeWidth="3" strokeLinecap="round" />
				<path d="M106 48 Q124 40 142 48" fill="none" stroke="#757575" strokeWidth="3" strokeLinecap="round" />

				{/* Angry brows */}
				{expression === 'angry' && (
					<>
						<path d="M56 44 Q76 38 94 48" fill="none" stroke="#757575" strokeWidth="3.5" strokeLinecap="round" />
						<path d="M106 48 Q124 38 144 44" fill="none" stroke="#757575" strokeWidth="3.5" strokeLinecap="round" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="88" rx="4" ry="3.5" fill="#E8945E" />

				{/* === MUSTACHE === */}
				<path d="M78 95 Q90 90 100 94 Q110 90 122 95" fill="none" stroke="#757575" strokeWidth="2.5" strokeLinecap="round" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{/* === EXPRESSION DETAILS === */}
				{expression === 'happy' && (
					<ellipse cx="56" cy="95" rx="8" ry="5" fill="#FF8A80" opacity="0.3" />
				)}

				{expression === 'shocked' && (
					<path d="M150 42 Q154 52 150 58 Q146 52 150 42" fill="#64B5F6" />
				)}
			</g>
		</svg>
	);
};
