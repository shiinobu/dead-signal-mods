import {
    ConditionEvaluator,
} from "../domain/shared/index.js";

import {
    createDefaultRuntimeState,
    DomainStateAccess,
    FlagStore,
    SaveLoadService,
    SaveStorage,
    StateSerializer,
    StateStore,
} from "../state/index.js";

import {
    AccessService,
} from "./access-service.js";

import {
    EconomyService,
} from "./economy-service.js";

import {
    NarrativeStateService,
} from "./narrative-state-service.js";

import {
    RewardService,
} from "./reward-service.js";

import {
    EndingService,
} from "./ending-service.js";

import {
    QuestService,
} from "./quest-service.js";

export interface RuntimeServices {
    readonly quest: QuestService;
    readonly narrativeState: NarrativeStateService;
    readonly ending: EndingService;
    readonly access: AccessService;
    readonly reward: RewardService;
    readonly economy: EconomyService;
}

export class GameRuntime {
    readonly stateStore: StateStore;
    readonly flagStore: FlagStore;
    readonly domainState: DomainStateAccess;
    readonly conditionEvaluator: ConditionEvaluator;
    readonly persistence: SaveLoadService;

    readonly narrativeState: NarrativeStateService;
    readonly ending: EndingService;
    readonly access: AccessService;
    readonly reward: RewardService;
    readonly quest: QuestService;
    readonly economy: EconomyService;

    constructor(
        stateStore: StateStore = new StateStore(
            createDefaultRuntimeState(),
        ),
        services?: RuntimeServices,
        storage: SaveStorage = new InMemorySaveStorage(),
    ) {
        this.stateStore = stateStore;
        this.flagStore = new FlagStore(stateStore);
        this.domainState = new DomainStateAccess(stateStore);
        this.conditionEvaluator = new ConditionEvaluator(
            this.flagStore,
        );
        this.persistence = new SaveLoadService(
            stateStore,
            new StateSerializer(),
            storage,
        );

        const runtimeServices =
            services ??
            createDefaultRuntimeServices(
                this.domainState,
                this.conditionEvaluator,
            );

        this.quest = runtimeServices.quest;
        this.narrativeState =
            runtimeServices.narrativeState;
        this.ending = runtimeServices.ending;
        this.access = runtimeServices.access;
        this.reward = runtimeServices.reward;
        this.economy = runtimeServices.economy;
    }
}

class InMemorySaveStorage implements SaveStorage {
    private serializedState: string | null = null;

    write(serializedState: string): void {
        this.serializedState = serializedState;
    }

    read(): string | null {
        return this.serializedState;
    }
}

const createDefaultRuntimeServices = (
    domainState: DomainStateAccess,
    conditionEvaluator: ConditionEvaluator,
): RuntimeServices => ({
    quest: new QuestService(
        domainState,
        conditionEvaluator,
    ),

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

    economy: new EconomyService(
        domainState,
    ),
});