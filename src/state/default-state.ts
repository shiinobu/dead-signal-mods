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
    dialogue: {
        activeDialogueId: null,
        activeNodeId: null,
        history: [],
    },
    terminal: {},
    database: {},
    hacking: {},
    access: {
        grants: {}
    },
    economy: {},
    progression: {},
    narrative: {
        chapterId: null,
        sceneId: null,
        completedChapterIds: [],
    },
    ending: {},
});

export const createDefaultRuntimeState = (): RuntimeState => ({
    flags: {},
    domain: createEmptyDomainState(),
});