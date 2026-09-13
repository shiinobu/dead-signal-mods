import {
    SaveStorage as HackHubSaveStorage,
} from "@hotbunny/hackhub-content-sdk";

import {
    GameRuntime,
} from "../../application/index.js";

import type {
    SaveStorage,
} from "../../state/index.js";

const RUNTIME_STATE_KEY = "entity_resolution.runtime_state";

class SaveStorageAdapter implements SaveStorage {
    write(serializedState: string): void {
        HackHubSaveStorage.set(
            RUNTIME_STATE_KEY,
            serializedState,
        );
    }

    read(): string | null {
        return (
            HackHubSaveStorage.get<string>(
                RUNTIME_STATE_KEY,
            ) ?? null
        );
    }
}

/**
 * Production ENTITY RESOLUTION runtime composition root.
 *
 * HackHub SaveStorage is only the persistence transport. Canonical runtime
 * state remains owned by GameRuntime -> StateStore, not by the SDK storage
 * namespace itself.
 */
export const gameRuntime = new GameRuntime(
    undefined,
    undefined,
    new SaveStorageAdapter(),
);
