import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const ChibiFoxSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.3 * Math.PI * 2)) : 0;
	const tailWag = expression === 'happy' ? 'rotate(-25)' : isSpeaking ? 'rotate(-12)' : 'rotate(0)';

	const blinkCycle = speakingFrame % 85;
	const isBlinking = blinkCycle > 80 && blinkCycle < 84;

	const getMouthPath = () => {
		if (isSpeaking) {
			const open = 2 + mouthOpen * 6;
			return `M47 56 Q56 ${62 + open} 65 56`;
		}
		switch (expression) {
			case 'happy': return 'M47 56 Q56 66 65 56';
			case 'angry': return 'M47 54 Q56 48 65 54';
			case 'shocked': return 'M51 52 Q56 62 61 52';
			default: return 'M47 54 Q56 62 65 54';
		}
	};

	const mouthFill = (isSpeaking && mouthOpen > 0.3) ? '#1A1A1A' : 'none';

	return (
		<svg width="200" height="240" viewBox="0 0 120 140">
			<defs>
				<radialGradient id="fox-body" cx="50%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#FF8A65" />
					<stop offset="70%" stopColor="#F4511E" />
					<stop offset="100%" stopColor="#D84315" />
				</radialGradient>
				<linearGradient id="fox-belly" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#FFF3E0" />
					<stop offset="100%" stopColor="#FFE0B2" />
				</linearGradient>
				<linearGradient id="fox-tail" x1="0" y1="0" x2="1" y2="0">
					<stop offset="40%" stopColor="#FF8A65" />
					<stop offset="100%" stopColor="#FFFFFF" />
				</linearGradient>
				<filter id="fox-shadow">
					<feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
				</filter>
			</defs>

			<g filter="url(#fox-shadow)">
				{/* === TAIL === */}
				<path d="M74 86 Q104 56 108 44 Q110 38 102 44 Q92 56 80 78" fill="url(#fox-tail)" stroke="#D84315" strokeWidth="1.5"
					transform={tailWag} />
				<path d="M102 44 Q110 38 106 48" fill="white" />

				{/* === BODY === */}
				<ellipse cx="60" cy="92" rx="30" ry="24" fill="url(#fox-body)" stroke="#D84315" strokeWidth="2" />
				<ellipse cx="60" cy="96" rx="20" ry="16" fill="url(#fox-belly)" />

				{/* === LEGS === */}
				<rect x="42" y="108" width="10" height="18" rx="4" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />
				<rect x="68" y="108" width="10" height="18" rx="4" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />
				<ellipse cx="47" cy="126" rx="8" ry="3.5" fill="#FFCC80" stroke="#DBA56E" strokeWidth="1" />
				<ellipse cx="73" cy="126" rx="8" ry="3.5" fill="#FFCC80" stroke="#DBA56E" strokeWidth="1" />

				{/* === ARMS/PAWS === */}
				<ellipse cx="28" cy="90" rx="12" ry="7" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />
				<ellipse cx="92" cy="90" rx="12" ry="7" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />

				{/* === HEAD === */}
				<circle cx="60" cy="52" r="32" fill="url(#fox-body)" stroke="#D84315" strokeWidth="2" />

				{/* === EARS - large triangular === */}
				<path d="M33 36 L24 8 L50 30" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />
				<path d="M87 36 L96 8 L70 30" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1.5" />
				<path d="M35 34 L28 14 L48 31" fill="#FFCC80" />
				<path d="M85 34 L92 14 L72 31" fill="#FFCC80" />

				{/* === CHEEK FUR === */}
				<path d="M30 48 L20 50 L30 54" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1" />
				<path d="M90 48 L100 50 L90 54" fill="url(#fox-body)" stroke="#D84315" strokeWidth="1" />

				{/* === WHITE FACE MASK === */}
				<ellipse cx="60" cy="56" rx="20" ry="18" fill="white" stroke="#E0E0E0" strokeWidth="1" />

				{/* === EYES === */}
				<ellipse cx="50" cy="52" rx={5.5} ry={isBlinking ? 1 : 6} fill="#1A1A1A" />
				<ellipse cx="70" cy="52" rx={5.5} ry={isBlinking ? 1 : 6} fill="#1A1A1A" />
				{!isBlinking && (
					<>
						<circle cx="52" cy="50" r="2.5" fill="white" />
						<circle cx="72" cy="50" r="2.5" fill="white" />
						<circle cx="49" cy="54" r="1" fill="white" opacity="0.5" />
					</>
				)}

				{/* === EYEBROWS === */}
				<path d="M40 42 Q50 38 56 42" fill="none" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" />
				<path d="M64 42 Q70 38 80 42" fill="none" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" />

				{/* === NOSE === */}
				<ellipse cx="60" cy="60" rx="4" ry="3" fill="#333" />
				<ellipse cx="59" cy="59" rx="1.5" ry="0.8" fill="#666" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill={mouthFill} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

				{/* === CHEEK BLUSH === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="36" cy="56" rx="6" ry="4" fill="#FF8A80" opacity="0.4" />
						<ellipse cx="84" cy="56" rx="6" ry="4" fill="#FF8A80" opacity="0.4" />
					</>
				)}
			</g>
		</svg>
	);
};
