import type { EntityId } from "../../core/index.js";

export type EntityKind =
    | "person"
    | "organization"
    | "system"
    | "location"
    | "device";

export interface Entity {
    readonly id: EntityId;
    readonly kind: EntityKind;
    readonly name: string;
    readonly description: string;
}