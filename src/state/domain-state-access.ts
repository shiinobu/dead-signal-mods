import type { StateStore } from "./state-store.js";
import type { DomainState } from "./domain-state.js";

export class DomainStateAccess {
    constructor(
        private readonly stateStore: StateStore,
    ) {}

    get(): DomainState {
        return this.stateStore.getState().domain;
    }

    replace(domain: DomainState): void {
        this.stateStore.updateState((current) => ({
            ...current,
            domain,
        }));
    }

    update(
        updater: (current: DomainState) => DomainState,
    ): void {
        this.stateStore.updateState((current) => ({
            ...current,
            domain: updater(current.domain),
        }));
    }
}