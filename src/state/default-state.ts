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
    progression: {
        level: 1,
        experience: 0,
    },
    narrative: {
        chapterId: null,
        sceneId: null,
        completedChapterIds: [],
    },
    reward: {
        claimedRewardIds: [],
    },
    ending: {},
});

export const createDefaultRuntimeState = (): RuntimeState => ({
    flags: {},
    domain: createEmptyDomainState(),
});