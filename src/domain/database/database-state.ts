import type { DatabaseId } from "../../core/index.js";

export interface DatabaseState {
    readonly discoveredDatabaseIds: readonly DatabaseId[];
}