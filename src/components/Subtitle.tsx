import React from 'react';
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

interface SubtitleProps {
	text: string;
	speaker?: string;
	audioFile?: string | null;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, speaker, audioFile }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const fadeInEnd = Math.min(5, Math.floor(durationInFrames * 0.1));
	const fadeOutStart = Math.max(durationInFrames - 8, Math.floor(durationInFrames * 0.85));

	const opacity = interpolate(frame, [0, fadeInEnd, fadeOutStart, durationInFrames], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 90,
				width: '100%',
				textAlign: 'center',
				fontSize: 44,
				fontFamily: 'Arial, Helvetica, sans-serif',
				fontWeight: 'bold',
				color: 'white',
				textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)',
				padding: '0 60px',
				opacity,
				lineHeight: 1.3,
				zIndex: 100,
			}}
		>
			{audioFile && (
				<Audio src={staticFile(audioFile.startsWith('audio/') ? audioFile : `audio/${audioFile}`)} />
			)}
			{speaker && (
				<span
					style={{
						color: '#FFD700',
						marginRight: 10,
						fontSize: 36,
						backgroundColor: 'rgba(0,0,0,0.4)',
						padding: '2px 12px',
						borderRadius: 8,
					}}
				>
					{speaker}
				</span>
			)}
			{text}
		</div>
	);
};
