import type { InvestigationId } from "../../core/index.js";

export interface Investigation {
    readonly id: InvestigationId;
    readonly chapterId: string;
    readonly title: string;
    readonly description: string;
    readonly leadIds: readonly string[];
}
