import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../config/constants';

type BackgroundType = 'House' | 'Street' | 'Rooftop' | 'SunsetRooftop';

interface BackgroundProps {
	type: BackgroundType;
	/** Scene-relative frame for animations */
	frame?: number;
}

// ─── 2.5D Depth Layers ─────────────────────────────────────────────────────
//
// We simulate a 3D room by layering elements at different depths with
// perspective transforms. Depth values:
//   depth-0: far wall / sky (backmost)
//   depth-1: windows, posters, wall decor
//   depth-2: furniture (sofa, table, bookshelf)
//   depth-3: foreground elements, character area
//   depth-4: light rays, particles (frontmost)

/** Floating dust motes — subtle ambient particles */
const DustMote: React.FC<{
	x: number;
	y: number;
	size: number;
	opacity: number;
	frame: number;
	speed: number;
}> = ({ x, y, size, opacity, frame, speed }) => {
	const driftX = Math.sin(frame * speed + x) * 6;
	const driftY = Math.sin(frame * speed * 0.6 + y) * 4 + Math.sin(frame * speed * 0.3) * 3;
	const flicker = 0.4 + Math.sin(frame * speed * 1.5) * 0.35;

	return (
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				borderRadius: '50%',
				backgroundColor: `rgba(255, 235, 200, ${opacity * flicker})`,
				transform: `translate(${driftX}px, ${driftY}px)`,
				pointerEvents: 'none',
				boxShadow: `0 0 ${size * 2}px rgba(255, 235, 200, ${opacity * 0.3})`,
				transition: 'none',
			}}
		/>
	);
};

/** Light beam from window — a translucent rotated rectangle */
const LightBeam: React.FC<{
	left: string;
	top: string;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
	frame?: number;
}> = ({ left, top, width, height, rotation: baseRotation, opacity, frame = 0 }) => {
	const flicker = 0.7 + Math.sin(frame * 0.05) * 0.15 + Math.sin(frame * 0.09 + 1) * 0.1;
	return (
		<div
			style={{
				position: 'absolute',
				left,
				top,
				width,
				height,
				background: `linear-gradient(135deg, 
					rgba(255, 255, 200, ${opacity * 0.4 * flicker}) 0%, 
					rgba(255, 245, 200, ${opacity * 0.2 * flicker}) 40%, 
					transparent 100%)`,
				transform: `rotate(${baseRotation}deg)`,
				transformOrigin: 'top left',
				pointerEvents: 'none',
				maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0))',
				WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0))',
				transition: 'none',
			}}
		/>
	);
};

/** Floating cloud effect with parallax drift */
const Cloud: React.FC<{
	style?: React.CSSProperties;
	cloudFrame?: number;
	offset?: number;
	depth?: number;
}> = ({ style, cloudFrame = 0, offset = 0, depth = 1 }) => {
	const drift = Math.sin((cloudFrame + offset) * 0.006) * 25 * depth;
	const yDrift = Math.sin((cloudFrame + offset) * 0.004) * 6 * depth;
	return (
		<div
			style={{
				position: 'absolute',
				width: 180,
				height: 60,
				backgroundColor: 'rgba(255,255,255,0.6)',
				borderRadius: 60,
				transform: `translateX(${drift}px) translateY(${yDrift}px)`,
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
const Tree: React.FC<{ left: string; height: number; color?: string }> = ({
	left,
	height,
	color = '#5D4037',
}) => (
	<div
		style={{
			position: 'absolute',
			bottom: '30%',
			left,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		}}
	>
		<div
			style={{
				width: 14,
				height: height * 0.45,
				backgroundColor: color,
				borderRadius: '4px 4px 0 0',
			}}
		/>
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

/** Small rug on the floor */
const Rug: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			bottom: '12%',
			left: '35%',
			width: '30%',
			height: '4%',
			backgroundColor: '#8D6E63',
			borderRadius: '50%',
			opacity: 0.6,
			boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
			border: '1px solid #6D4C41',
		}}
	>
		{/* Rug pattern stripes */}
		{[0, 1, 2].map((i) => (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: `${15 + i * 25}%`,
					top: '20%',
					width: '8%',
					height: '60%',
					backgroundColor: '#A1887F',
					borderRadius: 2,
					opacity: 0.4,
				}}
			/>
		))}
	</div>
);

