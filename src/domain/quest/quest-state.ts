import type { QuestId } from "../../core/index.js";

export interface QuestState {
    readonly activeQuestId: QuestId | null;
    readonly completedQuestIds: readonly QuestId[];
    readonly failedQuestIds: readonly QuestId[];
}