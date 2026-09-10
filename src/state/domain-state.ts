import type {
    AccessState,
    DialogueState,
    NarrativeState,
} from "../domain/index.js";

import type {
    FlagRecord,
} from "../domain/shared/index.js";

export interface DomainState {
    readonly quests: Readonly<Record<string, unknown>>;
    readonly investigation: Readonly<Record<string, unknown>>;
    readonly evidence: Readonly<Record<string, unknown>>;
    readonly entities: Readonly<Record<string, unknown>>;
    readonly relationships: Readonly<Record<string, unknown>>;
    readonly dialogue: DialogueState;
    readonly terminal: Readonly<Record<string, unknown>>;
    readonly database: Readonly<Record<string, unknown>>;
    readonly hacking: Readonly<Record<string, unknown>>;
    readonly access: AccessState;
    readonly economy: Readonly<Record<string, unknown>>;
    readonly progression: Readonly<Record<string, unknown>>;
    readonly narrative: NarrativeState;
    readonly ending: Readonly<Record<string, unknown>>;
}

export interface RuntimeState {
    readonly flags: FlagRecord;
    readonly domain: DomainState;
}