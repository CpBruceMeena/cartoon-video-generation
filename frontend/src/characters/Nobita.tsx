import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const NobitaSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const mouthPath = expression === 'happy'
		? 'M80 130 Q100 148 120 130'
		: expression === 'angry'
			? 'M80 125 Q100 115 120 125'
			: expression === 'shocked'
				? 'M90 120 Q100 140 110 120'
				: 'M80 128 Q100 140 120 128'; // nervous/normal

	return (
		<svg width="260" height="340" viewBox="0 0 200 260">
			{/* Body - Yellow Shirt */}
			<rect x="65" y="130" width="70" height="70" rx="6" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
			{/* Shirt collar */}
			<path d="M85 130 L100 145 L115 130" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" />

			{/* Shorts - Blue */}
			<rect x="65" y="195" width="70" height="30" rx="4" fill="#3949AB" stroke="#283593" strokeWidth="2" />

			{/* Legs - skinny */}
			<rect x="70" y="225" width="16" height="25" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="114" y="225" width="16" height="25" rx="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Socks */}
			<rect x="69" y="245" width="18" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="1" />
			<rect x="113" y="245" width="18" height="8" rx="2" fill="white" stroke="#ccc" strokeWidth="1" />

			{/* Shoes */}
			<ellipse cx="78" cy="256" rx="13" ry="5" fill="#37474F" stroke="#263238" strokeWidth="1.5" />
			<ellipse cx="122" cy="256" rx="13" ry="5" fill="#37474F" stroke="#263238" strokeWidth="1.5" />

			{/* Arms - thin */}
			<rect x="45" y="140" width="20" height="12" rx="6" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<rect x="135" y="140" width="20" height="12" rx="6" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="45" cy="146" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<circle cx="155" cy="146" r="7" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />

			{/* Head */}
			<ellipse cx="100" cy="80" rx="45" ry="48" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="2" />

			{/* Hair - black messy style */}
			<path d="M58 55 Q65 28 85 30 Q90 22 100 25 Q110 22 115 30 Q135 28 142 55" fill="#1A1A1A" />
			<path d="M58 55 Q56 60 57 65" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
			<path d="M142 55 Q144 60 143 65" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
			{/* Hair tufts */}
			<path d="M80 28 Q85 18 90 22" fill="#1A1A1A" />
			<path d="M110 22 Q115 18 120 28" fill="#1A1A1A" />

			{/* Glasses - Nobita's trademark */}
			<circle cx="78" cy="80" r="18" fill="none" stroke="#546E7A" strokeWidth="2.5" />
			<circle cx="122" cy="80" r="18" fill="none" stroke="#546E7A" strokeWidth="2.5" />
			<line x1="96" y1="78" x2="104" y2="78" stroke="#546E7A" strokeWidth="2.5" />

			{/* Eyes (behind glasses) */}
			<circle cx="78" cy="80" r="5" fill="#1A1A1A" />
			<circle cx="122" cy="80" r="5" fill="#1A1A1A" />
			{/* Eye shine */}
			<circle cx="80" cy="78" r="2" fill="white" />
			<circle cx="124" cy="78" r="2" fill="white" />

			{/* Eyebrows */}
			<path d="M62 60 Q78 55 92 62" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
			<path d="M108 62 Q122 55 138 60" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

			{/* Nose */}
			<ellipse cx="100" cy="95" rx="3" ry="2" fill="#E8945E" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Ears */}
			<ellipse cx="55" cy="80" rx="5" ry="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
			<ellipse cx="145" cy="80" rx="5" ry="8" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1.5" />
		</svg>
	);
};
