import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../config/constants';

type BackgroundType = 'House' | 'Street' | 'Rooftop' | 'SunsetRooftop';

interface BackgroundProps {
	type: BackgroundType;
	/** Scene-relative frame for animations */
	frame?: number;
}

/** Floating cloud effect */
const Cloud: React.FC<{
	style?: React.CSSProperties;
	cloudFrame?: number;
	offset?: number;
}> = ({ style, cloudFrame = 0, offset = 0 }) => {
	const drift = Math.sin((cloudFrame + offset) * 0.008) * 20;
	return (
		<div
			style={{
				position: 'absolute',
				width: 180,
				height: 60,
				backgroundColor: 'rgba(255,255,255,0.6)',
				borderRadius: 60,
				transform: `translateX(${drift}px)`,
				...style,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: -20,
					left: 20,
					width: 80,
					height: 50,
					backgroundColor: 'rgba(255,255,255,0.5)',
					borderRadius: 40,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: -12,
					left: 70,
					width: 60,
					height: 40,
					backgroundColor: 'rgba(255,255,255,0.55)',
					borderRadius: 30,
				}}
			/>
		</div>
	);
};

/** Tree silhouette */
const Tree: React.FC<{
	left: string;
	height: number;
	color?: string;
}> = ({ left, height, color = '#5D4037' }) => (
	<div style={{ position: 'absolute', bottom: '30%', left, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
		{/* Trunk */}
		<div
			style={{
				width: 14,
				height: height * 0.45,
				backgroundColor: color,
				borderRadius: '4px 4px 0 0',
			}}
		/>
		{/* Foliage */}
		<div
			style={{
				width: height * 0.5,
				height: height * 0.45,
				backgroundColor: '#4CAF50',
				borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
				position: 'absolute',
				top: height * -0.05,
				boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
			}}
		/>
	</div>
);

export const Background: React.FC<BackgroundProps> = ({ type, frame = 0 }) => {
	switch (type) {
		case 'House':
			return (
				<AbsoluteFill style={{ backgroundColor: COLORS.Kasukabe.House }}>
					{/* Wall pattern with subtle light flicker */}
					{(() => {
						const lightFlicker = 0.97 + Math.sin(frame * 0.06) * 0.02 + Math.sin(frame * 0.13 + 1) * 0.01;
						return (
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '70%',
									background: 'linear-gradient(180deg, #FFFAF0 0%, #F5E6CC 100%)',
									opacity: lightFlicker,
								}}
							/>
						);
					})()}

					{/* Window */}
					<div
						style={{
							position: 'absolute',
							top: '10%',
							left: '60%',
							width: 140,
							height: 160,
							backgroundColor: '#87CEEB',
							border: '4px solid #8B4513',
							borderRadius: 4,
						}}
					>
						{/* Window cross */}
						<div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 3, backgroundColor: '#8B4513' }} />
						<div style={{ position: 'absolute', top: 0, left: '50%', width: 3, height: '100%', backgroundColor: '#8B4513' }} />
					{/* Animated Curtains */}
						{(() => {
							const curtainSway = Math.sin(frame * 0.04) * 3;
							const curtainSway2 = Math.sin(frame * 0.035 + 1.5) * 2;
							return (
								<>
									<div
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: 30,
											height: '100%',
											background: 'linear-gradient(180deg, #FF8A65 0%, #FFAB91 100%)',
											opacity: 0.6,
											transform: `translateX(${curtainSway}px)`,
											transition: 'none',
										}}
									/>
									<div
										style={{
											position: 'absolute',
											top: 0,
											right: 0,
											width: 30,
											height: '100%',
											background: 'linear-gradient(180deg, #FF8A65 0%, #FFAB91 100%)',
											opacity: 0.6,
											transform: `translateX(${-curtainSway2}px)`,
											transition: 'none',
										}}
									/>
								</>
							);
						})()}
					</div>

				{/* Animated Clock on wall */}
					{(() => {
						// Second hand: full rotation every 360 frames (15s at 24fps)
						const secondAngle = (frame % 360) * 1;
						// Minute hand: 1/60th speed
						const minuteAngle = (frame % 21600) / 60;
						return (
							<div
								style={{
									position: 'absolute',
									top: '8%',
									left: '15%',
									width: 60,
									height: 60,
									borderRadius: '50%',
									backgroundColor: '#fff',
									border: '3px solid #333',
									boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
								}}
							>
								{/* Clock numbers */}
								<div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 'bold', color: '#333' }}>12</div>
								<div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, fontWeight: 'bold', color: '#333' }}>6</div>
								<div style={{ position: 'absolute', top: '50%', right: 4, transform: 'translateY(-50%)', fontSize: 8, fontWeight: 'bold', color: '#333' }}>3</div>
								<div style={{ position: 'absolute', top: '50%', left: 4, transform: 'translateY(-50%)', fontSize: 8, fontWeight: 'bold', color: '#333' }}>9</div>
								{/* Minute hand */}
								<div style={{ position: 'absolute', top: '50%', left: '50%', width: 2, height: 16, backgroundColor: '#333', borderRadius: 1, transformOrigin: '50% 0%', transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
								{/* Second hand */}
								<div style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: 20, backgroundColor: '#E53935', borderRadius: 1, transformOrigin: '50% 0%', transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
								{/* Center pin */}
								<div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#333', transform: 'translate(-50%, -50%)' }} />
								{/* Tick marks */}
								{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
									<div key={angle} style={{ position: 'absolute', top: 4, left: 'calc(50% - 6px)', width: 2, height: 4, backgroundColor: '#333', transformOrigin: '50% 26px', transform: `rotate(${angle}deg)` }} />
								))}
							</div>
						);
					})()}

					{/* Floor */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '30%',
							backgroundColor: '#e5d3b3',
							borderTop: '3px solid #8b4513',
						}}
					>
						{/* Floor planks */}
						{[0, 1, 2, 3, 4].map((i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: `${i * 20}%`,
									left: 0,
									width: '100%',
									height: 1,
									backgroundColor: '#c4a87c',
									opacity: 0.4,
								}}
							/>
						))}
					</div>

					{/* Sofa */}
					<div
						style={{
							position: 'absolute',
							bottom: '24%',
							left: '8%',
							width: 320,
							height: 90,
							backgroundColor: '#5C6BC0',
							borderRadius: '20px 20px 6px 6px',
							border: '2px solid #3949AB',
							boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						}}
					>
						{/* Sofa cushions */}
						<div style={{ position: 'absolute', bottom: 0, left: 10, width: '45%', height: '70%', backgroundColor: '#7986CB', borderRadius: '0 0 6px 6px', borderTop: '1px solid #5C6BC0' }} />
						<div style={{ position: 'absolute', bottom: 0, right: 10, width: '45%', height: '70%', backgroundColor: '#7986CB', borderRadius: '0 0 6px 6px', borderTop: '1px solid #5C6BC0' }} />
						{/* Sofa armrests */}
						<div style={{ position: 'absolute', top: 0, left: -8, width: 18, height: 80, backgroundColor: '#3949AB', borderRadius: '6px 6px 0 6px', boxShadow: '-2px 2px 4px rgba(0,0,0,0.2)' }} />
						<div style={{ position: 'absolute', top: 0, right: -8, width: 18, height: 80, backgroundColor: '#3949AB', borderRadius: '6px 6px 6px 0', boxShadow: '2px 2px 4px rgba(0,0,0,0.2)' }} />
					</div>

					{/* Table */}
					<div
						style={{
							position: 'absolute',
							bottom: '28%',
							right: '12%',
							width: 120,
							height: 60,
							backgroundColor: '#8D6E63',
							borderRadius: 4,
							border: '2px solid #6D4C41',
						}}
					>
						{/* Table top highlight */}
						<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, backgroundColor: '#A1887F', borderRadius: '2px 2px 0 0' }} />
					</div>

					{/* Picture frame */}
					<div
						style={{
							position: 'absolute',
							top: '6%',
							left: '38%',
							width: 80,
							height: 70,
							border: '4px solid #8D6E63',
							borderRadius: 2,
							backgroundColor: '#E8F5E9',
						}}
					>
						<div style={{ position: 'absolute', top: '30%', left: '30%', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFCC80' }} />
						<div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '60%', height: 2, backgroundColor: '#A1887F' }} />
						<div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '80%', height: 1, backgroundColor: '#A1887F' }} />
					</div>
				</AbsoluteFill>
			);
		case 'Street':
			return (
				<AbsoluteFill style={{ backgroundColor: COLORS.Kasukabe.Sky }}>
					{/* Clouds */}
					<Cloud style={{ top: '5%', left: '10%' }} cloudFrame={frame} offset={0} />
					<Cloud style={{ top: '3%', right: '15%', width: 140, height: 50 }} cloudFrame={frame} offset={50} />
					<Cloud style={{ top: '12%', left: '45%', width: 120, height: 40 }} cloudFrame={frame} offset={100} />

					{/* Sun */}
					<div
						style={{
							position: 'absolute',
							top: '4%',
							right: '10%',
							width: 80,
							height: 80,
							borderRadius: '50%',
							backgroundColor: '#FFF9C4',
							boxShadow: '0 0 60px #FFF9C4, 0 0 120px rgba(255, 249, 196, 0.3)',
						}}
					/>

					{/* City silhouette */}
					<div
						style={{
							position: 'absolute',
							bottom: '40%',
							width: '100%',
							height: '15%',
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'space-around',
						}}
					>
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								style={{
									width: `${12 + Math.random() * 8}%`,
									height: `${40 + Math.random() * 60}%`,
									backgroundColor: '#E8E0D0',
									border: '1px solid #D7CCC8',
									borderRadius: '3px 3px 0 0',
									position: 'relative',
								}}
							>
								{/* Windows */}
								{[...Array(4)].map((_, j) => (
									<div
										key={j}
										style={{
											position: 'absolute',
											top: `${12 + j * 22}%`,
											left: `${15 + (j % 2) * 50}%`,
											width: 12,
											height: 16,
											backgroundColor: j % 2 === 0 ? '#FFE082' : '#BBDEFB',
											borderRadius: 1,
											opacity: 0.7,
										}}
									/>
								))}
							</div>
						))}
					</div>

					{/* Trees */}
					<Tree left="5%" height={100} />
					<Tree left="85%" height={120} color="#4E342E" />

					{/* Road */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '40%',
							backgroundColor: '#757575',
						}}
					>
						{/* Road markings */}
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: 0,
								width: '100%',
								height: 3,
								backgroundColor: '#FFEB3B',
								opacity: 0.6,
							}}
						/>
						{/* Dashed center line */}
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: '50%',
									left: `${i * 17}%`,
									width: '8%',
									height: 3,
									backgroundColor: '#FFEB3B',
									opacity: 0.8,
								}}
							/>
						))}
						{/* Sidewalk */}
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '12%',
								backgroundColor: '#BDBDBD',
								borderTop: '2px solid #9E9E9E',
							}}
						/>
					</div>
				</AbsoluteFill>
			);
		case 'SunsetRooftop':
			return (
				<AbsoluteFill style={{ background: COLORS.Sunset.Sky }}>
					{/* Gradient layers for richer sunset */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '60%',
							background: 'linear-gradient(180deg, #FF6B35 0%, #FF7E5F 30%, #FEB47B 60%, #FFD8A8 100%)',
						}}
					/>

					{/* Sun glow */}
					<div
						style={{
							position: 'absolute',
							bottom: '35%',
							right: '18%',
							width: 160,
							height: 160,
							borderRadius: '50%',
							backgroundColor: '#FF6B35',
							boxShadow: '0 0 80px #FF6B35, 0 0 160px rgba(255, 107, 53, 0.4), 0 0 240px rgba(255, 107, 53, 0.2)',
						}}
					>
						{/* Sun inner glow */}
						<div
							style={{
								position: 'absolute',
								top: '20%',
								left: '20%',
								width: '60%',
								height: '60%',
								borderRadius: '50%',
								backgroundColor: '#FFD54F',
								opacity: 0.6,
							}}
						/>
					</div>

					{/* Distant city silhouette */}
					<div
						style={{
							position: 'absolute',
							bottom: '20%',
							width: '100%',
							height: '20%',
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'space-evenly',
						}}
					>
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								style={{
									width: `${10 + Math.random() * 8}%`,
									height: `${30 + Math.random() * 70}%`,
									backgroundColor: '#2C2C2C',
									borderRadius: '2px 2px 0 0',
									opacity: 0.7,
								}}
							>
								{/* Glowing windows */}
								{[...Array(3)].map((_, j) => (
									<div
										key={j}
										style={{
											position: 'absolute',
											top: `${15 + j * 25}%`,
											left: `${20 + (j % 2) * 45}%`,
											width: 8,
											height: 10,
											backgroundColor: '#FFE082',
											opacity: 0.5 + Math.random() * 0.3,
											borderRadius: 1,
										}}
									/>
								))}
							</div>
						))}
					</div>

					{/* Stars appearing */}
					<div
						style={{
							position: 'absolute',
							top: '8%',
							left: '15%',
							width: 3,
							height: 3,
							borderRadius: '50%',
							backgroundColor: '#fff',
							opacity: 0.3 + Math.sin(frame * 0.02) * 0.15,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: '12%',
							right: '35%',
							width: 2,
							height: 2,
							borderRadius: '50%',
							backgroundColor: '#fff',
							opacity: 0.2 + Math.sin(frame * 0.03 + 1) * 0.15,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: '6%',
							left: '40%',
							width: 2,
							height: 2,
							borderRadius: '50%',
							backgroundColor: '#fff',
							opacity: 0.25 + Math.sin(frame * 0.025 + 2) * 0.15,
						}}
					/>

					{/* Rooftop edge */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '20%',
							backgroundColor: '#3E2723',
						}}
					>
						{/* Rooftop railing */}
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: 20,
								backgroundColor: '#5D4037',
								borderBottom: '2px solid #4E342E',
							}}
						/>
						{/* Railing bars */}
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: 8,
									left: `${i * 8.5}%`,
									width: 4,
									height: 12,
									backgroundColor: '#795548',
								}}
							/>
						))}
						{/* Roof floor texture */}
						<div
							style={{
								position: 'absolute',
								top: 22,
								left: 0,
								width: '100%',
								height: 'calc(100% - 22px)',
								background: 'linear-gradient(180deg, #4E342E 0%, #3E2723 100%)',
							}}
						/>
					</div>
				</AbsoluteFill>
			);
		default:
			return <AbsoluteFill style={{ backgroundColor: 'white' }} />;
	}
};
