import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const SchoolgirlSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const mouthPath = expression === 'happy'
		? 'M80 130 Q100 150 120 130'
		: expression === 'angry'
			? 'M80 125 Q100 115 120 125'
			: expression === 'shocked'
				? 'M90 120 Q100 140 110 120'
				: 'M82 128 Q100 142 118 128';

	return (
		<svg width="260" height="360" viewBox="0 0 200 280">
			{/* Body - Sailor shirt */}
			<rect x="60" y="120" width="80" height="65" rx="6" fill="white" stroke="#ddd" strokeWidth="2" />
			{/* Sailor collar */}
			<path d="M60 120 L100 150 L140 120" fill="#1565C0" stroke="#0D47A1" strokeWidth="1.5" />
			<path d="M65 120 L100 148 L135 120" fill="white" stroke="none" />
			{/* Tie/ribbon */}
			<path d="M97 145 L100 165 L103 145" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
			<circle cx="100" cy="145" r="4" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

			{/* Skirt */}
			<path d="M60 185 L140 185 L145 225 L55 225 Z" fill="#1565C0" stroke="#0D47A1" strokeWidth="2" />
			{/* Skirt pleats */}
			<line x1="80" y1="185" x2="78" y2="225" stroke="#0D47A1" strokeWidth="1" />
			<line x1="100" y1="185" x2="100" y2="225" stroke="#0D47A1" strokeWidth="1" />
			<line x1="120" y1="185" x2="122" y2="225" stroke="#0D47A1" strokeWidth="1" />

			{/* Legs */}
			<rect x="68" y="225" width="15" height="28" rx="4" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="117" y="225" width="15" height="28" rx="4" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Socks */}
			<rect x="66" y="248" width="19" height="10" rx="3" fill="white" stroke="#ddd" strokeWidth="1" />
			<rect x="115" y="248" width="19" height="10" rx="3" fill="white" stroke="#ddd" strokeWidth="1" />

			{/* Shoes */}
			<ellipse cx="75" cy="258" rx="12" ry="5" fill="#37474F" stroke="#263238" strokeWidth="1.5" />
			<ellipse cx="125" cy="258" rx="12" ry="5" fill="#37474F" stroke="#263238" strokeWidth="1.5" />

			{/* Arms */}
			<rect x="38" y="130" width="22" height="12" rx="6" fill="white" stroke="#ddd" strokeWidth="1.5" />
			<rect x="140" y="130" width="22" height="12" rx="6" fill="white" stroke="#ddd" strokeWidth="1.5" />
			<circle cx="38" cy="136" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="162" cy="136" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="75" rx="42" ry="48" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - long black */}
			<path d="M58 55 Q60 25 80 22 Q90 18 100 20 Q110 18 120 22 Q140 25 142 55" fill="#1A1A1A" />
			<path d="M58 55 Q52 70 48 90 Q46 105 50 120" fill="#1A1A1A" stroke="none" />
			<path d="M142 55 Q148 70 152 90 Q154 105 150 120" fill="#1A1A1A" stroke="none" />
			{/* Hair highlights */}
			<path d="M55 60 Q53 80 50 100" fill="none" stroke="#333" strokeWidth="1.5" />
			<path d="M145 60 Q147 80 150 100" fill="none" stroke="#333" strokeWidth="1.5" />

			{/* Ribbon */}
			<path d="M70 20 Q80 15 90 20 Q85 28 75 28 Q68 28 70 20" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
			<path d="M130 20 Q120 15 110 20 Q115 28 125 28 Q132 28 130 20" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />

			{/* Eyebrows */}
			<path d="M70 60 Q82 56 92 60" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
			<path d="M108 60 Q118 56 130 60" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

			{/* Eyes */}
			<ellipse cx="82" cy="75" rx="8" ry="7" fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="118" cy="75" rx="8" ry="7" fill="white" stroke="#333" strokeWidth="1.5" />
			<circle cx="84" cy="76" r="4" fill="#1A1A1A" />
			<circle cx="120" cy="76" r="4" fill="#1A1A1A" />
			<circle cx="86" cy="73" r="2" fill="white" />
			<circle cx="122" cy="73" r="2" fill="white" />

			{/* Nose */}
			<ellipse cx="100" cy="88" rx="3" ry="2" fill="#E8945E" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Ears */}
			<ellipse cx="58" cy="75" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="142" cy="75" rx="5" ry="9" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Cheek blush */}
			{expression === 'happy' && (
				<>
					<ellipse cx="65" cy="85" rx="7" ry="4" fill="#FFAB91" opacity="0.4" />
					<ellipse cx="135" cy="85" rx="7" ry="4" fill="#FFAB91" opacity="0.4" />
				</>
			)}
		</svg>
	);
};
