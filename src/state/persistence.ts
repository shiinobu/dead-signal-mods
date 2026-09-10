import type { RuntimeState } from "./domain-state.js";

/** Current persisted save schema version. */
export const CURRENT_SAVE_SCHEMA_VERSION = 1 as const;

export type SaveSchemaVersion = typeof CURRENT_SAVE_SCHEMA_VERSION;

/**
 * Stable, versioned representation of runtime state at a persistence boundary.
 * The runtime state itself remains owned by StateStore.
 */
export interface PersistedState {
    readonly schemaVersion: SaveSchemaVersion;
    readonly state: RuntimeState;
}
