import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const MisaeSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const angryEyeOffset = expression === 'angry' ? -4 : 0;
	const mouthPath = expression === 'angry'
		? 'M80 120 Q100 105 120 120'
		: expression === 'happy'
			? 'M75 120 Q100 145 125 120'
			: expression === 'shocked'
				? 'M85 115 Q100 135 115 115'
				: 'M80 120 Q100 135 120 120';

	return (
		<svg width="260" height="340" viewBox="0 0 200 260">
			{/* Body - Pink Shirt */}
			<rect x="60" y="120" width="80" height="65" rx="6" fill="#F48FB1" stroke="#EC407A" strokeWidth="2" />
			{/* Collar */}
			<path d="M80 120 L100 135 L120 120" fill="#F48FB1" stroke="#EC407A" strokeWidth="1.5" />

			{/* Skirt - Green */}
			<path d="M60 185 L140 185 L145 220 L55 220 Z" fill="#66BB6A" stroke="#43A047" strokeWidth="2" />

			{/* Legs */}
			<rect x="68" y="220" width="15" height="25" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="117" y="220" width="15" height="25" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Shoes - brown */}
			<ellipse cx="75" cy="248" rx="12" ry="5" fill="#8D6E63" stroke="#6D4C41" strokeWidth="1.5" />
			<ellipse cx="125" cy="248" rx="12" ry="5" fill="#8D6E63" stroke="#6D4C41" strokeWidth="1.5" />

			{/* Arms */}
			<rect x="38" y="130" width="22" height="12" rx="6" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="140" y="130" width="22" height="12" rx="6" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="38" cy="136" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="162" cy="136" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="70" rx="44" ry="50" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - Brown, shoulder-length */}
			<path d="M56 60 Q58 28 75 25 Q80 15 100 18 Q120 15 125 25 Q142 28 144 60" fill="#6D4C41" />
			<path d="M56 60 Q50 75 48 95 Q48 110 55 115" fill="#6D4C41" stroke="#5D4037" strokeWidth="1" />
			<path d="M144 60 Q150 75 152 95 Q152 110 145 115" fill="#6D4C41" stroke="#5D4037" strokeWidth="1" />
			{/* Hair tie/accessory */}
			<circle cx="58" cy="100" r="4" fill="#FF4081" />
			<circle cx="142" cy="100" r="4" fill="#FF4081" />

			{/* Eyebrows */}
			<path d="M65 58 Q80 52 92 58" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />
			<path d="M108 58 Q120 52 135 58" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />
			{/* Angry eyebrows - angled down */}
			{expression === 'angry' && (
				<>
					<path d="M62 52 Q80 56 92 58" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
					<path d="M138 52 Q120 56 108 58" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
				</>
			)}

			{/* Eyes */}
			<ellipse cx="80" cy={`${76 + angryEyeOffset}`} rx="8" ry="6" fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="120" cy={`${76 + angryEyeOffset}`} rx="8" ry="6" fill="white" stroke="#333" strokeWidth="1.5" />
			<circle cx="81" cy={`${77 + angryEyeOffset}`} r="3.5" fill="#1A1A1A" />
			<circle cx="121" cy={`${77 + angryEyeOffset}`} r="3.5" fill="#1A1A1A" />
			{/* Eye shine */}
			<circle cx="83" cy={`${75 + angryEyeOffset}`} r="1.5" fill="white" />
			<circle cx="123" cy={`${75 + angryEyeOffset}`} r="1.5" fill="white" />

			{/* Nose */}
			<ellipse cx="100" cy="90" rx="3" ry="2" fill="#E8945E" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Ears */}
			<ellipse cx="56" cy="72" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="144" cy="72" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
		</svg>
	);
};
