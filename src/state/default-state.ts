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
    evidence: {
        discoveredEvidenceIds: [],
    },
    entity: {
        discoveredEntityIds: [],
    },
    character: {
        discoveredCharacterIds: [],
    },
    relationships: {
        discoveredRelationshipIds: [],
    },
    dialogue: {
        activeDialogueId: null,
        activeNodeId: null,
        history: [],
    },
    terminal: {
        discoveredTerminalIds: [],
    },
    database: {
        discoveredDatabaseIds: [],
    },
    hacking: {
        activeAttemptId: null,
        completedAttemptIds: [],
    },
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
