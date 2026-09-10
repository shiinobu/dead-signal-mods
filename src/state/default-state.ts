import type {
    DomainState,
    RuntimeState,
} from "./domain-state.js";

const createEmptyDomainState = (): DomainState => ({
    quests: {
        activeQuestId: null,
        completedQuestIds: [],
        failedQuestIds: [],
    },
    investigation: {
        activeInvestigationId: null,
        discoveredLeadIds: [],
        completedInvestigationIds: [],
    },
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
    ending: {
        endingId: null,
        resolved: false,
    },
});

export const createDefaultRuntimeState = (): RuntimeState => ({
    flags: {},
    domain: createEmptyDomainState(),
});
