import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../constants';

type BackgroundType = 'House' | 'Street' | 'Rooftop' | 'SunsetRooftop';

interface BackgroundProps {
	type: BackgroundType;
}

export const Background: React.FC<BackgroundProps> = ({ type }) => {
	switch (type) {
		case 'House':
			return (
				<AbsoluteFill style={{ backgroundColor: COLORS.Kasukabe.House }}>
					{/* Floor */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '30%',
							backgroundColor: '#e5d3b3',
							borderTop: '2px solid #8b4513',
						}}
					/>
					{/* Sofa */}
					<div
						style={{
							position: 'absolute',
							bottom: '20%',
							left: '10%',
							width: '300px',
							height: '100px',
							backgroundColor: '#add8e6',
							borderRadius: '20px 20px 0 0',
							border: '2px solid #4682b4',
						}}
					/>
				</AbsoluteFill>
			);
		case 'Street':
			return (
				<AbsoluteFill style={{ backgroundColor: COLORS.Kasukabe.Sky }}>
					{/* Road */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '40%',
							backgroundColor: COLORS.Kasukabe.Street,
						}}
					/>
					{/* Houses in background */}
					<div
						style={{
							position: 'absolute',
							bottom: '40%',
							width: '100%',
							display: 'flex',
							justifyContent: 'space-around',
						}}
					>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								style={{
									width: '200px',
									height: '150px',
									backgroundColor: '#fdf5e6',
									border: '2px solid #deb887',
									borderRadius: '5px 5px 0 0',
								}}
							/>
						))}
					</div>
				</AbsoluteFill>
			);
		case 'SunsetRooftop':
			return (
				<AbsoluteFill style={{ background: COLORS.Sunset.Sky }}>
					{/* Rooftop Edge */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '20%',
							backgroundColor: '#4a4a4a',
						}}
					/>
					{/* Sun */}
					<div
						style={{
							position: 'absolute',
							bottom: '30%',
							right: '15%',
							width: '100px',
							height: '100px',
							backgroundColor: '#ff4500',
							borderRadius: '50%',
							boxShadow: '0 0 50px #ff4500',
						}}
					/>
				</AbsoluteFill>
			);
		default:
			return <AbsoluteFill style={{ backgroundColor: 'white' }} />;
	}
};
