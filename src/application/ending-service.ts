import type {
    Ending,
    EndingState,
} from "../domain/index.js";

import type {
    ConditionEvaluator,
} from "../domain/shared/index.js";

import type {
    DomainStateAccess,
} from "../state/index.js";

export class EndingService {
    constructor(
        private readonly domainState: DomainStateAccess,
        private readonly conditionEvaluator: ConditionEvaluator,
    ) {}

    getState(): EndingState {
        return this.domainState.get().ending;
    }

    resolve(endings: readonly Ending[]): string | null {
        const current = this.domainState.get().ending;

        if (current.resolved) {
            return current.endingId;
        }

        const ending = endings.find((candidate) =>
            this.conditionEvaluator.evaluate(
                candidate.condition,
            ),
        );

        if (ending === undefined) {
            return null;
        }

        this.domainState.update((state) => ({
            ...state,
            ending: {
                endingId: ending.id,
                resolved: true,
            },
        }));

        return ending.id;
    }

    isResolved(): boolean {
        return this.domainState
            .get()
            .ending
            .resolved;
    }

    getEndingId(): string | null {
        return this.domainState
            .get()
            .ending
            .endingId;
    }
}