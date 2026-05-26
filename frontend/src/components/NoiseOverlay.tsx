import React from 'react';

interface NoiseOverlayProps {
	/**
	 * Opacity of the noise (0–1). Keep low (0.01–0.03) for subtle grain.
	 * @default 0.02
	 */
	opacity?: number;
	/**
	 * Intensity of the noise contrast (0–1).
	 * @default 0.5
	 */
	intensity?: number;
}

/**
 * Subtle film-grain texture overlay using SVG feTurbulence filter.
 * Runs on the GPU compositor — near-zero CPU cost per frame.
 *
 * Add as the topmost layer (highest z-index) in any scene.
 * Keep opacity at 1–3% — the effect should be barely perceivable.
 */
export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
	opacity = 0.02,
	intensity = 0.5,
}) => {
	// The feColorMatrix alpha channel scales the turbulence output by intensity × opacity
	const alpha = (intensity * opacity * 0.5).toFixed(6);

	return (
		<svg
			width="100%"
			height="100%"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: 1,
				pointerEvents: 'none',
				zIndex: 60,
				mixBlendMode: 'multiply',
			}}
			viewBox="0 0 1920 1080"
			preserveAspectRatio="none"
		>
			<defs>
				<filter id="grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.65"
						numOctaves="3"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values={`
							1 0 0 0 0
							0 1 0 0 0
							0 0 1 0 0
							0 0 0 ${alpha} 0
						`}
					/>
				</filter>
			</defs>
			<rect
				width="100%"
				height="100%"
				fill="white"
				filter={`url(#grain)`}
			/>
		</svg>
	);
};
