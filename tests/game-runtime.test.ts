import assert from "node:assert/strict";
import test from "node:test";

import {
    GameRuntime,
} from "../src/application/index.js";

test("GameRuntime creates canonical runtime state", () => {
    const runtime = new GameRuntime();

    assert.deepEqual(runtime.stateStore.getState().flags, {});
    assert.deepEqual(
        runtime.domainState.get().quests,
        {},
    );
});

test("GameRuntime wires FlagStore to the canonical StateStore", () => {
    const runtime = new GameRuntime();

    runtime.flagStore.set("test.flag", true);

    assert.equal(
        runtime.stateStore.getState().flags["test.flag"],
        true,
    );
});

test("GameRuntime exposes the canonical ConditionEvaluator", () => {
    const runtime = new GameRuntime();

    runtime.flagStore.set("test.flag", true);

    assert.equal(
        runtime.conditionEvaluator.evaluate({
            kind: "flag",
            key: "test.flag",
            equals: true,
        }),
        true,
    );
});

test("GameRuntime owns all required runtime services", () => {
    const runtime = new GameRuntime();

    assert.equal(runtime.narrativeState.kind, "narrative-state");
    assert.equal(runtime.ending.kind, "ending");
    assert.equal(runtime.access.kind, "access");
    assert.equal(runtime.reward.kind, "reward");
});