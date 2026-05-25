import React from 'react';
import { ShinchanSVG } from '../characters/Shinchan';
import { DoraemonSVG } from '../characters/Doraemon';
import { NobitaSVG } from '../characters/Nobita';
import { MisaeSVG } from '../characters/Misae';
import { ShiroSVG } from '../characters/Shiro';
import { ChibiFoxSVG } from '../characters/ChibiFox';
import { DogSVG } from '../characters/Dog';
import { RayneSVG } from '../characters/Rayne';
import { SchoolgirlSVG } from '../characters/Schoolgirl';
import { ScientistSVG } from '../characters/Scientist';
import { VillainSVG } from '../characters/Villain';

type Expression = 'normal' | 'happy' | 'angry' | 'shocked';

interface CharacterProps {
	type: string;
	style?: React.CSSProperties;
	expression?: Expression;
}

const characterSvgMap: Record<string, React.FC<{ expression?: Expression }>> = {
	shinchan: ShinchanSVG,
	doraemon: DoraemonSVG,
	nobita: NobitaSVG,
	misae: MisaeSVG,
	shiro: ShiroSVG,
	chibifox: ChibiFoxSVG,
	chibi: ChibiFoxSVG,
	dog: DogSVG,
	rayne: RayneSVG,
	schoolgirl: SchoolgirlSVG,
	scientist: ScientistSVG,
	villain: VillainSVG,
};

const normalizeName = (name: string): string => {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const characterLabels: Record<string, string> = {
	shinchan: 'Shinchan',
	doraemon: 'Doraemon',
	nobita: 'Nobita',
	misae: 'Misae',
	shiro: 'Shiro',
	chibifox: 'Chibi Fox',
	chibi: 'Chibi Fox',
	dog: 'Dog',
	rayne: 'Rayne',
	schoolgirl: 'Schoolgirl',
	scientist: 'Scientist',
	villain: 'Villain',
};

export const Character: React.FC<CharacterProps> = ({ type, style, expression = 'normal' }) => {
	const normalized = normalizeName(type);
	const SvgComponent = characterSvgMap[normalized];

	// Speaking bounce animation
	const bounceY = expression === 'happy' ? -8 : expression === 'angry' ? 4 : 0;
	const scale = expression === 'happy' ? 1.05 : expression === 'shocked' ? 1.08 : 1;

	return (
		<div
			style={{
				...style,
				position: 'absolute' as const,
				display: 'flex',
				flexDirection: 'column' as const,
				alignItems: 'center' as const,
				transform: `translateX(-50%) translateY(${bounceY}px) scale(${scale})`,
				transition: 'transform 0.15s ease-out',
				filter: expression === 'shocked' ? 'brightness(1.1) contrast(1.1)' : 'none',
			}}
		>
			{SvgComponent ? (
				<SvgComponent expression={expression} />
			) : (
				<div
					style={{
						width: 150,
						height: 180,
						backgroundColor: '#ddd',
						border: '3px dashed #666',
						borderRadius: 15,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						fontFamily: 'sans-serif',
					}}
				>
					<span style={{ fontSize: 40 }}>👤</span>
					<span style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10 }}>{type}</span>
				</div>
			)}
			{/* Character name label */}
			<div
				style={{
					marginTop: 6,
					padding: '4px 14px',
					backgroundColor: 'rgba(0,0,0,0.6)',
					borderRadius: 12,
					fontSize: 16,
					fontWeight: 'bold',
					fontFamily: 'Arial, sans-serif',
					color: '#fff',
					textAlign: 'center',
				}}
			>
				{characterLabels[normalized] || type}
			</div>
		</div>
	);
};
