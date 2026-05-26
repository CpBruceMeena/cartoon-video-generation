import type React from 'react';

import { ShinchanSVG } from './Shinchan';
import { DoraemonSVG } from './Doraemon';

// ─── Types ─────────────────────────────────────────────────────────────────

export type Expression = 'normal' | 'happy' | 'angry' | 'shocked' | 'thinking' | 'listening' | 'sad' | 'laughing';

export interface CharacterSVGProps {
	expression?: Expression;
	isSpeaking?: boolean;
	speakingFrame?: number;
}

export interface CharacterColors {
	primary: string;
	secondary: string;
	skin: string;
	subtitleBg: string;
	subtitleText: string;
	subtitleAccent: string;
}

export interface CharacterMeta {
	name: string;
	displayName: string;
	defaultWidth: number;
	defaultHeight: number;
	colors: CharacterColors;
	voiceProfileId: string;
	personality: string;
}

export type CharacterSvgComponent = React.FC<CharacterSVGProps>;

export interface CharacterEntry {
	meta: CharacterMeta;
	svg: CharacterSvgComponent;
}

// ─── Registry — single source of truth ─────────────────────────────────────

const SVG_MAP: Record<string, CharacterSvgComponent> = {
	shinchan: ShinchanSVG as CharacterSvgComponent,
	doraemon: DoraemonSVG as CharacterSvgComponent,
};

// Re-export individual SVGs for direct imports if needed
export {
	ShinchanSVG,
	DoraemonSVG,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const normalizeCharacterName = (name: string): string => {
	return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const getCharacterNames = (): string[] => {
	return Object.keys(SVG_MAP);
};

export const getCharacterSvg = (name: string): CharacterSvgComponent | undefined => {
	return SVG_MAP[normalizeCharacterName(name)];
};

export const getAllCharacters = (): Record<string, CharacterSvgComponent> => {
	return { ...SVG_MAP };
};

// ─── Metadata loaded from shared JSON registry ─────────────────────────────
//
// The registry.json is also read by the backend (Python) so both sides
// share the same source of truth for voice profiles, colors, etc.

import rawRegistry from './registry.json';

type RegistryData = {
	characters: Record<string, CharacterMeta>;
};

const registry: RegistryData = rawRegistry as RegistryData;

/**
 * Get full character metadata by name (case-insensitive, fuzzy).
 * Falls back to a sensible default if the character is unknown.
 */
export const getCharacterMeta = (name: string): CharacterMeta => {
	const key = normalizeCharacterName(name);
	const entry = registry.characters[key];
	if (entry) return entry;

	// Unknown character — build a sensible fallback
	return {
		name: name,
		displayName: name.charAt(0).toUpperCase() + name.slice(1),
		defaultWidth: 260,
		defaultHeight: 320,
		colors: {
			primary: '#666666',
			secondary: '#999999',
			skin: '#FFCC80',
			subtitleBg: 'rgba(0, 0, 0, 0.75)',
			subtitleText: '#ffffff',
			subtitleAccent: '#cccccc',
		},
		voiceProfileId: '',
		personality: `You are ${name}, a character in this story. Speak naturally.`,
	};
};

/**
 * Get all character metadata as a flat record.
 */
export const getAllCharacterMeta = (): Record<string, CharacterMeta> => {
	return { ...registry.characters };
};

/**
 * Get accent color for a character (used in Character.tsx wrapper).
 */
export const getCharacterColor = (name: string): string => {
	return getCharacterMeta(name).colors.primary;
};

/**
 * Get character display name.
 */
export const getCharacterDisplayName = (name: string): string => {
	return getCharacterMeta(name).displayName;
};

/**
 * Check if a character is known in the registry.
 */
export const isKnownCharacter = (name: string): boolean => {
	const key = normalizeCharacterName(name);
	return key in SVG_MAP || key in registry.characters;
};

// ─── Fallback: Subtitle colors for all known characters ────────────────────
//
// Used by Subtitle.tsx to color the speaker badge.
export const getSubtitleColors = (name: string): { bg: string; text: string; accent: string } => {
	const meta = getCharacterMeta(name);
	return {
		bg: meta.colors.subtitleBg,
		text: meta.colors.subtitleText,
		accent: meta.colors.subtitleAccent,
	};
};

// ─── Color constants (kept for backward compatibility with constants.ts) ───
//
// These are the same colors also stored per-character in registry.json.
export const COLORS = {
	Shinchan: {
		Shirt: '#E53935',
		Shorts: '#FDD835',
		Skin: '#FFCC80',
	},
	Doraemon: {
		Body: '#1E88E5',
		Belly: '#ffffff',
		Collar: '#E53935',
		Bell: '#FDD835',
	},
	Kasukabe: {
		Sky: '#87CEEB',
		Street: '#BDBDBD',
		House: '#FFFAF0',
	},
	Sunset: {
		Sky: 'linear-gradient(to bottom, #FF7E5F, #FEB47B)',
	},
};
