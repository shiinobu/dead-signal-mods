import type {
    FlagKey,
    FlagValue,
} from "../domain/shared/index.js";

import type { StateStore } from "./state-store.js";

export class FlagStore {
    constructor(
        private readonly stateStore: StateStore,
    ) {}

    get<T extends FlagValue>(key: FlagKey): T | undefined {
        return this.stateStore.getState().flags[key] as T | undefined;
    }

    has(key: FlagKey): boolean {
        return Object.prototype.hasOwnProperty.call(
            this.stateStore.getState().flags,
            key,
        );
    }

    set(key: FlagKey, value: FlagValue): void {
        this.stateStore.updateState((current) => ({
            ...current,
            flags: {
                ...current.flags,
                [key]: value,
            },
        }));
    }

    delete(key: FlagKey): void {
        this.stateStore.updateState((current) => {
            if (!Object.prototype.hasOwnProperty.call(current.flags, key)) {
                return current;
            }

            const flags = { ...current.flags };
            delete flags[key];

            return {
                ...current,
                flags,
            };
        });
    }

    clear(): void {
        this.stateStore.updateState((current) => ({
            ...current,
            flags: {},
        }));
    }
}