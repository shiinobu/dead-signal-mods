import type { InvestigationId } from "../../core/index.js";

export interface InvestigationLead {
    readonly id: string;
    readonly investigationId: InvestigationId;
    readonly title: string;
    readonly description: string;
}
