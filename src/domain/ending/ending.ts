import type { ConditionNode } from "../shared/index.js";

export interface Ending {
    readonly id: string;
    readonly condition: ConditionNode;
}