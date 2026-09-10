import type { PersistedState } from "./persistence.js";
import {
    CURRENT_SAVE_SCHEMA_VERSION,
} from "./persistence.js";
import type { RuntimeState } from "./domain-state.js";
import { StateValidator } from "./state-validator.js";

export class StateSerializer {
    constructor(
        private readonly validator: StateValidator = new StateValidator(),
    ) {}

    serialize(state: RuntimeState): string {
        this.validator.assertValid(state);

        const persistedState: PersistedState = {
            schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
            state,
        };

        return JSON.stringify(persistedState);
    }

    deserialize(serialized: string): PersistedState {
        const parsed: unknown = JSON.parse(serialized);

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            throw new Error("Invalid persisted state payload.");
        }

        const candidate = parsed as Record<string, unknown>;

        if (candidate.schemaVersion !== CURRENT_SAVE_SCHEMA_VERSION) {
            throw new Error("Unsupported persisted state schema version.");
        }

        this.validator.assertValid(candidate.state);

        return {
            schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
            state: candidate.state,
        };
    }
}
