import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const DoraemonSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const eyeScale = expression === 'shocked' ? 1.3 : expression === 'happy' ? 0.9 : 1;
	const mouthPath = expression === 'happy'
		? 'M70 130 Q100 165 130 130'
		: expression === 'angry'
			? 'M70 125 Q100 115 130 125'
			: expression === 'shocked'
				? 'M85 120 Q100 140 115 120'
				: 'M70 128 Q100 155 130 128';
	const mouthFill = expression === 'shocked' ? '#333' : 'none';

	return (
		<svg width="280" height="300" viewBox="0 0 200 220">
			{/* Body - round blue */}
			<ellipse cx="100" cy="130" rx="72" ry="65" fill="#1E88E5" stroke="#1565C0" strokeWidth="2.5" />

			{/* White belly */}
			<ellipse cx="100" cy="145" rx="48" ry="40" fill="white" stroke="#ddd" strokeWidth="1.5" />

			{/* Gadget pouch - Doraemon's iconic pocket */}
			<ellipse cx="100" cy="155" rx="30" ry="12" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
			<path d="M75 155 Q100 170 125 155" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />

			{/* Collar with bell */}
			<rect x="55" y="100" width="90" height="14" rx="7" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
			<circle cx="100" cy="114" r="10" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
			{/* Bell clapper */}
			<circle cx="100" cy="118" r="4" fill="#F9A825" />
			{/* Bell slit */}
			<line x1="95" y1="114" x2="105" y2="114" stroke="#F9A825" strokeWidth="1.5" />

			{/* Arms */}
			<ellipse cx="22" cy="130" rx="16" ry="10" fill="#1E88E5" stroke="#1565C0" strokeWidth="2"
				transform="rotate(-20, 22, 130)" />
			<ellipse cx="178" cy="130" rx="16" ry="10" fill="#1E88E5" stroke="#1565C0" strokeWidth="2"
				transform="rotate(20, 178, 130)" />

			{/* Paws (white circles) */}
			<circle cx="22" cy="135" r="9" fill="white" stroke="#ddd" strokeWidth="1" />
			<circle cx="178" cy="135" r="9" fill="white" stroke="#ddd" strokeWidth="1" />

			{/* Feet */}
			<ellipse cx="72" cy="190" rx="22" ry="12" fill="white" stroke="#ddd" strokeWidth="1.5" />
			<ellipse cx="128" cy="190" rx="22" ry="12" fill="white" stroke="#ddd" strokeWidth="1.5" />

			{/* Head */}
			<circle cx="100" cy="75" r="55" fill="#1E88E5" stroke="#1565C0" strokeWidth="2.5" />

			{/* Face area - white oval */}
			<ellipse cx="100" cy="75" rx="44" ry="42" fill="white" stroke="#ddd" strokeWidth="1" />

			{/* Eyes */}
			<ellipse cx="80" cy="65" rx={11 * eyeScale} ry={14 * eyeScale} fill="white" stroke="#333" strokeWidth="1.5" />
			<ellipse cx="120" cy="65" rx={11 * eyeScale} ry={14 * eyeScale} fill="white" stroke="#333" strokeWidth="1.5" />
			<circle cx="83" cy="68" r="5" fill="#1A1A1A" />
			<circle cx="117" cy="68" r="5" fill="#1A1A1A" />
			{/* Eye shine */}
			<circle cx="85" cy="64" r="2" fill="white" />
			<circle cx="119" cy="64" r="2" fill="white" />

			{/* Nose - red */}
			<ellipse cx="100" cy="78" rx="7" ry="6" fill="#E53935" stroke="#B71C1C" strokeWidth="1.5" />
			{/* Nose shine */}
			<circle cx="98" cy="76" r="2" fill="#FF8A80" />

			{/* Mouth */}
			<path d={mouthPath} fill={mouthFill} stroke="#333" strokeWidth="2" strokeLinecap="round" />

			{/* Whiskers */}
			<line x1="52" y1="72" x2="70" y2="75" stroke="#333" strokeWidth="1.2" />
			<line x1="52" y1="78" x2="70" y2="80" stroke="#333" strokeWidth="1.2" />
			<line x1="52" y1="84" x2="70" y2="85" stroke="#333" strokeWidth="1.2" />
			<line x1="148" y1="72" x2="130" y2="75" stroke="#333" strokeWidth="1.2" />
			<line x1="148" y1="78" x2="130" y2="80" stroke="#333" strokeWidth="1.2" />
			<line x1="148" y1="84" x2="130" y2="85" stroke="#333" strokeWidth="1.2" />

			{/* Mouth center line (Doraemon's vertical mouth line) */}
			<line x1="100" y1="84" x2="100" y2="108" stroke="#333" strokeWidth="1.2" />

			{/* Ears (inside head, since Doraemon is a robot cat without visible ears) */}
			<circle cx="58" cy="35" r="14" fill="#1E88E5" stroke="#1565C0" strokeWidth="1.5" />
			<circle cx="142" cy="35" r="14" fill="#1E88E5" stroke="#1565C0" strokeWidth="1.5" />
			<circle cx="58" cy="35" r="9" fill="#90CAF9" />
			<circle cx="142" cy="35" r="9" fill="#90CAF9" />
		</svg>
	);
};
