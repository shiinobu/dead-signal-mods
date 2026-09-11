import {
    UI,
} from "@hotbunny/hackhub-content-sdk";

import {
    asId,
} from "../../core/index.js";
import type {
    AccessGrant,
    Reward,
} from "../../domain/index.js";
import { GameRuntime } from "../../application/game-runtime.js";
import { HackHubSaveStorageAdapter } from "./save-storage-adapter.js";

const RUNTIME_NAMESPACE = "dead-signal.phase12.runtime-services";
const ACTOR_ID = asId<"Character">("marcus");
const GRANT_ID = asId<"AccessGrant">("phase12-smoke-override-operator");
const REWARD_ID = asId<"Reward">("phase12-smoke-experience");

export function runRuntimeServicesSmokeTest(): void {
    const storage = new HackHubSaveStorageAdapter(RUNTIME_NAMESPACE);

    try {
        const runtime = new GameRuntime(undefined, undefined, storage);
        const grant: AccessGrant = {
            id: GRANT_ID,
            actorId: ACTOR_ID,
            capability: "OVERRIDE_OPERATOR",
        };
        const reward: Reward = {
            id: REWARD_ID,
            kind: "experience",
            amount: 250,
        };

        runtime.access.grant(grant);
        runtime.access.grant(grant);

        if (!runtime.access.hasCapability(ACTOR_ID, "OVERRIDE_OPERATOR")) {
            throw new Error("AccessService grant was not persisted in runtime state.");
        }

        if (runtime.access.getGrants().length !== 1) {
            throw new Error("AccessService created a duplicate grant.");
        }

        if (!runtime.reward.claim(reward)) {
            throw new Error("RewardService rejected the first reward claim.");
        }

        if (runtime.reward.claim(reward)) {
            throw new Error("RewardService allowed the same reward to be claimed twice.");
        }

        if (runtime.reward.hasClaimed(REWARD_ID) !== true) {
            throw new Error("RewardService did not record the claimed reward.");
        }

        if (runtime.stateStore.getState().domain.progression.experience !== 250) {
            throw new Error("RewardService wrote an unexpected experience total.");
        }

        runtime.persistence.save();

        const restoredRuntime = new GameRuntime(undefined, undefined, storage);

        if (!restoredRuntime.persistence.load()) {
            throw new Error("Runtime service persistence load returned false.");
        }

        if (!restoredRuntime.access.hasCapability(ACTOR_ID, "OVERRIDE_OPERATOR")) {
            throw new Error("Access grant did not survive SaveStorage restore.");
        }

        if (!restoredRuntime.reward.hasClaimed(REWARD_ID)) {
            throw new Error("Claimed reward did not survive SaveStorage restore.");
        }

        if (restoredRuntime.stateStore.getState().domain.progression.experience !== 250) {
            throw new Error("Progression experience did not survive SaveStorage restore.");
        }

        UI.notify("DEAD SIGNAL Phase 12: Reward + Access + persistence PASS");
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : String(error);

        console.error("[DEAD SIGNAL] Phase 12 runtime services smoke test failed", error);
        UI.notify(`DEAD SIGNAL Phase 12: Reward + Access FAILED: ${message}`);
    }
}
