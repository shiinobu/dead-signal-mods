import type { QuestId } from "../../core/index.js";

import type {
    QuestObjective,
} from "./quest-objective.js";

export interface Quest {
    readonly id: QuestId;
    readonly chapterId: string;
    readonly title: string;
    readonly description: string;
    readonly objectives: readonly QuestObjective[];
}