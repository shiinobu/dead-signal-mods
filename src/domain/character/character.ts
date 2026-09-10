import type { CharacterId } from "../../core/index.js";

export interface Character {
    readonly id: CharacterId;
    readonly name: string;
    readonly description: string;
}