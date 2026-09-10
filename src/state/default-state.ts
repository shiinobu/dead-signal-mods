import type {
    DomainState,
    RuntimeState,
} from "./domain-state.js";

const createEmptyDomainState = (): DomainState => ({
    quests: {},
    investigation: {},
    evidence: {},
    entities: {},
    relationships: {},
    dialogue: {},
    terminal: {},
    database: {},
    hacking: {},
    access: {},
    economy: {},
    progression: {},
    narrative: {},
    ending: {},
});

export const createDefaultRuntimeState = (): RuntimeState => ({
    flags: {},
    domain: createEmptyDomainState(),
});