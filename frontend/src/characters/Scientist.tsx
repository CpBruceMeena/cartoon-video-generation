import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const ScientistSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const mouthPath = expression === 'happy'
		? 'M75 128 Q95 148 115 128'
		: expression === 'angry'
			? 'M75 122 Q95 112 115 122'
			: expression === 'shocked'
				? 'M85 118 Q95 138 105 118'
				: 'M78 126 Q95 140 112 126';

	return (
		<svg width="270" height="370" viewBox="0 0 200 280">
			{/* Lab coat */}
			<rect x="55" y="110" width="90" height="75" rx="6" fill="white" stroke="#ddd" strokeWidth="2" />
			{/* Coat lapels */}
			<path d="M70 110 L95 140 L120 110" fill="#F5F5F5" stroke="#ddd" strokeWidth="1" />
			{/* Coat buttons */}
			<circle cx="100" cy="150" r="3" fill="#ddd" />
			<circle cx="100" cy="165" r="3" fill="#ddd" />
			{/* Pocket */}
			<rect x="125" y="155" width="14" height="12" rx="2" fill="none" stroke="#ddd" strokeWidth="1.5" />
			{/* Pen in pocket */}
			<rect x="129" y="148" width="2" height="10" rx="1" fill="#1565C0" />
			<rect x="132" y="150" width="2" height="8" rx="1" fill="#E53935" />

			{/* Shirt under */}
			<rect x="62" y="115" width="12" height="8" rx="2" fill="#E3F2FD" />
			<rect x="126" y="115" width="12" height="8" rx="2" fill="#E3F2FD" />

			{/* Tie */}
			<rect x="95" y="120" width="10" height="30" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

			{/* Pants */}
			<rect x="58" y="185" width="35" height="50" rx="4" fill="#455A64" stroke="#37474F" strokeWidth="2" />
			<rect x="107" y="185" width="35" height="50" rx="4" fill="#455A64" stroke="#37474F" strokeWidth="2" />

			{/* Shoes */}
			<ellipse cx="75" cy="238" rx="14" ry="6" fill="#37474F" stroke="#263238" strokeWidth="2" />
			<ellipse cx="125" cy="238" rx="14" ry="6" fill="#37474F" stroke="#263238" strokeWidth="2" />

			{/* Arms */}
			<rect x="33" y="118" width="22" height="14" rx="7" fill="white" stroke="#ddd" strokeWidth="1.5" />
			<rect x="145" y="118" width="22" height="14" rx="7" fill="white" stroke="#ddd" strokeWidth="1.5" />
			{/* Hands */}
			<circle cx="33" cy="125" r="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="167" cy="125" r="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="70" rx="44" ry="50" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - messy grey/white */}
			<path d="M56 55 Q58 22 75 20 Q85 14 100 16 Q115 14 125 20 Q142 22 144 55" fill="#BDBDBD" stroke="none" />
			<path d="M56 55 Q50 65 48 80" fill="#BDBDBD" stroke="none" />
			<path d="M144 55 Q150 65 152 80" fill="#BDBDBD" stroke="none" />
			{/* Hair tufts (mad scientist) */}
			<path d="M70 20 Q65 8 75 10" fill="#BDBDBD" />
			<path d="M130 20 Q135 8 125 10" fill="#BDBDBD" />

			{/* Glasses - round */}
			<circle cx="78" cy="70" r="16" fill="none" stroke="#546E7A" strokeWidth="2.5" />
			<circle cx="122" cy="70" r="16" fill="none" stroke="#546E7A" strokeWidth="2.5" />
			<line x1="94" y1="68" x2="106" y2="68" stroke="#546E7A" strokeWidth="2" />
			{/* Glass shine */}
			<path d="M68 64 Q72 60 76 62" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
			<path d="M112 64 Q116 60 120 62" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />

			{/* Eyes (behind glasses) */}
			<ellipse cx="78" cy="70" rx="4" ry="5" fill="#1A1A1A" />
			<ellipse cx="122" cy="70" rx="4" ry="5" fill="#1A1A1A" />
			<circle cx="80" cy="68" r="1.5" fill="white" />
			<circle cx="124" cy="68" r="1.5" fill="white" />

			{/* Eyebrows - bushy */}
			<path d="M60 50 Q78 44 94 50" fill="none" stroke="#757575" strokeWidth="3" strokeLinecap="round" />
			<path d="M106 50 Q122 44 140 50" fill="none" stroke="#757575" strokeWidth="3" strokeLinecap="round" />
			{/* Angry eyebrows */}
			{expression === 'angry' && (
				<>
					<path d="M60 46 Q78 40 94 50" fill="none" stroke="#757575" strokeWidth="3.5" strokeLinecap="round" />
					<path d="M106 50 Q122 40 140 46" fill="none" stroke="#757575" strokeWidth="3.5" strokeLinecap="round" />
				</>
			)}

			{/* Nose */}
			<ellipse cx="100" cy="88" rx="4" ry="3" fill="#E8945E" />

			{/* Mustache */}
			<path d="M80 95 Q90 92 100 95 Q110 92 120 95" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Ears */}
			<ellipse cx="56" cy="72" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="144" cy="72" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
		</svg>
	);
};
