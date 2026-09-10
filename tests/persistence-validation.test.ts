import test from "node:test";
import assert from "node:assert/strict";

import {
    createDefaultRuntimeState,
    SaveLoadService,
    StateSerializer,
    StateStore,
    type SaveStorage,
} from "../src/state/index.js";

class TestSaveStorage implements SaveStorage {
    private serializedState: string | null = null;

    write(serializedState: string): void {
        this.serializedState = serializedState;
    }

    read(): string | null {
        return this.serializedState;
    }
}

const createPayload = () => ({
    schemaVersion: 1,
    state: createDefaultRuntimeState(),
});

test("serializer rejects an unsupported save schema version", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    payload.schemaVersion = 999;

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Unsupported persisted state schema version/,
    );
});

test("serializer rejects a missing runtime state", () => {
    const serializer = new StateSerializer();

    assert.throws(
        () => serializer.deserialize(JSON.stringify({ schemaVersion: 1 })),
        /Invalid runtime state payload|Invalid persisted state payload/,
    );
});

test("serializer rejects invalid flag values", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    payload.state.flags.invalid = { nested: true } as never;

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Invalid runtime state payload/,
    );
});

test("serializer rejects incomplete domain state", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    delete (payload.state.domain as Record<string, unknown>).quests;

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Invalid runtime state payload/,
    );
});

test("serializer rejects invalid economy balance", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    payload.state.domain.economy = {
        ...payload.state.domain.economy,
        balance: -1,
    };

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Invalid runtime state payload/,
    );
});

test("serializer rejects an unresolved ending with an ending ID", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    payload.state.domain.ending = {
        endingId: "ending.test",
        resolved: false,
    };

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Invalid runtime state payload/,
    );
});

test("serializer rejects a resolved ending without an ending ID", () => {
    const serializer = new StateSerializer();
    const payload = createPayload();
    payload.state.domain.ending = {
        endingId: null,
        resolved: true,
    };

    assert.throws(
        () => serializer.deserialize(JSON.stringify(payload)),
        /Invalid runtime state payload/,
    );
});

test("load rejects an invalid save without replacing canonical state", () => {
    const stateStore = new StateStore(createDefaultRuntimeState());
    const storage = new TestSaveStorage();
    const service = new SaveLoadService(
        stateStore,
        new StateSerializer(),
        storage,
    );

    stateStore.updateState((state) => ({
        ...state,
        flags: {
            mission_started: true,
        },
    }));

    const before = stateStore.getState();
    const invalidPayload = createPayload();
    invalidPayload.state.domain.economy = {
        ...invalidPayload.state.domain.economy,
        balance: -500,
    };
    storage.write(JSON.stringify(invalidPayload));

    assert.throws(
        () => service.load(),
        /Invalid runtime state payload/,
    );
    assert.strictEqual(stateStore.getState(), before);
});
