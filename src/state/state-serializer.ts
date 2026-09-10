import type { PersistedState } from "./persistence.js";
import {
    CURRENT_SAVE_SCHEMA_VERSION,
} from "./persistence.js";
import type { RuntimeState } from "./domain-state.js";

export class StateSerializer {
    serialize(state: RuntimeState): string {
        const persistedState: PersistedState = {
            schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
            state,
        };

        return JSON.stringify(persistedState);
    }

    deserialize(serialized: string): PersistedState {
        const parsed: unknown = JSON.parse(serialized);

        if (!this.isPersistedState(parsed)) {
            throw new Error("Invalid persisted state payload.");
        }

        return parsed;
    }

    private isPersistedState(
        value: unknown,
    ): value is PersistedState {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        const candidate = value as Record<string, unknown>;

        return (
            candidate.schemaVersion ===
                CURRENT_SAVE_SCHEMA_VERSION &&
            typeof candidate.state === "object" &&
            candidate.state !== null
        );
    }
}
