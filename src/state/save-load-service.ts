import type { PersistedState } from "./persistence.js";
import { StateSerializer } from "./state-serializer.js";
import { StateStore } from "./state-store.js";

export interface SaveStorage {
    write(serializedState: string): void;
    read(): string | null;
}

export class SaveLoadService {
    constructor(
        private readonly stateStore: StateStore,
        private readonly serializer: StateSerializer,
        private readonly storage: SaveStorage,
    ) {}

    save(): PersistedState {
        const serializedState = this.serializer.serialize(
            this.stateStore.getState(),
        );
        this.storage.write(serializedState);

        return this.serializer.deserialize(serializedState);
    }

    load(): boolean {
        const serializedState = this.storage.read();

        if (serializedState === null) {
            return false;
        }

        const persistedState = this.serializer.deserialize(serializedState);
        this.stateStore.replaceState(persistedState.state);

        return true;
    }
}
