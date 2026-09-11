import {
    UI,
} from "@hotbunny/hackhub-content-sdk";

import {
    flagEquals,
} from "../../domain/shared/index.js";
import type {
    Ending,
} from "../../domain/index.js";
import {
    GameRuntime,
} from "../../application/game-runtime.js";
import {
    HackHubSaveStorageAdapter,
} from "./save-storage-adapter.js";

const RUNTIME_NAMESPACE = "dead-signal.phase12.ending";
const ENDING_ID = "phase12-smoke-ending";
const ENDING_FLAG = "phase12.ending.smoke";

export function runEndingSmokeTest(): void {
    const storage = new HackHubSaveStorageAdapter(RUNTIME_NAMESPACE);
    const ending: Ending = {
        id: ENDING_ID,
        condition: flagEquals(ENDING_FLAG, true),
    };

    try {
        const runtime = new GameRuntime(undefined, undefined, storage);

        // Reset this dedicated probe namespace so every run exercises resolution,
        // not a previously persisted result from an earlier smoke test.
        runtime.persistence.save();

        const unresolved = runtime.ending.resolve([ending]);
        if (unresolved !== null) {
            throw new Error("EndingService resolved an ending before its condition matched.");
        }

        runtime.flagStore.set(ENDING_FLAG, true);

        const resolved = runtime.ending.resolve([ending]);
        if (resolved !== ENDING_ID) {
            throw new Error(`EndingService resolved unexpected ending: ${String(resolved)}.`);
        }

        if (!runtime.ending.isResolved()) {
            throw new Error("EndingService did not mark the ending as resolved.");
        }

        if (runtime.ending.getEndingId() !== ENDING_ID) {
            throw new Error("EndingService did not expose the resolved ending ID.");
        }

        const alternateEnding: Ending = {
            id: "phase12-smoke-ending-alternate",
            condition: flagEquals(ENDING_FLAG, true),
        };

        const secondResolve = runtime.ending.resolve([alternateEnding]);
        if (secondResolve !== ENDING_ID) {
            throw new Error("EndingService replaced an already resolved ending.");
        }

        runtime.persistence.save();

        const restoredRuntime = new GameRuntime(undefined, undefined, storage);
        if (!restoredRuntime.persistence.load()) {
            throw new Error("EndingService persistence load returned false.");
        }

        if (!restoredRuntime.ending.isResolved()) {
            throw new Error("Resolved ending did not survive SaveStorage restore.");
        }

        if (restoredRuntime.ending.getEndingId() !== ENDING_ID) {
            throw new Error("Resolved ending ID did not survive SaveStorage restore.");
        }

        UI.notify("DEAD SIGNAL Phase 12: Ending integration PASS");
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : String(error);

        console.error("[DEAD SIGNAL] Phase 12 ending smoke test failed", error);
        UI.notify(`DEAD SIGNAL Phase 12: Ending integration FAILED: ${message}`);
    }
}
