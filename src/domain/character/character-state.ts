import type { CharacterId } from "../../core/index.js";

export interface CharacterState {
    readonly discoveredCharacterIds: readonly CharacterId[];
}