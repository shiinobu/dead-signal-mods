import type { RelationshipId } from "../../core/index.js";

export interface RelationshipState {
    readonly discoveredRelationshipIds: readonly RelationshipId[];
}