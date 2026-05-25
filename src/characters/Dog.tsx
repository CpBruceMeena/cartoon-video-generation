import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const DogSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const tailWag = expression === 'happy' ? 'rotate(-20)' : 'rotate(0)';
	const tongueOut = expression === 'happy';

	return (
		<svg width="200" height="200" viewBox="0 0 120 120">
			{/* Tail */}
			<path d="M80 60 Q100 30 95 20 Q92 15 88 22 Q82 35 76 55" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
				transform={tailWag} />

			{/* Body */}
			<ellipse cx="55" cy="72" rx="30" ry="22" fill="#A1887F" stroke="#5D4037" strokeWidth="2" />
			{/* Belly */}
			<ellipse cx="55" cy="76" rx="20" ry="14" fill="#EFEBE9" stroke="none" />

			{/* Back legs */}
			<rect x="72" y="85" width="12" height="18" rx="5" fill="#A1887F" stroke="#5D4037" strokeWidth="1.5" />
			<rect x="30" y="85" width="12" height="18" rx="5" fill="#A1887F" stroke="#5D4037" strokeWidth="1.5" />
			<ellipse cx="78" cy="103" rx="8" ry="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
			<ellipse cx="36" cy="103" rx="8" ry="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />

			{/* Front legs */}
			<rect x="40" y="88" width="10" height="18" rx="4" fill="#A1887F" stroke="#5D4037" strokeWidth="1.5" />
			<rect x="52" y="88" width="10" height="18" rx="4" fill="#A1887F" stroke="#5D4037" strokeWidth="1.5" />
			<ellipse cx="45" cy="106" rx="7" ry="3" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
			<ellipse cx="57" cy="106" rx="7" ry="3" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />

			{/* Head */}
			<ellipse cx="50" cy="38" rx="28" ry="26" fill="#A1887F" stroke="#5D4037" strokeWidth="2" />

			{/* Ears - floppy */}
			<ellipse cx="22" cy="28" rx="10" ry="16" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
				transform="rotate(-25, 22, 28)" />
			<ellipse cx="78" cy="28" rx="10" ry="16" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.5"
				transform="rotate(25, 78, 28)" />
			{/* Inner ear */}
			<ellipse cx="22" cy="32" rx="6" ry="10" fill="#FFCC80" />
			<ellipse cx="78" cy="32" rx="6" ry="10" fill="#FFCC80" />

			{/* Snout */}
			<ellipse cx="50" cy="46" rx="14" ry="10" fill="#EFEBE9" stroke="#5D4037" strokeWidth="1.5" />

			{/* Nose */}
			<ellipse cx="50" cy="42" rx="5" ry="3.5" fill="#333" />
			<ellipse cx="49" cy="41" rx="1.5" ry="1" fill="#666" />

			{/* Eyes */}
			<ellipse cx="38" cy="34" rx="5" ry="5.5" fill="#1A1A1A" />
			<ellipse cx="62" cy="34" rx="5" ry="5.5" fill="#1A1A1A" />
			<circle cx="40" cy="32" r="2" fill="white" />
			<circle cx="64" cy="32" r="2" fill="white" />

			{/* Eyebrows */}
			<path d="M30 26 Q38 22 44 26" fill="none" stroke="#4E342E" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M56 26 Q62 22 70 26" fill="none" stroke="#4E342E" strokeWidth="1.5" strokeLinecap="round" />

			{/* Mouth */}
			<path d="M44 50 Q50 55 56 50" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

			{/* Tongue */}
			{tongueOut && (
				<path d="M48 50 Q48 60 52 60 Q55 60 52 50" fill="#FF5252" stroke="none" />
			)}

			{/* Spot on head */}
			<ellipse cx="55" cy="18" rx="8" ry="6" fill="#8D6E63" opacity="0.5" />

			{/* Cheek blush */}
			{expression === 'happy' && (
				<>
					<ellipse cx="30" cy="40" rx="5" ry="3" fill="#FFAB91" opacity="0.4" />
					<ellipse cx="70" cy="40" rx="5" ry="3" fill="#FFAB91" opacity="0.4" />
				</>
			)}
		</svg>
	);
};
