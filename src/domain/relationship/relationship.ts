import type {
    CharacterId,
    RelationshipId,
} from "../../core/index.js";

export type RelationshipKind =
    | "ally"
    | "associate"
    | "employer"
    | "employee"
    | "target"
    | "contact"
    | "unknown";

export interface Relationship {
    readonly id: RelationshipId;
    readonly sourceCharacterId: CharacterId;
    readonly targetCharacterId: CharacterId;
    readonly kind: RelationshipKind;
    readonly description: string;
}