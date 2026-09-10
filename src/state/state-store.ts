import type { RuntimeState } from "./domain-state.js";

export class StateStore {
    private state: RuntimeState;

    constructor(initialState: RuntimeState) {
        this.state = initialState;
    }

    getState(): RuntimeState {
        return this.state;
    }

    replaceState(state: RuntimeState): void {
        this.state = state;
    }

    updateState(
        updater: (current: RuntimeState) => RuntimeState,
    ): void {
        this.state = updater(this.state);
    }
}