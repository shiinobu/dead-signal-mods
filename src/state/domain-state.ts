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
    EvidenceState,
    CharacterState,
    RelationshipState,
    DatabaseState,
    TerminalState,
    HackingState
} from "../domain/index.js";

import type {
    FlagRecord,
} from "../domain/shared/index.js";

export interface DomainState {
    readonly quests: QuestState;
    readonly investigation: InvestigationState;
    readonly evidence: EvidenceState;
    readonly entity: EntityState;
    readonly character: CharacterState;
    readonly relationships: RelationshipState;
    readonly dialogue: DialogueState;
    readonly terminal: TerminalState;
    readonly database: DatabaseState;
    readonly hacking: HackingState;
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
