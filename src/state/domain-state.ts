import type {
    AccessState,
    DialogueState,
    EndingState,
    InvestigationState,
    NarrativeState,
    ProgressionState,
    QuestState,
    RewardState,
    EntityState,
    EvidenceState
} from "../domain/index.js";

import type {
    FlagRecord,
} from "../domain/shared/index.js";

export interface DomainState {
    readonly quests: QuestState;
    readonly investigation: InvestigationState;
    readonly evidence: EvidenceState;
    readonly entity: EntityState;
    readonly relationships: Readonly<Record<string, unknown>>;
    readonly dialogue: DialogueState;
    readonly terminal: Readonly<Record<string, unknown>>;
    readonly database: Readonly<Record<string, unknown>>;
    readonly hacking: Readonly<Record<string, unknown>>;
    readonly access: AccessState;
    readonly economy: Readonly<Record<string, unknown>>;
    readonly progression: ProgressionState;
    readonly narrative: NarrativeState;
    readonly reward: RewardState;
    readonly ending: EndingState;
}

export interface RuntimeState {
    readonly flags: FlagRecord;
    readonly domain: DomainState;
}
