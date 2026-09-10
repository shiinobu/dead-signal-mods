import type { EvidenceId } from "../../core/index.js";

export type EvidenceKind =
    | "document"
    | "message"
    | "log"
    | "transaction"
    | "media"
    | "system";

export interface Evidence {
    readonly id: EvidenceId;
    readonly kind: EvidenceKind;
    readonly title: string;
    readonly description: string;
}