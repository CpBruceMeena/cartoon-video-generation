import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const DoraemonSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	// --- Eye scaling for expressions ---
	const eyeScale = expression === 'shocked' ? 1.35 : expression === 'happy' ? 0.85 : 1;

	// --- Speaking mouth ---
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.25 * Math.PI * 2)) : 0;
	const mouthOpenAmount = mouthOpen * 12;

	// --- Blinking ---
	const blinkCycle = speakingFrame % 95;
	const isBlinking = blinkCycle > 88 && blinkCycle < 94;
	const blinkScale = isBlinking ? 0.08 : eyeScale;
	const showPupils = !isBlinking;

	// --- Mouth path ---
	const getMouthPath = () => {
		if (isSpeaking) {
			const baseY = 140 + mouthOpenAmount;
			switch (expression) {
				case 'happy': return `M68 132 Q100 ${baseY + 10} 132 132`;
				case 'angry': return `M68 125 Q100 ${baseY - 8} 132 125`;
				case 'shocked': return `M82 120 Q100 ${baseY + 2} 118 120`;
				default: return `M68 128 Q100 ${baseY + 6} 132 128`;
			}
		}
		switch (expression) {
			case 'happy': return 'M68 132 Q100 168 132 132';
			case 'angry': return 'M68 125 Q100 112 132 125';
			case 'shocked': return 'M82 120 Q100 142 118 120';
			default: return 'M68 128 Q100 158 132 128';
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

			<g filter="url(#doraemon-shadow)">
				{/* === BODY === */}
				<ellipse cx="100" cy="130" rx="75" ry="68" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2.5" />

				{/* === WHITE BELLY === */}
				<ellipse cx="100" cy="148" rx="50" ry="42" fill="url(#doraemon-belly)" stroke="#E0E0E0" strokeWidth="1.5" />

				{/* === GADGET POUCH === */}
				<ellipse cx="100" cy="158" rx="32" ry="14" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
				{/* Pouch opening line */}
				<path d="M72 158 Q100 172 128 158" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
				{/* Pouch rim highlight */}
				<path d="M72 156 Q100 168 128 156" fill="none" stroke="#BBDEFB" strokeWidth="0.5" />

				{/* === COLLAR === */}
				<rect x="52" y="100" width="96" height="15" rx="7.5" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
				{/* Collar highlight */}
				<rect x="55" y="101" width="90" height="4" rx="2" fill="#EF5350" opacity="0.6" />

				{/* === BELL === */}
				<circle cx="100" cy="115" r="11" fill="url(#doraemon-bell)" stroke="#F9A825" strokeWidth="2" />
				{/* Bell clapper */}
				<circle cx="100" cy="119" r="4.5" fill="#F9A825" stroke="#F57F17" strokeWidth="1" />
				{/* Bell slit */}
				<line x1="94" y1="115" x2="106" y2="115" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" />
				{/* Bell shine */}
				<circle cx="96" cy="112" r="2" fill="white" opacity="0.6" />

				{/* === ARMS === */}
				{/* Left arm */}
				<ellipse cx="20" cy="130" rx="18" ry="12" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2"
					transform="rotate(-25, 20, 130)" />
				{/* Right arm */}
				<ellipse cx="180" cy="130" rx="18" ry="12" fill="url(#doraemon-body)" stroke="#1565C0" strokeWidth="2"
					transform="rotate(25, 180, 130)" />

				{/* === PAWS (white circles) === */}
				<circle cx="20" cy="138" r="10" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				<circle cx="180" cy="138" r="10" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Paw pads */}
				<circle cx="18" cy="136" r="2" fill="#FFCCBC" opacity="0.6" />
				<circle cx="22" cy="140" r="2" fill="#FFCCBC" opacity="0.6" />
				<circle cx="178" cy="136" r="2" fill="#FFCCBC" opacity="0.6" />
				<circle cx="182" cy="140" r="2" fill="#FFCCBC" opacity="0.6" />

				{/* === FEET === */}
				<ellipse cx="72" cy="192" rx="24" ry="14" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				<ellipse cx="128" cy="192" rx="24" ry="14" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Foot toes */}
				<circle cx="62" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="82" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="118" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="138" cy="192" r="3" fill="none" stroke="#E0E0E0" strokeWidth="1" />

				{/* === HEAD === */}
				<circle cx="100" cy="72" r="58" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="2.5" />

				{/* === FACE (white oval) === */}
				<ellipse cx="100" cy="72" rx="46" ry="44" fill="url(#doraemon-face)" stroke="#E0E0E0" strokeWidth="1" />

				{/* === INNER EARS === */}
				<circle cx="55" cy="32" r="15" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="1.5" />
				<circle cx="145" cy="32" r="15" fill="url(#doraemon-head)" stroke="#1565C0" strokeWidth="1.5" />
				<circle cx="55" cy="32" r="10" fill="#90CAF9" />
				<circle cx="145" cy="32" r="10" fill="#90CAF9" />
				{/* Ear detail */}
				<circle cx="53" cy="30" r="4" fill="#64B5F6" opacity="0.5" />
				<circle cx="143" cy="30" r="4" fill="#64B5F6" opacity="0.5" />

				{/* === EYES === */}
				<ellipse cx="78" cy="62" rx={12 * blinkScale} ry={15 * blinkScale} fill="white" stroke="#444" strokeWidth="1.5" />
				<ellipse cx="122" cy="62" rx={12 * blinkScale} ry={15 * blinkScale} fill="white" stroke="#444" strokeWidth="1.5" />

				{showPupils && (
					<>
						{/* Pupils */}
						<circle cx="81" cy="65" r="6" fill="#1A1A1A" />
						<circle cx="119" cy="65" r="6" fill="#1A1A1A" />
						{/* Eye shine */}
						<circle cx="83" cy="61" r="2.5" fill="white" />
						<circle cx="117" cy="61" r="2.5" fill="white" />
						{/* Second shine */}
						<circle cx="79" cy="67" r="1.2" fill="white" opacity="0.6" />
						<circle cx="121" cy="67" r="1.2" fill="white" opacity="0.6" />
					</>
				)}

				{/* === NOSE === */}
				<ellipse cx="100" cy="78" rx="8" ry="7" fill="#E53935" stroke="#B71C1C" strokeWidth="1.5" />
				{/* Nose highlight */}
				<ellipse cx="97" cy="75" rx="3" ry="2" fill="#FF8A80" opacity="0.8" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

				{/* Mouth interior */}
				{showMouthInterior && (
					<>
						<ellipse cx="100" cy={138 + mouthOpenAmount * 0.4} rx="12" ry="5" fill="#FF7979" opacity="0.5" />
					</>
				)}

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

				{/* Happy: blush, squinted eyes */}
				{expression === 'happy' && (
					<>
						<ellipse cx="55" cy="74" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="145" cy="74" rx="8" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{/* Angry: angled brows */}
				{expression === 'angry' && (
					<>
						<line x1="62" y1="44" x2="90" y2="50" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
						<line x1="138" y1="44" x2="110" y2="50" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
					</>
				)}

				{/* Shocked: wider eyes, straight brows */}
				{expression === 'shocked' && (
					<>
						{/* Sweat drops */}
						<path d="M148 48 Q152 56 148 62 Q144 56 148 48" fill="#64B5F6" />
						<path d="M52 48 Q56 56 52 62 Q48 56 52 48" fill="#64B5F6" />
					</>
				)}
			</g>
		</svg>
	);
};
