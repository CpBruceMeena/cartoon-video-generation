import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const DogSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.35 * Math.PI * 2)) : 0;
	const tongueOut = expression === 'happy' || (isSpeaking && mouthOpen > 0.4);
	const tailWag = expression === 'happy' ? 'rotate(-35)' : isSpeaking ? 'rotate(-15)' : 'rotate(5)';
	const earRotate = expression === 'happy' ? 'rotate(-10, 22, 28)' : 'rotate(-25, 22, 28)';

	const blinkCycle = speakingFrame % 95;
	const isBlinking = blinkCycle > 90 && blinkCycle < 94;

	const getMouthPath = () => {
		if (isSpeaking) {
			const open = 3 + mouthOpen * 7;
			return `M43 50 Q50 ${56 + open} 57 50`;
		}
		return 'M43 50 Q50 56 57 50';
	};

	return (
		<svg width="200" height="200" viewBox="0 0 120 120">
			<defs>
				<radialGradient id="dog-body" cx="50%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#BCAAA4" />
					<stop offset="60%" stopColor="#A1887F" />
					<stop offset="100%" stopColor="#8D6E63" />
				</radialGradient>
				<linearGradient id="dog-belly" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#EFEBE9" />
					<stop offset="100%" stopColor="#D7CCC8" />
				</linearGradient>
				<radialGradient id="dog-ear" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#FFE0B2" />
					<stop offset="100%" stopColor="#FFCC80" />
				</radialGradient>
				<filter id="dog-shadow">
					<feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#dog-shadow)">
				{/* === TAIL === */}
				<path d="M78 58 Q98 28 94 16 Q91 10 86 16 Q80 30 74 52" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
					transform={tailWag} />

				{/* === BODY === */}
				<ellipse cx="55" cy="74" rx="32" ry="24" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="2" />
				{/* Belly */}
				<ellipse cx="55" cy="78" rx="22" ry="15" fill="url(#dog-belly)" />

				{/* === BACK LEGS === */}
				<rect x="72" y="86" width="12" height="18" rx="5" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="1.5" />
				<rect x="28" y="86" width="12" height="18" rx="5" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="1.5" />
				<ellipse cx="78" cy="104" rx="9" ry="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
				<ellipse cx="34" cy="104" rx="9" ry="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />

				{/* === FRONT LEGS === */}
				<rect x="40" y="88" width="10" height="18" rx="4" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="1.5" />
				<rect x="52" y="88" width="10" height="18" rx="4" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="1.5" />
				<ellipse cx="45" cy="106" rx="8" ry="3.5" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
				<ellipse cx="57" cy="106" rx="8" ry="3.5" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />

				{/* === HEAD === */}
				<ellipse cx="50" cy="38" rx="30" ry="28" fill="url(#dog-body)" stroke="#5D4037" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="20" cy="26" rx="12" ry="18" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
					transform={earRotate} />
				<ellipse cx="80" cy="26" rx="12" ry="18" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
					transform="rotate(25, 80, 26)" />
				<ellipse cx="20" cy="30" rx="7" ry="12" fill="url(#dog-ear)" />
				<ellipse cx="80" cy="30" rx="7" ry="12" fill="url(#dog-ear)" />

				{/* === SNOUT === */}
				<ellipse cx="50" cy="48" rx="16" ry="12" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1.5" />

				{/* === NOSE === */}
				<ellipse cx="50" cy="44" rx="6" ry="4" fill="#333" />
				<ellipse cx="49" cy="43" rx="2" ry="1" fill="#666" />

				{/* === EYES === */}
				<ellipse cx="37" cy="34" rx={5.5} ry={isBlinking ? 1 : 6} fill="#1A1A1A" />
				<ellipse cx="63" cy="34" rx={5.5} ry={isBlinking ? 1 : 6} fill="#1A1A1A" />
				{!isBlinking && (
					<>
						<circle cx="39" cy="32" r="2.5" fill="white" />
						<circle cx="65" cy="32" r="2.5" fill="white" />
						<circle cx="36" cy="36" r="1" fill="white" opacity="0.5" />
					</>
				)}

				{/* === EYEBROWS === */}
				<path d="M28 24 Q38 20 44 24" fill="none" stroke="#4E342E" strokeWidth="2" strokeLinecap="round" />
				<path d="M56 24 Q62 20 72 24" fill="none" stroke="#4E342E" strokeWidth="2" strokeLinecap="round" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

				{/* === TONGUE === */}
				{tongueOut && (
					<path d="M48 50 Q48 62 52 62 Q56 62 52 50" fill="#FF5252" stroke="none" />
				)}

				{/* === SPOT ON HEAD === */}
				<ellipse cx="56" cy="16" rx="10" ry="7" fill="#8D6E63" opacity="0.5" />

				{/* === CHEEK BLUSH === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="28" cy="42" rx="6" ry="4" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="72" cy="42" rx="6" ry="4" fill="#FF8A80" opacity="0.35" />
					</>
				)}

				{/* Angry: mouth snarl */}
				{expression === 'angry' && (
					<path d="M38 48 Q44 44 50 48" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
				)}
			</g>
		</svg>
	);
};
