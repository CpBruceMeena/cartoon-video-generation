export type Expression = 'normal' | 'happy' | 'angry' | 'shocked' | 'thinking' | 'listening' | 'sad' | 'laughing';

export interface DialogueLine {
	speaker: string;
	expression: Expression;
	text: string;
	audio: string | null;
	startFrame: number;
	durationInFrames: number;
	/** Per-frame RMS amplitude values (0-1) for lip-sync mouth animation */
	amplitude?: number[];
}

export interface SceneData {
	id: string;
	title: string;
	background: 'House' | 'Street' | 'SunsetRooftop';
	dialogue: DialogueLine[];
	startFrame: number;
	durationInFrames: number;
}

export interface ScriptData {
	scenes: SceneData[];
	totalDuration: number;
	fps: number;
}
