export interface DialogueLine {
	speaker: string;
	expression: 'normal' | 'happy' | 'angry' | 'shocked';
	text: string;
	audio: string | null;
	startFrame: number;
	durationInFrames: number;
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
