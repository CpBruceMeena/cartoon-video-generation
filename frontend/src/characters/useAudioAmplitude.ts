/**
 * useAudioAmplitude — Reads per-frame RMS amplitude from dialogue line data.
 *
 * The backend pipeline (pipeline.py) extracts amplitude envelope per dialogue
 * line and stores it as `amplitude: number[]` in the DialogueLine type.
 *
 * This hook looks up the active dialogue line at the current frame and returns
 * the corresponding amplitude value, driving mouth animation from actual audio.
 */
import { useMemo } from 'react';
import type { DialogueLine } from '../types';

export interface UseAudioAmplitudeOptions {
	/** All dialogue lines in the current scene */
	dialogue: DialogueLine[];
	/** Scene-relative frame */
	sceneFrame: number;
	/** Scene global start frame */
	sceneStartFrame: number;
}

/**
 * Returns the amplitude (0–1) for the current frame based on the active
 * dialogue line's pre-computed amplitude envelope.
 *
 * Falls back to a sine-wave approximation when no amplitude data is available.
 */
export function useAudioAmplitude({
	dialogue,
	sceneFrame,
	sceneStartFrame,
}: UseAudioAmplitudeOptions): number {
	// Find the active dialogue line at this frame
	const result = useMemo(() => {
		const globalFrame = sceneFrame + sceneStartFrame;

		const activeLine = dialogue.find((d) => {
			return (
				globalFrame >= d.startFrame &&
				globalFrame < d.startFrame + d.durationInFrames
			);
		});

		if (!activeLine) {
			return { amplitude: 0, lineStartFrame: 0 };
		}

		const lineLocalFrame = globalFrame - activeLine.startFrame;
		return { amplitude: activeLine.amplitude?.[lineLocalFrame] ?? null, lineStartFrame: lineLocalFrame };
	}, [dialogue, sceneFrame, sceneStartFrame]);

	const { amplitude, lineStartFrame } = result;

	// If we have real amplitude data, use it
	if (amplitude !== null && amplitude !== undefined) {
		return amplitude;
	}

	// Fallback: gentle sine wave (same as backend _sine_fallback)
	return 0.3 + 0.25 * Math.sin(lineStartFrame * 0.35);
}
