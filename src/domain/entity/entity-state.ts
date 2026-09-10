import type { EntityId } from "../../core/index.js";

export interface EntityState {
    readonly discoveredEntityIds: readonly EntityId[];
}