import React from 'react';

interface Props {
	expression?: 'normal' | 'happy' | 'angry' | 'shocked';
}

export const ShiroSVG: React.FC<Props> = ({ expression = 'normal' }) => {
	const tongueOut = expression === 'happy';
	const earAngle = expression === 'happy' ? -15 : expression === 'angry' ? 15 : 0;

	return (
		<svg width="160" height="160" viewBox="0 0 120 120">
			{/* Body - fluffy white */}
			<ellipse cx="60" cy="82" rx="32" ry="25" fill="white" stroke="#ccc" strokeWidth="2" />
			{/* Fluffy fur on body */}
			<circle cx="38" cy="78" r="12" fill="white" stroke="#ccc" strokeWidth="1" />
			<circle cx="82" cy="78" r="12" fill="white" stroke="#ccc" strokeWidth="1" />
			<circle cx="60" cy="92" r="10" fill="white" stroke="#ccc" strokeWidth="1" />

			{/* Tail - fluffy */}
			<path d="M85 75 Q105 60 100 50 Q98 45 95 48 Q90 55 80 70" fill="white" stroke="#ccc" strokeWidth="1.5" />

			{/* Legs */}
			<rect x="42" y="100" width="12" height="15" rx="5" fill="white" stroke="#ccc" strokeWidth="1.5" />
			<rect x="66" y="100" width="12" height="15" rx="5" fill="white" stroke="#ccc" strokeWidth="1.5" />

			{/* Paws */}
			<ellipse cx="48" cy="115" rx="8" ry="4" fill="#FFE0B2" stroke="#BF8A5E" strokeWidth="1" />
			<ellipse cx="72" cy="115" rx="8" ry="4" fill="#FFE0B2" stroke="#BF8A5E" strokeWidth="1" />

			{/* Head */}
			<circle cx="60" cy="42" r="28" fill="white" stroke="#ccc" strokeWidth="2" />

			{/* Ears - floppy */}
			<ellipse cx="32" cy="32" rx="10" ry="16" fill="#F5F5F5" stroke="#ccc" strokeWidth="1.5"
				transform={`rotate(${earAngle - 20}, 32, 32)`} />
			<ellipse cx="88" cy="32" rx="10" ry="16" fill="#F5F5F5" stroke="#ccc" strokeWidth="1.5"
				transform={`rotate(${-earAngle + 20}, 88, 32)`} />
			{/* Inner ear */}
			<ellipse cx="32" cy="34" rx="6" ry="10" fill="#FFCC80" />
			<ellipse cx="88" cy="34" rx="6" ry="10" fill="#FFCC80" />

			{/* Eyes */}
			<circle cx="50" cy="42" r="5" fill="#1A1A1A" />
			<circle cx="70" cy="42" r="5" fill="#1A1A1A" />
			{/* Eye shine */}
			<circle cx="52" cy="40" r="2" fill="white" />
			<circle cx="72" cy="40" r="2" fill="white" />

			{/* Eyebrows */}
			<path d="M42 34 Q50 30 56 34" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M64 34 Q70 30 78 34" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />

			{/* Nose - black */}
			<ellipse cx="60" cy="50" rx="5" ry="3.5" fill="#333" />

			{/* Mouth */}
			<path d="M55 54 Q60 58 65 54" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

			{/* Tongue */}
			{tongueOut && (
				<path d="M58 54 Q58 65 62 65 Q65 65 62 54" fill="#FF5252" stroke="none" />
			)}

			{/* Cheek blush when happy */}
			{expression === 'happy' && (
				<>
					<ellipse cx="38" cy="48" rx="6" ry="4" fill="#FFAB91" opacity="0.4" />
					<ellipse cx="82" cy="48" rx="6" ry="4" fill="#FFAB91" opacity="0.4" />
				</>
			)}

			{/* Whisker dots */}
			<circle cx="44" cy="50" r="1" fill="#999" />
			<circle cx="46" cy="53" r="1" fill="#999" />
			<circle cx="74" cy="50" r="1" fill="#999" />
			<circle cx="76" cy="53" r="1" fill="#999" />
		</svg>
	);
};
