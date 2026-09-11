import type { ConditionNode } from "../shared/index.js";

export interface QuestObjective {
    readonly id: string;
    readonly description: string;
    readonly condition: ConditionNode;
    /**
     * Optional objectives are completion-independent. Their completion may
     * grant optional rewards, but they must not block quest completion.
     *
     * Default behavior remains required when omitted.
     */
    readonly optional?: boolean;
}
