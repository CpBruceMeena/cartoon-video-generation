import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const VillainSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const mouthPath = expression === 'angry'
		? 'M70 120 Q95 105 120 120'
		: expression === 'happy'
			? 'M70 115 Q95 135 120 115'
			: expression === 'shocked'
				? 'M85 110 Q95 130 105 110'
				: 'M75 118 Q95 130 115 118';

	return (
		<svg width="300" height="380" viewBox="0 0 200 270">
			{/* Cape */}
			<path d="M55 130 L15 220 Q100 230 185 220 L145 130" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
			<path d="M15 220 Q5 235 25 250 Q65 235 100 230" fill="#111" stroke="none" />
			{/* Cape clasp */}
			<circle cx="100" cy="132" r="6" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />

			{/* Body - Dark suit */}
			<rect x="58" y="105" width="84" height="65" rx="8" fill="#263238" stroke="#1A1A1A" strokeWidth="2" />
			{/* Suit lapels */}
			<path d="M75 105 L100 135 L125 105" fill="#37474F" stroke="#263238" strokeWidth="1" />
			{/* Belt */}
			<rect x="58" y="160" width="84" height="8" rx="3" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
			{/* Belt buckle */}
			<rect x="95" y="158" width="10" height="12" rx="2" fill="#FDD835" />

			{/* Legs */}
			<rect x="62" y="170" width="30" height="55" rx="5" fill="#263238" stroke="#1A1A1A" strokeWidth="2" />
			<rect x="108" y="170" width="30" height="55" rx="5" fill="#263238" stroke="#1A1A1A" strokeWidth="2" />
			{/* Boots */}
			<rect x="60" y="220" width="34" height="16" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
			<rect x="106" y="220" width="34" height="16" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="2" />
			<rect x="60" y="232" width="34" height="5" rx="2" fill="#FDD835" />
			<rect x="106" y="232" width="34" height="5" rx="2" fill="#FDD835" />

			{/* Arms */}
			<rect x="36" y="112" width="22" height="14" rx="7" fill="#263238" stroke="#1A1A1A" strokeWidth="2" />
			<rect x="142" y="112" width="22" height="14" rx="7" fill="#263238" stroke="#1A1A1A" strokeWidth="2" />
			{/* Hands */}
			<circle cx="36" cy="119" r="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="164" cy="119" r="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			{/* Gloves */}
			<rect x="30" y="125" width="12" height="18" rx="5" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
			<rect x="158" y="125" width="12" height="18" rx="5" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="65" rx="40" ry="44" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - slicked back */}
			<path d="M62 45 Q65 18 80 15 Q90 10 100 12 Q110 10 120 15 Q135 18 138 45" fill="#1A1A1A" />
			<path d="M62 45 Q58 52 56 65" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
			<path d="M138 45 Q142 52 144 65" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
			{/* Widow's peak */}
			<path d="M92 12 L100 8 L108 12" fill="#1A1A1A" />

			{/* Eyebrows - angled for villainous look */}
			<path d="M64 52 Q80 46 90 52" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
			<path d="M110 52 Q120 46 136 52" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />

			{/* Eyes - narrowed */}
			<ellipse cx="80" cy="65" rx="7" ry="5" fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="120" cy="65" rx="7" ry="5" fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="81" cy="66" rx="4" ry="3.5" fill="#E53935" />
			<ellipse cx="121" cy="66" rx="4" ry="3.5" fill="#E53935" />
			<circle cx="83" cy="64" r="1.5" fill="white" />
			<circle cx="123" cy="64" r="1.5" fill="white" />

			{/* Nose - sharp */}
			<path d="M100 70 L103 84 L97 84 Z" fill="#E8945E" stroke="#BF8A5E" strokeWidth="1" />

			{/* Scar */}
			<path d="M58 70 Q62 68 66 72" fill="none" stroke="#C62828" strokeWidth="1.5" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Chin shadow */}
			<path d="M85 106 Q100 112 115 106" fill="none" stroke="#BF8A5E" strokeWidth="1" opacity="0.5" />

			{/* Ears */}
			<ellipse cx="60" cy="68" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="140" cy="68" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Aura effect when angry */}
			{expression === 'angry' && (
				<ellipse cx="100" cy="65" rx="48" ry="52" fill="none" stroke="#E53935" strokeWidth="2" opacity="0.3" />
			)}
		</svg>
	);
};
