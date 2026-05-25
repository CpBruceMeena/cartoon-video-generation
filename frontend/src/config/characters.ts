export interface CharacterDetail {
	name: string;
	displayName: string;
	defaultWidth: number;
	defaultHeight: number;
	voiceProfileId: string;
}

export const CHARACTER_DEFINITIONS: Record<string, CharacterDetail> = {
	shinchan: {
		name: 'shinchan',
		displayName: 'Shinchan',
		defaultWidth: 280,
		defaultHeight: 320,
		voiceProfileId: 'c3832bff-5bed-483b-8f58-206df52d01e3',
	},
	doraemon: {
		name: 'doraemon',
		displayName: 'Doraemon',
		defaultWidth: 280,
		defaultHeight: 280,
		voiceProfileId: '597882d1-81ce-4712-9e58-89a226903e0a',
	},
	nobita: {
		name: 'nobita',
		displayName: 'Nobita',
		defaultWidth: 260,
		defaultHeight: 340,
		voiceProfileId: 'a58b10f6-ee8a-41af-965b-1b223e1b30d1',
	},
	misae: {
		name: 'misae',
		displayName: 'Misae',
		defaultWidth: 260,
		defaultHeight: 340,
		voiceProfileId: '216bb8dd-5445-4c91-8439-7ecb0d4ff394',
	},
	shiro: {
		name: 'shiro',
		displayName: 'Shiro',
		defaultWidth: 160,
		defaultHeight: 160,
		voiceProfileId: '',
	},
	chibifox: {
		name: 'chibifox',
		displayName: 'Chibi Fox',
		defaultWidth: 200,
		defaultHeight: 240,
		voiceProfileId: '',
	},
	dog: {
		name: 'dog',
		displayName: 'Dog',
		defaultWidth: 200,
		defaultHeight: 200,
		voiceProfileId: '',
	},
	rayne: {
		name: 'rayne',
		displayName: 'Rayne',
		defaultWidth: 260,
		defaultHeight: 360,
		voiceProfileId: '',
	},
	schoolgirl: {
		name: 'schoolgirl',
		displayName: 'Schoolgirl',
		defaultWidth: 260,
		defaultHeight: 360,
		voiceProfileId: '',
	},
	scientist: {
		name: 'scientist',
		displayName: 'Scientist',
		defaultWidth: 270,
		defaultHeight: 370,
		voiceProfileId: '',
	},
	villain: {
		name: 'villain',
		displayName: 'Villain',
		defaultWidth: 300,
		defaultHeight: 380,
		voiceProfileId: '',
	},
};

export const normalizeCharacterName = (name: string): string => {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};
