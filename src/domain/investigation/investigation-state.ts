import type { InvestigationId } from "../../core/index.js";

export interface InvestigationState {
    readonly activeInvestigationId: InvestigationId | null;
    readonly discoveredLeadIds: readonly string[];
    readonly completedInvestigationIds: readonly InvestigationId[];
}
