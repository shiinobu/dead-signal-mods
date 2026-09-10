import {
    ConditionEvaluator,
} from "../domain/shared/index.js";

import {
    createDefaultRuntimeState,
    DomainStateAccess,
    FlagStore,
    StateStore,
} from "../state/index.js";

import {
    AccessService,
} from "./access-service.js";

import {
    NarrativeStateService,
} from "./narrative-state-service.js";

import {
    RewardService,
} from "./reward-service.js";

import {
    EndingService,
} from "./ending-service.js";

export interface RuntimeServices {
    readonly narrativeState: NarrativeStateService;
    readonly ending: EndingService;
    readonly access: AccessService;
    readonly reward: RewardService;
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
        services?: RuntimeServices,
    ) {
        this.stateStore = stateStore;
        this.flagStore = new FlagStore(stateStore);
        this.domainState = new DomainStateAccess(stateStore);
        this.conditionEvaluator = new ConditionEvaluator(
            this.flagStore,
        );

        const runtimeServices =
            services ??
            createDefaultRuntimeServices(
                this.domainState,
                this.conditionEvaluator,
            );

        this.narrativeState =
            runtimeServices.narrativeState;
        this.ending = runtimeServices.ending;
        this.access = runtimeServices.access;
        this.reward = runtimeServices.reward;
    }
}

const createDefaultRuntimeServices = (
    domainState: DomainStateAccess,
    conditionEvaluator: ConditionEvaluator,
): RuntimeServices => ({
    narrativeState: new NarrativeStateService(
        domainState,
    ),

    ending: new EndingService(
        domainState,
        conditionEvaluator,
    ),

    access: new AccessService(
        domainState,
    ),

    reward: new RewardService(
        domainState,
    ),
});