import test from "node:test";
import assert from "node:assert/strict";

import {
    createDefaultRuntimeState,
    FlagStore,
    StateStore,
} from "../src/state/index.js";

test("StateStore owns the canonical runtime state", () => {
    const initialState = createDefaultRuntimeState();
    const stateStore = new StateStore(initialState);

    assert.deepEqual(
        stateStore.getState(),
        {
            flags: {},
        },
    );
});

test("FlagStore reads and writes through StateStore", () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );

    const flagStore = new FlagStore(stateStore);

    flagStore.set("mission_started", true);

    assert.equal(
        flagStore.get<boolean>("mission_started"),
        true,
    );

    assert.equal(
        stateStore.getState().flags.mission_started,
        true,
    );
});

test("FlagStore does not lose existing flags when setting another flag", () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );

    const flagStore = new FlagStore(stateStore);

    flagStore.set("mission_started", true);
    flagStore.set("evidence_found", 3);

    assert.deepEqual(
        stateStore.getState().flags,
        {
            mission_started: true,
            evidence_found: 3,
        },
    );
});

test("FlagStore can delete a flag", () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );

    const flagStore = new FlagStore(stateStore);

    flagStore.set("mission_started", true);

    assert.equal(
        flagStore.has("mission_started"),
        true,
    );

    flagStore.delete("mission_started");

    assert.equal(
        flagStore.has("mission_started"),
        false,
    );
});

test("FlagStore clear removes all flags", () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );

    const flagStore = new FlagStore(stateStore);

    flagStore.set("mission_started", true);
    flagStore.set("evidence_found", 3);

    flagStore.clear();

    assert.deepEqual(
        stateStore.getState().flags,
        {},
    );
});

test("StateStore updateState replaces state atomically", () => {
    const stateStore = new StateStore(
        createDefaultRuntimeState(),
    );

    const previousState = stateStore.getState();

    stateStore.updateState((current) => ({
        ...current,
        flags: {
            ...current.flags,
            mission_started: true,
        },
    }));

    const nextState = stateStore.getState();

    assert.notEqual(nextState, previousState);

    assert.equal(
        nextState.flags.mission_started,
        true,
    );

    assert.deepEqual(previousState, {
        flags: {},
    });
});