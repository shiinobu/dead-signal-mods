import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    QuestService,
} from "../src/application/index.js";

import {
    ConditionEvaluator,
} from "../src/domain/shared/index.js";

import {
    DomainStateAccess,
    FlagStore,
    StateStore,
    createDefaultRuntimeState,
} from "../src/state/index.js";

import {
    Q14_THE_OWNER,
} from "../src/content/index.js";

const createFixture = () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );
    const flagStore = new FlagStore(stateStore);
    const domainState = new DomainStateAccess(stateStore);
    const conditionEvaluator = new ConditionEvaluator(
        flagStore,
    );
    const service = new QuestService(
        domainState,
        conditionEvaluator,
    );

    return {
        stateStore,
        flagStore,
        domainState,
        service,
    };
};

const setRequiredQ14State = (flagStore: FlagStore): void => {
    flagStore.set(
        "dead_signal.q14.override_access_registry_found",
        true,
    );
    flagStore.set(
        "dead_signal.q14.access_window_found",
        true,
    );
    flagStore.set(
        "dead_signal.q14.marcus_access_approval_confirmed",
        true,
    );
    flagStore.set(
        "dead_signal.q14.marcus_reed_confirmed",
        true,
    );
    flagStore.set(
        "dead_signal.marcus_introduced",
        true,
    );
    flagStore.set(
        "dead_signal.marcus_authority_confirmed",
        true,
    );
    flagStore.set(
        "dead_signal.q14.operator_identity_unknown",
        true,
    );
};

describe("Phase 13 Step 13.3 — Q14 source-backed slice", () => {
    it("starts from an incomplete Q14 state", () => {
        const { service } = createFixture();

        assert.equal(
            service.areObjectivesComplete(Q14_THE_OWNER),
            false,
        );
    });

    it("uses recovered persistent state for every required Q14 objective", () => {
        const { flagStore, service } = createFixture();

        setRequiredQ14State(flagStore);

        assert.equal(
            service.areObjectivesComplete(Q14_THE_OWNER),
            true,
        );
    });

    it("treats the recovered access-justification objective as optional", () => {
        const optionalObjective = Q14_THE_OWNER.objectives.find(
            (objective) => objective.id === "q14.objective.07",
        );

        assert.equal(optionalObjective?.optional, true);

        const { flagStore, service } = createFixture();
        setRequiredQ14State(flagStore);

        assert.equal(
            flagStore.has("dead_signal.q14.exception_access_found"),
            false,
        );
        assert.equal(
            service.areObjectivesComplete(Q14_THE_OWNER),
            true,
        );

        flagStore.set(
            "dead_signal.q14.exception_access_found",
            true,
        );

        assert.equal(
            service.areObjectivesComplete(Q14_THE_OWNER),
            true,
        );
    });

    it("does not create negative Marcus/operator states", () => {
        const { flagStore } = createFixture();

        assert.equal(
            flagStore.has("dead_signal.q14.marcus_operated_account"),
            false,
        );
        assert.equal(
            flagStore.has("dead_signal.q14.marcus_created_false_connection"),
            false,
        );
        assert.equal(
            flagStore.has("dead_signal.q14.marcus_manipulated_cri"),
            false,
        );
        assert.equal(
            flagStore.has("dead_signal.q14.marcus_targeted_rizky"),
            false,
        );
        assert.equal(
            flagStore.has("dead_signal.q14.marcus_malicious_intent"),
            false,
        );
        assert.equal(
            flagStore.has("dead_signal.q14.operator_person_identified"),
            false,
        );
    });
});
