import type { ConditionNode } from "../shared/index.js";

export interface QuestObjective {
    readonly id: string;
    readonly description: string;
    readonly condition: ConditionNode;
}