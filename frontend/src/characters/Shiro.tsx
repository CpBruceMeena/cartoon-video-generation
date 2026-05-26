import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export const ShiroSVG: React.FC<Props> = ({ expression = 'normal', isSpeaking = false, speakingFrame = 0 }) => {
	const mouthOpen = isSpeaking ? Math.abs(Math.sin(speakingFrame * 0.35 * Math.PI * 2)) : 0;
	const tongueOut = expression === 'happy' || (isSpeaking && mouthOpen > 0.5);
	const earAngle = expression === 'happy' ? -15 : expression === 'angry' ? 15 : 0;

	const blinkCycle = speakingFrame % 90;
	const isBlinking = blinkCycle > 84 && blinkCycle < 88;

	const getMouthPath = () => {
		if (isSpeaking) {
			const open = 3 + mouthOpen * 6;
			return `M54 54 Q60 ${58 + open} 66 54`;
		}
		return 'M54 54 Q60 58 66 54';
	};

	return (
		<svg width="160" height="160" viewBox="0 0 120 120">
			<defs>
				<radialGradient id="shiro-fur" cx="50%" cy="40%" r="65%">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="80%" stopColor="#FAFAFA" />
					<stop offset="100%" stopColor="#E0E0E0" />
				</radialGradient>
				<radialGradient id="shiro-ear" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#FFE0B2" />
					<stop offset="100%" stopColor="#FFCC80" />
				</radialGradient>
				<filter id="shiro-shadow">
					<feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
				</filter>
			</defs>

			<g filter="url(#shiro-shadow)">
				{/* === TAIL === */}
				<path d="M82 70 Q108 50 104 38 Q102 32 96 36 Q88 44 78 64" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1.5"
					transform={expression === 'happy' ? 'rotate(-25, 90, 55)' : 'rotate(0, 90, 55)'} />

				{/* === BODY === */}
				<ellipse cx="60" cy="84" rx="34" ry="26" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="2" />
				{/* Fluffy fur tufts */}
				<circle cx="36" cy="80" r="14" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="84" cy="80" r="14" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1" />
				<circle cx="60" cy="96" r="12" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1" />

				{/* === LEGS === */}
				<rect x="42" y="102" width="12" height="16" rx="5" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1.5" />
				<rect x="66" y="102" width="12" height="16" rx="5" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1.5" />
				{/* Paws */}
				<ellipse cx="48" cy="118" rx="8" ry="4" fill="#FFE0B2" stroke="#DBA56E" strokeWidth="1" />
				<ellipse cx="72" cy="118" rx="8" ry="4" fill="#FFE0B2" stroke="#DBA56E" strokeWidth="1" />

				{/* === HEAD === */}
				<circle cx="60" cy="42" r="30" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="2" />

				{/* === EARS === */}
				<ellipse cx="30" cy="30" rx="12" ry="18" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1.5"
					transform={`rotate(${earAngle - 20}, 30, 30)`} />
				<ellipse cx="90" cy="30" rx="12" ry="18" fill="url(#shiro-fur)" stroke="#E0E0E0" strokeWidth="1.5"
					transform={`rotate(${-earAngle + 20}, 90, 30)`} />
				<ellipse cx="30" cy="34" rx="7" ry="12" fill="url(#shiro-ear)" />
				<ellipse cx="90" cy="34" rx="7" ry="12" fill="url(#shiro-ear)" />

				{/* === EYES === */}
				<ellipse cx="50" cy="42" rx={5} ry={isBlinking ? 1 : 5.5} fill="#1A1A1A" />
				<ellipse cx="70" cy="42" rx={5} ry={isBlinking ? 1 : 5.5} fill="#1A1A1A" />
				{!isBlinking && (
					<>
						<circle cx="52" cy="40" r="2.5" fill="white" />
						<circle cx="72" cy="40" r="2.5" fill="white" />
						<circle cx="49" cy="44" r="1" fill="white" opacity="0.5" />
					</>
				)}

				{/* === EYEBROWS === */}
				<path d="M40 32 Q50 28 56 32" fill="none" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
				<path d="M64 32 Q70 28 80 32" fill="none" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />

				{/* === NOSE === */}
				<ellipse cx="60" cy="52" rx="6" ry="4" fill="#333" />
				<ellipse cx="59" cy="51" rx="2" ry="1" fill="#666" />

				{/* === MOUTH === */}
				<path d={getMouthPath()} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

				{/* === TONGUE === */}
				{tongueOut && (
					<path d="M58 52 Q58 66 62 66 Q65 66 62 52" fill="#FF5252" stroke="none" />
				)}

				{/* === WHISKER DOTS === */}
				<circle cx="42" cy="51" r="1.2" fill="#BDBDBD" />
				<circle cx="44" cy="54" r="1.2" fill="#BDBDBD" />
				<circle cx="76" cy="51" r="1.2" fill="#BDBDBD" />
				<circle cx="78" cy="54" r="1.2" fill="#BDBDBD" />

				{/* === CHEEK BLUSH === */}
				{expression === 'happy' && (
					<>
						<ellipse cx="36" cy="48" rx="7" ry="5" fill="#FF8A80" opacity="0.35" />
						<ellipse cx="84" cy="48" rx="7" ry="5" fill="#FF8A80" opacity="0.35" />
					</>
				)}
			</g>
		</svg>
	);
};
