import {
    ConditionEvaluator,
} from "../domain/shared/index.js";

import {
    createDefaultRuntimeState,
    DomainStateAccess,
    FlagStore,
    StateStore,
} from "../state/index.js";

export interface RuntimeServices {
    readonly narrativeState: NarrativeStateService;
    readonly ending: EndingService;
    readonly access: AccessService;
    readonly reward: RewardService;
}

export interface NarrativeStateService {
    readonly kind: "narrative-state";
}

export interface EndingService {
    readonly kind: "ending";
}

export interface AccessService {
    readonly kind: "access";
}

export interface RewardService {
    readonly kind: "reward";
}

export class GameRuntime {
    readonly stateStore: StateStore;
    readonly flagStore: FlagStore;
    readonly domainState: DomainStateAccess;
    readonly conditionEvaluator: ConditionEvaluator;

    readonly narrativeState: NarrativeStateService;
    readonly ending: EndingService;
    readonly access: AccessService;
    readonly reward: RewardService;

    constructor(
        stateStore: StateStore = new StateStore(
            createDefaultRuntimeState(),
        ),
        services: RuntimeServices = createDefaultRuntimeServices(),
    ) {
        this.stateStore = stateStore;
        this.flagStore = new FlagStore(stateStore);
        this.domainState = new DomainStateAccess(stateStore);
        this.conditionEvaluator = new ConditionEvaluator(
            this.flagStore,
        );

        this.narrativeState = services.narrativeState;
        this.ending = services.ending;
        this.access = services.access;
        this.reward = services.reward;
    }
}

const createDefaultRuntimeServices = (): RuntimeServices => ({
    narrativeState: {
        kind: "narrative-state",
    },
    ending: {
        kind: "ending",
    },
    access: {
        kind: "access",
    },
    reward: {
        kind: "reward",
    },
});