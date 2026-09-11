import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    QuestService,
} from "../src/application/index.js";

import {
    all,
    flagEquals,
    never,
    ConditionEvaluator,
} from "../src/domain/shared/index.js";

import {
    asId,
} from "../src/core/index.js";

import type {
    Quest,
} from "../src/domain/quest/index.js";

import {
    DomainStateAccess,
    FlagStore,
    StateStore,
    createDefaultRuntimeState,
} from "../src/state/index.js";

const Q14_ID = asId<"Quest">("dead_signal.q14");

const createQ14Slice = (): Quest => ({
    id: Q14_ID,
    chapterId: "04",
    title: "THE OWNER — source-backed slice",
    description: "Test-only executable slice for recovered Q14 state boundaries.",
    objectives: [
        {
            id: "q14.objective.01",
            description: "Find the access registry.",
            condition: flagEquals(
                "dead_signal.q14.override_access_registry_found",
                true,
            ),
        },
        {
            id: "q14.objective.02",
            description: "Trace the access window.",
            condition: flagEquals(
                "dead_signal.q14.override_session_found",
                true,
            ),
        },
        {
            id: "q14.objective.03",
            description: "Find the authorization. Source completion boundary is unresolved.",
            condition: never(),
        },
        {
            id: "q14.objective.04",
            description: "Resolve the approver.",
            condition: flagEquals(
                "dead_signal.q14.marcus_reed_confirmed",
                true,
            ),
        },
        {
            id: "q14.objective.05",
            description: "Speak to Marcus and confirm the authority context.",
            condition: all(
                flagEquals("dead_signal.marcus_introduced", true),
                flagEquals("dead_signal.marcus_authority_confirmed", true),
            ),
        },
        {
            id: "q14.objective.06",
            description: "Ask about the session. Source completion boundary is unresolved.",
            condition: never(),
        },
        {
            id: "q14.objective.07",
            description: "Check the access justification.",
            condition: flagEquals(
                "dead_signal.q14.exception_access_found",
                true,
            ),
        },
    ],
});

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

describe("Phase 13 Step 13.3 — Q14 source-backed slice", () => {
    it("starts from an incomplete Q14 state", () => {
        const { service } = createFixture();

        const quest = createQ14Slice();

        assert.equal(
            service.areObjectivesComplete(quest),
            false,
        );
    });

    it("satisfies only recovered direct objective boundaries", () => {
        const { flagStore, service } = createFixture();
        const quest = createQ14Slice();

        flagStore.set(
            "dead_signal.q14.override_access_registry_found",
            true,
        );
        flagStore.set(
            "dead_signal.q14.override_session_found",
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
            "dead_signal.q14.exception_access_found",
            true,
        );

        assert.equal(
            service.areObjectivesComplete(quest),
            false,
        );
    });

    it("keeps unresolved objectives as explicit blocking boundaries", () => {
        const { flagStore, service } = createFixture();
        const quest = createQ14Slice();

        for (const objective of quest.objectives) {
            const isUnresolved =
                objective.id === "q14.objective.03" ||
                objective.id === "q14.objective.06";

            if (isUnresolved) {
                assert.equal(
                    objective.condition.kind,
                    "never",
                );
            }
        }

        flagStore.set(
            "dead_signal.q14.override_access_registry_found",
            true,
        );

        assert.equal(
            service.areObjectivesComplete(quest),
            false,
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
