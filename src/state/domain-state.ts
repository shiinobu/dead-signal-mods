import type {
    AccessState,
    CharacterState,
    DatabaseState,
    DialogueState,
    EconomyState,
    EndingState,
    EntityState,
    EvidenceState,
    HackingState,
    InvestigationState,
    NarrativeState,
    ProgressionState,
    QuestState,
    RelationshipState,
    RewardState,
    TerminalState,
} from "../domain/index.js";

import type { FlagRecord } from "../domain/shared/index.js";

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
    readonly economy: EconomyState;
    readonly progression: ProgressionState;
    readonly narrative: NarrativeState;
    readonly reward: RewardState;
    readonly ending: EndingState;
}

export interface RuntimeState {
    readonly flags: FlagRecord;
    readonly domain: DomainState;
}
