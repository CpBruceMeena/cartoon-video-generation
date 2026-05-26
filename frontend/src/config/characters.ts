/**
 * @deprecated Import from '../characters/registry' instead.
 *
 * This file re-exports from the central character registry for backward
 * compatibility. All character data now lives in:
 *   - frontend/src/characters/registry.ts  (TypeScript, SVG imports)
 *   - frontend/src/characters/registry.json (JSON, readable by backend Python)
 *
 * New code should import directly from '../characters/registry'.
 */

import { getCharacterMeta, getAllCharacterMeta, normalizeCharacterName as _normalizeCharacterName, type CharacterMeta } from '../characters/registry';

export type { CharacterMeta } from '../characters/registry';

export const CHARACTER_DEFINITIONS: Record<string, CharacterMeta> = getAllCharacterMeta();

export const normalizeCharacterName = _normalizeCharacterName;
