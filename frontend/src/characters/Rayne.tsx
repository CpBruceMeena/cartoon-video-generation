import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const RayneSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	return (
		<svg width="260" height="360" viewBox="0 0 160 240">
			{/* Cape */}
			<path d="M60 140 L20 195 Q80 200 140 195 L100 140" fill="#7B1FA2" stroke="#4A148C" strokeWidth="2" opacity="0.85" />
			{/* Cape back flow */}
			<path d="M20 195 Q10 205 30 220 Q60 210 80 205" fill="#6A1B9A" stroke="none" opacity="0.6" />

			{/* Body - Blue armor/suit */}
			<rect x="55" y="100" width="50" height="60" rx="8" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			{/* Chest emblem */}
			<path d="M75 110 L85 120 L75 130 L65 120 Z" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />
			{/* Belt */}
			<rect x="55" y="150" width="50" height="8" rx="3" fill="#37474F" stroke="#263238" strokeWidth="1.5" />
			<rect x="75" y="148" width="10" height="12" rx="2" fill="#FDD835" stroke="#F9A825" strokeWidth="1" />

			{/* Legs */}
			<rect x="58" y="160" width="16" height="45" rx="5" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			<rect x="86" y="160" width="16" height="45" rx="5" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			{/* Boots */}
			<rect x="56" y="200" width="20" height="16" rx="6" fill="#37474F" stroke="#263238" strokeWidth="2" />
			<rect x="84" y="200" width="20" height="16" rx="6" fill="#37474F" stroke="#263238" strokeWidth="2" />
			{/* Boot soles */}
			<rect x="56" y="212" width="20" height="4" rx="2" fill="#263238" />
			<rect x="84" y="212" width="20" height="4" rx="2" fill="#263238" />

			{/* Arms */}
			<rect x="32" y="108" width="20" height="12" rx="6" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			<rect x="108" y="108" width="20" height="12" rx="6" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			{/* Gloves */}
			<rect x="30" y="118" width="12" height="16" rx="5" fill="white" stroke="#ddd" strokeWidth="1.5" />
			<rect x="118" y="118" width="12" height="16" rx="5" fill="white" stroke="#ddd" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="80" cy="62" rx="34" ry="36" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - long flowing */}
			<path d="M48 45 Q46 20 55 15 Q65 10 80 12 Q95 10 105 15 Q114 20 112 45" fill="#1A1A1A" />
			<path d="M48 45 Q42 55 38 75 Q36 90 40 110" fill="#1A1A1A" stroke="none" />
			<path d="M112 45 Q118 55 122 75 Q124 90 120 110" fill="#1A1A1A" stroke="none" />
			{/* Hair highlights */}
			<path d="M52 40 Q55 25 60 18" fill="none" stroke="#333" strokeWidth="1" />
			<path d="M108 40 Q105 25 100 18" fill="none" stroke="#333" strokeWidth="1" />

			{/* Headband/crown */}
			<path d="M48 45 Q60 38 80 36 Q100 38 112 45" fill="none" stroke="#FDD835" strokeWidth="3" />
			<circle cx="80" cy="35" r="4" fill="#FDD835" stroke="#F9A825" strokeWidth="1" />
			{/* Gem on crown */}
			<circle cx="80" cy="35" r="2.5" fill="#E53935" />

			{/* Eyebrows */}
			<path d="M58 52 Q68 48 76 52" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
			<path d="M84 52 Q92 48 102 52" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

			{/* Eyes */}
			<ellipse cx="68" cy="62" rx="6" ry="7" fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="92" cy="62" rx="6" ry="7" fill="white" stroke="#333" strokeWidth="1.5" />
			<circle cx="70" cy="63" r="4" fill="#4A148C" />
			<circle cx="94" cy="63" r="4" fill="#4A148C" />
			<circle cx="72" cy="60" r="1.5" fill="white" />
			<circle cx="96" cy="60" r="1.5" fill="white" />

			{/* Nose */}
			<ellipse cx="80" cy="75" rx="3" ry="2" fill="#E8945E" />

			{/* Mouth */}
			{expression === 'happy' ? (
				<path d="M70 80 Q80 92 90 80" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
			) : expression === 'angry' ? (
				<path d="M70 78 Q80 72 90 78" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
			) : expression === 'shocked' ? (
				<ellipse cx="80" cy="82" rx="5" ry="6" fill="#333" />
			) : (
				<path d="M72 80 Q80 88 88 80" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
			)}

			{/* Ears */}
			<ellipse cx="46" cy="58" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="114" cy="58" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Power glow effect when angry */}
			{expression === 'angry' && (
				<ellipse cx="80" cy="62" rx="40" ry="42" fill="none" stroke="#7B1FA2" strokeWidth="2" opacity="0.4" />
			)}
		</svg>
	);
};