/** Bookshelf with books */
const Bookshelf: React.FC = () => {
	const shelfColors = ['#E53935', '#1E88E5', '#FDD835', '#8E24AA', '#43A047', '#FF7043', '#5C6BC0', '#00ACC1'];
	return (
		<div
			style={{
				position: 'absolute',
				top: '12%',
				right: '6%',
				width: 120,
				height: 180,
				backgroundColor: '#6D4C41',
				border: '3px solid #4E342E',
				borderRadius: 4,
				display: 'flex',
				flexDirection: 'column',
				padding: '6px 4px',
				gap: 4,
				boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
				perspective: '200px',
			}}
		>
			{/* 4 shelves of books */}
			{[0, 1, 2, 3].map((shelf) => (
				<div
					key={shelf}
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'flex-end',
						gap: 2,
						paddingBottom: 2,
						borderBottom: shelf < 3 ? '2px solid #5D4037' : 'none',
					}}
				>
					{[...Array(3 + shelf % 2)].map((_, book) => {
						const color = shelfColors[(shelf * 3 + book) % shelfColors.length];
						const bookHeight = 60 + (book * 5) % 25;
						return (
							<div
								key={book}
								style={{
									width: 22 + book * 3,
									height: `${bookHeight}%`,
									backgroundColor: color,
									borderRadius: '1px 1px 0 0',
									transform: `rotate(${(book % 2 ? 2 : -2)}deg)`,
									boxShadow: 'inset 2px 0 0 rgba(255,255,255,0.15)',
									position: 'relative' as const,
								}}
							>
								{/* Book spine highlight */}
								<div
									style={{
										position: 'absolute',
										top: '15%',
										left: 3,
										width: 4,
										height: '40%',
										backgroundColor: 'rgba(255,255,255,0.12)',
										borderRadius: 1,
									}}
								/>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

/** Wall poster / painting */
const Poster: React.FC<{
	left: string;
	top: string;
	width: number;
	height: number;
	color: string;
	accent?: string;
	frame?: number;
}> = ({ left, top, width, height, color, accent = '#FFD54F', frame = 0 }) => {
	const sway = Math.sin(frame * 0.02) * 0.3;
	return (
		<div
			style={{
				position: 'absolute',
				left,
				top,
				width,
				height,
				border: `3px solid ${accent}`,
				borderRadius: 2,
				backgroundColor: color,
				transform: `rotate(${sway}deg)`,
				boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
				overflow: 'hidden',
			}}
		>
			{/* Abstract art / design inside poster */}
			<div
				style={{
					position: 'absolute',
					bottom: '15%',
					left: '10%',
					width: '40%',
					height: 2,
					backgroundColor: accent,
					opacity: 0.7,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: '25%',
					left: '10%',
					width: '60%',
					height: 2,
					backgroundColor: accent,
					opacity: 0.5,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '20%',
					left: '20%',
					width: 12,
					height: 12,
					borderRadius: '50%',
					backgroundColor: accent,
					opacity: 0.4,
				}}
			/>
		</div>
	);
};

/** Floor lamp */
const FloorLamp: React.FC<{ frame?: number }> = ({ frame = 0 }) => {
	const glowOpacity = 0.4 + Math.sin(frame * 0.03) * 0.1;
	return (
		<div
			style={{
				position: 'absolute',
				bottom: '22%',
				left: '5%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			{/* Lampshade */}
			<div
				style={{
					width: 40,
					height: 30,
					backgroundColor: '#FFE082',
					borderRadius: '20px 20px 5px 5px',
					border: '2px solid #F9A825',
					position: 'relative',
				}}
			>
				{/* Bulb glow */}
				<div
					style={{
						position: 'absolute',
						bottom: 2,
						left: '50%',
						transform: 'translateX(-50%)',
						width: 14,
						height: 10,
						borderRadius: '50%',
						backgroundColor: '#FFF9C4',
						boxShadow: `0 0 20px rgba(255, 249, 196, ${glowOpacity}), 0 0 40px rgba(255, 200, 50, ${glowOpacity * 0.3})`,
					}}
				/>
			</div>
			{/* Pole */}
			<div
				style={{
					width: 4,
					height: 50,
					backgroundColor: '#8D6E63',
				}}
			/>
			{/* Base */}
			<div
				style={{
					width: 30,
					height: 6,
					borderRadius: 4,
					backgroundColor: '#5D4037',
				}}
			/>
		</div>
	);
};

// ─── Main Background ──────────────────────────────────────────────────────

export const Background: React.FC<BackgroundProps> = ({ type, frame = 0 }) => {
	// Generate dust particles once (stable via frame-based seed)
	const dustParticles = React.useMemo(() => {
		return [...Array(16)].map((_, i) => ({
			x: 10 + (i * 37 + 7) % 80,
			y: 15 + (i * 53 + 13) % 65,
			size: 2 + (i % 4),
			opacity: 0.15 + (i % 5) * 0.06,
			speed: 0.008 + (i % 6) * 0.004,
		}));
	}, []);

	switch (type) {
		case 'House':
			return (
				<AbsoluteFill
					style={{
						background: COLORS.Kasukabe.House,
						perspective: '600px',
						overflow: 'hidden',
					}}
				>
					{/* ── DEPTH 0: Far Wall ─────────────────────────────── */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '70%',
							background: 'linear-gradient(180deg, #FFF8E7 0%, #F5E6CC 50%, #EDD9B5 100%)',
							opacity: 0.97 + Math.sin(frame * 0.04) * 0.02,
							zIndex: 0,
						}}
					>
						{/* Wall texture — subtle vertical lines */}
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: 0,
									left: `${i * 5}%`,
									width: 1,
									height: '100%',
									backgroundColor: 'rgba(0,0,0,0.02)',
								}}
							/>
						))}
						{/* Wainscoting / lower wall trim */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								width: '100%',
								height: '25%',
								borderTop: '2px solid rgba(139, 69, 19, 0.15)',
								background: 'linear-gradient(180deg, #F0E0C8 0%, #E8D5B0 100%)',
							}}
						>
							{[...Array(10)].map((_, i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										top: 0,
										left: `${i * 10}%`,
										width: 1,
										height: '100%',
										backgroundColor: 'rgba(139, 69, 19, 0.06)',
									}}
								/>
							))}
						</div>
					</div>

					{/* ── DEPTH 1: Window + Wall Decor ───────────────────── */}
					<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '70%', zIndex: 1 }}>
						{/* Window */}
						<div
							style={{
								position: 'absolute',
								top: '10%',
								left: '60%',
								width: 160,
								height: 180,
								backgroundColor: '#B3D9F2',
								border: '5px solid #8B4513',
								borderRadius: 4,
								boxShadow: 'inset 0 0 30px rgba(135, 206, 235, 0.3), 0 4px 12px rgba(0,0,0,0.1)',
							}}
						>
							{/* Sky gradient through window */}
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 60%, #E0F0E8 100%)',
								}}
							/>
							{/* Clouds visible through window */}
							<div
								style={{
									position: 'absolute',
									top: '10%',
									left: 10,
									width: 50,
									height: 20,
									backgroundColor: 'rgba(255,255,255,0.5)',
									borderRadius: 20,
								}}
							/>
							{/* Window cross */}
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: 0,
									width: '100%',
									height: 4,
									backgroundColor: '#8B4513',
								}}
							/>
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: '50%',
									width: 4,
									height: '100%',
									backgroundColor: '#8B4513',
								}}
							/>
							{/* Animated curtains */}
							{(() => {
								const curtainSway = Math.sin(frame * 0.035) * 4;
								const curtainSway2 = Math.sin(frame * 0.03 + 1.5) * 3;
								return (
									<>
										<div
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: 35,
												height: '100%',
												background: 'linear-gradient(180deg, #FF8A65 0%, #FFAB91 60%, #FFCCBC 100%)',
												opacity: 0.7,
												transform: `translateX(${curtainSway}px)`,
												transition: 'none',
											}}
										>
											{/* Curtain folds */}
											{[...Array(4)].map((_, i) => (
												<div
													key={i}
													style={{
														position: 'absolute',
														top: 0,
														left: `${6 + i * 8}px`,
														width: 3,
														height: '100%',
														backgroundColor: 'rgba(0,0,0,0.08)',
													}}
												/>
											))}
										</div>
										<div
											style={{
												position: 'absolute',
												top: 0,
												right: 0,
												width: 35,
												height: '100%',
												background: 'linear-gradient(180deg, #FF8A65 0%, #FFAB91 60%, #FFCCBC 100%)',
												opacity: 0.7,
												transform: `translateX(${-curtainSway2}px)`,
												transition: 'none',
											}}
										>
											{[...Array(4)].map((_, i) => (
												<div
													key={i}
													style={{
														position: 'absolute',
														top: 0,
														left: `${6 + i * 8}px`,
														width: 3,
														height: '100%',
														backgroundColor: 'rgba(0,0,0,0.08)',
													}}
												/>
											))}
										</div>
									</>
								);
							})()}
						</div>

						{/* Animated Clock on wall */}
						{(() => {
							const secondAngle = (frame % 360) * 1;
							const minuteAngle = (frame % 21600) / 60;
							return (
								<div
									style={{
										position: 'absolute',
										top: '8%',
										left: '18%',
										width: 70,
										height: 70,
										borderRadius: '50%',
										backgroundColor: '#fff',
										border: '4px solid #5D4037',
										boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
										zIndex: 2,
									}}
								>
									{/* Clock face details */}
									<div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 'bold', color: '#333', fontFamily: 'serif' }}>12</div>
									<div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 'bold', color: '#333', fontFamily: 'serif' }}>6</div>
									<div style={{ position: 'absolute', top: '50%', right: 5, transform: 'translateY(-50%)', fontSize: 9, fontWeight: 'bold', color: '#333', fontFamily: 'serif' }}>3</div>
									<div style={{ position: 'absolute', top: '50%', left: 5, transform: 'translateY(-50%)', fontSize: 9, fontWeight: 'bold', color: '#333', fontFamily: 'serif' }}>9</div>
									{/* Tick marks */}
									{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
										<div
											key={angle}
											style={{
												position: 'absolute',
												top: 5,
												left: 'calc(50% - 1.5px)',
												width: 3,
												height: 6,
												backgroundColor: angle % 90 === 0 ? '#333' : '#999',
												transformOrigin: '50% 30px',
												transform: `rotate(${angle}deg)`,
											}}
										/>
									))}
									{/* Minute hand */}
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											width: 3,
											height: 20,
											backgroundColor: '#333',
											borderRadius: 2,
											transformOrigin: '50% 0%',
											transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
										}}
									/>
									{/* Second hand */}
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											width: 2,
											height: 24,
											backgroundColor: '#E53935',
											borderRadius: 1,
											transformOrigin: '50% 0%',
											transform: `translateX(-50%) rotate(${secondAngle}deg)`,
										}}
									/>
									{/* Center pin */}
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											width: 6,
											height: 6,
											borderRadius: '50%',
											backgroundColor: '#5D4037',
											transform: 'translate(-50%, -50%)',
											zIndex: 3,
										}}
									/>
								</div>
							);
						})()}

						{/* Poster 1: Action Kamen poster (Shinchan themed) */}
						<Poster left="12%" top="30%" width={70} height={90} color="#E53935" accent="#FFCDD2" frame={frame} />

						{/* Bookshelf */}
						<Bookshelf />
					</div>

					{/* ── DEPTH 2: Light beams from window ──────────────── */}
					<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '70%', zIndex: 2, pointerEvents: 'none' }}>
						<LightBeam
							left="62%"
							top="22%"
							width={300}
							height={350}
							rotation={-12}
							opacity={0.35}
							frame={frame}
						/>
						<LightBeam
							left="65%"
							top="25%"
							width={200}
							height={280}
							rotation={-5}
							opacity={0.2}
							frame={frame}
						/>
					</div>

					{/* ── DEPTH 3: Furniture layer ──────────────────────── */}
					<div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
						{/* Floor */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								width: '100%',
								height: '30%',
								backgroundColor: '#D4B896',
								borderTop: '3px solid #A0785A',
							}}
						>
							{/* Floor plank lines */}
							{[...Array(8)].map((i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										top: `${i * 12.5}%`,
										left: 0,
										width: '100%',
										height: 1,
										backgroundColor: '#C4A87C',
										opacity: 0.4,
									}}
								/>
							))}
							{/* Wood grain - subtle vertical streaks */}
							{[...Array(5)].map((i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										top: 0,
										left: `${10 + i * 20}%`,
										width: 1,
										height: '100%',
										backgroundColor: 'rgba(0,0,0,0.03)',
									}}
								/>
							))}
						</div>

						{/* Rug */}
						<Rug />

						{/* Sofa - redesigned with more detail */}
						<div
							style={{
								position: 'absolute',
								bottom: '24%',
								left: '6%',
								width: 340,
								height: 100,
								backgroundColor: '#5C6BC0',
								borderRadius: '24px 24px 8px 8px',
								border: '2px solid #3949AB',
								boxShadow: '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
							}}
						>
							{/* Seat cushions */}
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 20,
									width: '40%',
									height: '65%',
									backgroundColor: '#7986CB',
									borderRadius: '0 0 6px 6px',
									borderTop: '2px solid rgba(0,0,0,0.08)',
									boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.08)',
								}}
							/>
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									right: 20,
									width: '40%',
									height: '65%',
									backgroundColor: '#7986CB',
									borderRadius: '0 0 6px 6px',
									borderTop: '2px solid rgba(0,0,0,0.08)',
									boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.08)',
								}}
							/>
							{/* Sofa back cushion */}
							<div
								style={{
									position: 'absolute',
									top: 8,
									left: 15,
									width: 'calc(100% - 30px)',
									height: '45%',
									backgroundColor: '#7986CB',
									borderRadius: '12px 12px 4px 4px',
									boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
								}}
							/>
							{/* Sofa armrests */}
							<div
								style={{
									position: 'absolute',
									top: -4,
									left: -10,
									width: 24,
									height: 88,
									backgroundColor: '#3949AB',
									borderRadius: '10px 10px 0 10px',
									boxShadow: '-3px 3px 8px rgba(0,0,0,0.2)',
								}}
							/>
							<div
								style={{
									position: 'absolute',
									top: -4,
									right: -10,
									width: 24,
									height: 88,
									backgroundColor: '#3949AB',
									borderRadius: '10px 10px 10px 0',
									boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
								}}
							/>
							{/* Sofa shadow */}
							<div
								style={{
									position: 'absolute',
									bottom: -6,
									left: '5%',
									width: '90%',
									height: 8,
									backgroundColor: 'rgba(0,0,0,0.08)',
									borderRadius: '50%',
								}}
							/>
						</div>

						{/* Coffee Table */}
						<div
							style={{
								position: 'absolute',
								bottom: '28%',
								right: '14%',
								width: 140,
								height: 65,
								backgroundColor: '#8D6E63',
								borderRadius: 6,
								border: '2px solid #6D4C41',
								boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
							}}
						>
							{/* Table top */}
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: -4,
									width: 'calc(100% + 8px)',
									height: 8,
									backgroundColor: '#A1887F',
									borderRadius: '4px 4px 0 0',
									boxShadow: '0 -2px 4px rgba(0,0,0,0.06)',
								}}
							/>
							{/* Cup/plate on table */}
							<div
								style={{
									position: 'absolute',
									top: 14,
									left: '30%',
									width: 30,
									height: 20,
									backgroundColor: '#fff',
									borderRadius: '4px 4px 2px 2px',
									border: '1px solid #E0E0E0',
								}}
							>
								{/* Cup handle */}
								<div
									style={{
										position: 'absolute',
										right: -7,
										top: 4,
										width: 7,
										height: 10,
										border: '2px solid #E0E0E0',
										borderLeft: 'none',
										borderRadius: '0 5px 5px 0',
									}}
								/>
							</div>
						</div>

						{/* Floor lamp */}
						<FloorLamp frame={frame} />
					</div>

					{/* ── DEPTH 4: Particles (dust motes in light) ──────── */}
					<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none' }}>
						{dustParticles.map((p, i) => (
							<DustMote key={i} {...p} frame={frame} />
						))}
					</div>
				</AbsoluteFill>
			);

		case 'Street':
			return (
				<AbsoluteFill style={{ backgroundColor: COLORS.Kasukabe.Sky }}>
					{/* Parallax clouds */}
					<Cloud style={{ top: '5%', left: '10%', zIndex: 1 }} cloudFrame={frame} offset={0} depth={1.5} />
					<Cloud style={{ top: '3%', right: '15%', width: 140, height: 50, zIndex: 1 }} cloudFrame={frame} offset={50} depth={1.2} />
					<Cloud style={{ top: '10%', left: '45%', width: 160, height: 45, zIndex: 1 }} cloudFrame={frame} offset={100} depth={0.8} />
					<Cloud style={{ top: '7%', left: '2%', width: 100, height: 35, zIndex: 1 }} cloudFrame={frame} offset={150} depth={1.8} />

					{/* Sun with animated glow */}
					<div
						style={{
							position: 'absolute',
							top: '4%',
							right: '12%',
							width: 90,
							height: 90,
							borderRadius: '50%',
							backgroundColor: '#FFF9C4',
							boxShadow: '0 0 60px #FFF9C4, 0 0 120px rgba(255, 249, 196, 0.4), 0 0 180px rgba(255, 249, 196, 0.15)',
							zIndex: 0,
						}}
					/>

					{/* Sun rays */}
					<div
						style={{
							position: 'absolute',
							top: '4%',
							right: '12%',
							width: 120,
							height: 120,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(255,249,196,0.3) 0%, transparent 70%)',
							transform: `rotate(${frame * 0.05}deg)`,
							zIndex: 0,
						}}
					/>

					{/* Trees layer */}
					<div style={{ position: 'absolute', bottom: '30%', width: '100%', height: '20%', zIndex: 2 }}>
						<Tree left="3%" height={120} />
						<Tree left="82%" height={140} color="#4E342E" />
						<Tree left="90%" height={100} />
					</div>

					{/* City silhouette */}
					<div
						style={{
							position: 'absolute',
							bottom: '38%',
							width: '100%',
							height: '15%',
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'space-around',
							zIndex: 1,
						}}
					>
						{[...Array(10)].map((_, i) => (
							<div
								key={i}
								style={{
									width: `${10 + Math.random() * 8}%`,
									height: `${40 + Math.random() * 60}%`,
									backgroundColor: '#E8E0D0',
									border: '1px solid #D7CCC8',
									borderRadius: '3px 3px 0 0',
									position: 'relative',
								}}
							>
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

					{/* Road */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '38%',
							backgroundColor: '#757575',
							zIndex: 3,
						}}
					>
						{/* Sidewalk */}
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '14%',
								backgroundColor: '#BDBDBD',
								borderTop: '2px solid #9E9E9E',
							}}
						/>
						{/* Dashed center line */}
						{[0, 1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: '50%',
									left: `${i * 14.5}%`,
									width: '8%',
									height: 3,
									backgroundColor: '#FFEB3B',
									opacity: 0.8,
								}}
							/>
						))}
					</div>
				</AbsoluteFill>
			);

		case 'SunsetRooftop':
			return (
				<AbsoluteFill style={{ background: COLORS.Sunset.Sky }}>
					{/* Sky gradient layers */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							background: 'linear-gradient(180deg, #1A237E 0%, #283593 15%, #FF6B35 40%, #FF7E5F 55%, #FEB47B 70%, #FFD8A8 85%, #FFE0B2 100%)',
						}}
					/>

					{/* Sun */}
					<div
						style={{
							position: 'absolute',
							bottom: '32%',
							right: '20%',
							width: 180,
							height: 180,
							borderRadius: '50%',
							background: 'radial-gradient(circle, #FFD54F 0%, #FF8A65 40%, #FF6B35 70%, transparent 100%)',
							boxShadow: '0 0 100px #FF6B35, 0 0 200px rgba(255, 107, 53, 0.4), 0 0 300px rgba(255, 107, 53, 0.2)',
						}}
					/>

					{/* Stars twinkling at top */}
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: `${2 + i * 3}%`,
								left: `${5 + i * 12}%`,
								width: 2 + (i % 2),
								height: 2 + (i % 2),
								borderRadius: '50%',
								backgroundColor: '#fff',
								opacity: 0.2 + Math.sin(frame * 0.02 + i * 2) * 0.15,
							}}
						/>
					))}

					{/* Distant city silhouette */}
					<div
						style={{
							position: 'absolute',
							bottom: '18%',
							width: '100%',
							height: '20%',
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'space-evenly',
						}}
					>
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								style={{
									width: `${10 + Math.random() * 8}%`,
									height: `${30 + Math.random() * 70}%`,
									backgroundColor: '#1A1A2E',
									borderRadius: '2px 2px 0 0',
									opacity: 0.8,
									position: 'relative' as const,
								}}
							>
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
											opacity: 0.4 + Math.sin(frame * 0.03 + i + j) * 0.15,
											borderRadius: 1,
										}}
									/>
								))}
							</div>
						))}
					</div>

					{/* Rooftop edge */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '18%',
							backgroundColor: '#3E2723',
							zIndex: 2,
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
						{[...Array(14)].map((_, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: 8,
									left: `${i * 7.2}%`,
									width: 4,
									height: 12,
									backgroundColor: '#795548',
								}}
							/>
						))}
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
