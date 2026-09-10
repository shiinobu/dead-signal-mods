import type { EvidenceId } from "../../core/index.js";

export interface EvidenceState {
    readonly discoveredEvidenceIds: readonly EvidenceId[];
}