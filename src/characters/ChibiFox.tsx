import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const ChibiFoxSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const tailWag = expression === 'happy' ? 'rotate(-10)' : 'rotate(0)';
	const mouthPath = expression === 'happy'
		? 'M48 58 Q56 66 64 58'
		: expression === 'angry'
			? 'M48 56 Q56 50 64 56'
			: expression === 'shocked'
				? 'M52 54 Q56 62 60 54'
				: 'M48 56 Q56 62 64 56';

	return (
		<svg width="200" height="240" viewBox="0 0 120 140">
			{/* Tail */}
			<path d="M75 85 Q100 60 105 50 Q108 45 100 50 Q90 60 78 80" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5"
				transform={tailWag} />
			<path d="M100 50 Q108 45 105 52" fill="white" stroke="none" />

			{/* Body */}
			<ellipse cx="60" cy="90" rx="28" ry="22" fill="#FF8A65" stroke="#E64A19" strokeWidth="2" />
			{/* Belly */}
			<ellipse cx="60" cy="93" rx="18" ry="14" fill="#FFF3E0" stroke="none" />

			{/* Legs */}
			<rect x="42" y="105" width="10" height="18" rx="4" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />
			<rect x="68" y="105" width="10" height="18" rx="4" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />
			<ellipse cx="47" cy="123" rx="7" ry="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1" />
			<ellipse cx="73" cy="123" rx="7" ry="3" fill="#FFCC80" stroke="#BF8A5E" strokeWidth="1" />

			{/* Arms */}
			<ellipse cx="30" cy="88" rx="10" ry="6" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />
			<ellipse cx="90" cy="88" rx="10" ry="6" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />

			{/* Head */}
			<circle cx="60" cy="50" r="30" fill="#FF8A65" stroke="#E64A19" strokeWidth="2" />

			{/* Ears - large triangular */}
			<path d="M35 38 L28 12 L48 32" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />
			<path d="M85 38 L92 12 L72 32" fill="#FF8A65" stroke="#E64A19" strokeWidth="1.5" />
			{/* Inner ear */}
			<path d="M37 36 L32 18 L46 33" fill="#FFCC80" stroke="none" />
			<path d="M83 36 L88 18 L74 33" fill="#FFCC80" stroke="none" />

			{/* Cheek fur tufts */}
			<path d="M32 48 L24 50 L32 54" fill="#FF8A65" stroke="#E64A19" strokeWidth="1" />
			<path d="M88 48 L96 50 L88 54" fill="#FF8A65" stroke="#E64A19" strokeWidth="1" />

			{/* White face mask */}
			<ellipse cx="60" cy="54" rx="18" ry="16" fill="white" stroke="#ddd" strokeWidth="1" />

			{/* Eyes */}
			<ellipse cx="50" cy="50" rx="5" ry="6" fill="#1A1A1A" />
			<ellipse cx="70" cy="50" rx="5" ry="6" fill="#1A1A1A" />
			<circle cx="52" cy="48" r="2" fill="white" />
			<circle cx="72" cy="48" r="2" fill="white" />

			{/* Eyebrows */}
			<path d="M42 42 Q50 38 56 42" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M64 42 Q70 38 78 42" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round" />

			{/* Nose */}
			<ellipse cx="60" cy="58" rx="3" ry="2" fill="#333" />

			{/* Mouth */}
			<path d={mouthPath} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

			{/* Cheek blush */}
			{expression === 'happy' && (
				<>
					<ellipse cx="38" cy="54" rx="5" ry="3" fill="#FFAB91" opacity="0.5" />
					<ellipse cx="82" cy="54" rx="5" ry="3" fill="#FFAB91" opacity="0.5" />
				</>
			)}
		</svg>
	);
};
