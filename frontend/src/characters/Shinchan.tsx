import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const ShinchanSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	// Expression-based adjustments
	const eyeOffset = expression === 'happy' ? -2 : expression === 'angry' ? 2 : 0;
	const eyeWidth = expression === 'shocked' ? 16 : expression === 'happy' ? 10 : 12;
	const eyeHeight = expression === 'shocked' ? 16 : expression === 'happy' ? 10 : 12;
	const mouthPath = expression === 'happy'
		? 'M75 130 Q90 155 115 130'
		: expression === 'angry'
			? 'M75 130 Q95 120 115 130'
			: expression === 'shocked'
				? 'M80 125 Q95 145 110 125'
				: 'M75 130 Q95 145 115 130'; // normal smile
	const mouthFill = expression === 'shocked' ? '#333' : 'none';
	const bodyYOffset = expression === 'happy' ? -3 : expression === 'angry' ? 2 : 0;

	return (
		<svg width="280" height="360" viewBox="0 0 200 280">
			{/* Body - Red Shirt */}
			<rect
				x="60"
				y="140"
				width="80"
				height="80"
				rx="8"
				fill="#E53935"
				stroke="#B71C1C"
				strokeWidth="2"
				transform={`translate(0, ${bodyYOffset})`}
			/>
			{/* Shirt collar */}
			<path d="M85 140 L100 155 L115 140" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />

			{/* Shorts - Yellow */}
			<rect
				x="60"
				y="215"
				width="80"
				height="35"
				rx="4"
				fill="#FDD835"
				stroke="#F9A825"
				strokeWidth="2"
				transform={`translate(0, ${bodyYOffset})`}
			/>

			{/* Legs */}
			<rect x="65" y="250" width="18" height="20" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5"
				transform={`translate(0, ${bodyYOffset})`} />
			<rect x="117" y="250" width="18" height="20" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5"
				transform={`translate(0, ${bodyYOffset})`} />

			{/* Socks - White */}
			<rect x="64" y="267" width="20" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="1"
				transform={`translate(0, ${bodyYOffset})`} />
			<rect x="116" y="267" width="20" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="1"
				transform={`translate(0, ${bodyYOffset})`} />

			{/* Shoes */}
			<ellipse cx="74" cy="278" rx="14" ry="6" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5"
				transform={`translate(0, ${bodyYOffset})`} />
			<ellipse cx="126" cy="278" rx="14" ry="6" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5"
				transform={`translate(0, ${bodyYOffset})`} />

			{/* Arms */}
			<rect x="38" y="150" width="22" height="14" rx="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="140" y="150" width="22" height="14" rx="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Hands */}
			<circle cx="38" cy="157" r="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="162" cy="157" r="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="80" rx="48" ry="52" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2.5" />

			{/* Hair - Shinchan's distinctive messy hair */}
			<path d="M55 55 Q60 30 80 28 Q90 22 100 25 Q110 22 120 28 Q140 30 145 55" fill="#1A1A1A" stroke="none" />
			<path d="M55 55 Q52 60 54 65" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
			<path d="M145 55 Q148 60 146 65" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

			{/* Thick Eyebrows - Shinchan's trademark */}
			<rect x="62" y="62" width="28" height="8" rx="4" fill="#1A1A1A" />
			<rect x="110" y="62" width="28" height="8" rx="4" fill="#1A1A1A" />

			{/* Eyes */}
			<ellipse cx="76" cy={`${78 + eyeOffset}`} rx={eyeWidth} ry={eyeHeight} fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="124" cy={`${78 + eyeOffset}`} rx={eyeWidth} ry={eyeHeight} fill="white" stroke="#333" strokeWidth="1.5" />
			<circle cx="78" cy={`${80 + eyeOffset}`} r="4" fill="#1A1A1A" />
			<circle cx="126" cy={`${80 + eyeOffset}`} r="4" fill="#1A1A1A" />

			{/* Eye shine */}
			<circle cx="80" cy={`${77 + eyeOffset}`} r="1.5" fill="white" />
			<circle cx="128" cy={`${77 + eyeOffset}`} r="1.5" fill="white" />

			{/* Nose - tiny dot */}
			<circle cx="100" cy="95" r="3" fill="#E8945E" stroke="#BF8A5E" strokeWidth="1" />

			{/* Mouth */}
			<path d={mouthPath} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Cheeks blush */}
			{expression === 'happy' && (
				<>
					<ellipse cx="58" cy="95" rx="8" ry="5" fill="#FFAB91" opacity="0.4" />
					<ellipse cx="142" cy="95" rx="8" ry="5" fill="#FFAB91" opacity="0.4" />
				</>
			)}

			{/* Ears */}
			<ellipse cx="52" cy="78" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="148" cy="78" rx="6" ry="10" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
		</svg>
	);
};
