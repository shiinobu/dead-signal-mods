import test from "node:test";
import assert from "node:assert/strict";

import {
    asId,
    type CharacterId,
} from "../src/core/index.js";
import {
    GameRuntime,
} from "../src/application/index.js";
import {
    type Quest,
} from "../src/domain/quest/index.js";
import {
    type SaveStorage,
} from "../src/state/index.js";

class SharedSaveStorage implements SaveStorage {
    private serializedState: string | null = null;

    write(serializedState: string): void {
        this.serializedState = serializedState;
    }

    read(): string | null {
        return this.serializedState;
    }
}

const quest: Quest = {
    id: asId("quest.integration"),
    chapterId: "01",
    title: "Integration Quest",
    description: "Exercise the canonical runtime state across services.",
    objectives: [
        {
            id: "objective.integration",
            description: "Start the mission.",
            condition: {
                kind: "flag_equals",
                flag: "mission_started",
                value: true,
            },
        },
    ],
};

const actorId = asId<CharacterId>("character.marcus");

test("GameRuntime integrates quest, access, reward, economy, and persistence through canonical state", () => {
    const storage = new SharedSaveStorage();
    const first = new GameRuntime(undefined, undefined, storage);

    first.flagStore.set("mission_started", true);
    first.quest.start(quest);
    assert.equal(first.quest.complete(quest), true);

    first.reward.claim({
        id: asId("reward.integration"),
        kind: "experience",
        amount: 100,
    });

    first.economy.applyMissionReward(
        {
            id: asId("mission-reward.integration"),
            questId: quest.id,
            amount: 500,
            rewardIndex: 0,
        },
        "completion.integration",
        "2026-09-11T00:00:00.000Z",
    );

    first.access.grant({
        id: asId("access.integration"),
        actorId,
        capability: "OVERRIDE_OPERATOR",
    });

    assert.equal(first.persistence.save().state.flags.mission_started, true);
    assert.equal(first.economy.getBalance(), 500);
    assert.equal(first.reward.hasClaimed(asId("reward.integration")), true);
    assert.equal(first.access.hasCapability(actorId, "OVERRIDE_OPERATOR"), true);

    const second = new GameRuntime(undefined, undefined, storage);

    assert.notEqual(second.stateStore.getState(), first.stateStore.getState());
    assert.equal(second.persistence.load(), true);

    assert.deepEqual(second.stateStore.getState(), first.stateStore.getState());
    assert.equal(second.quest.isCompleted(quest), true);
    assert.equal(second.economy.getBalance(), 500);
    assert.equal(second.reward.hasClaimed(asId("reward.integration")), true);
    assert.equal(second.access.hasCapability(actorId, "OVERRIDE_OPERATOR"), true);
    assert.equal(second.flagStore.get("mission_started"), true);
});

test("failed quest remains failed after save and load and cannot complete later", () => {
    const storage = new SharedSaveStorage();
    const first = new GameRuntime(undefined, undefined, storage);

    first.quest.start(quest);
    assert.equal(first.quest.fail(quest), true);
    first.persistence.save();

    const second = new GameRuntime(undefined, undefined, storage);
    assert.equal(second.persistence.load(), true);

    assert.equal(second.quest.isFailed(quest), true);
    assert.equal(second.quest.isActive(quest), false);
    assert.equal(second.quest.complete(quest), false);
});
