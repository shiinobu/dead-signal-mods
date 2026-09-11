import {
    SaveStorage as HackHubSaveStorage,
    UI,
} from "@hotbunny/hackhub-content-sdk";

import { GameRuntime } from "../../application/game-runtime.js";

import { HackHubSaveStorageAdapter } from "./save-storage-adapter.js";

interface PersistenceProbe {
    readonly schema: 1;
    readonly createdAt: string;
}

const PROBE_KEY = "phase12-save-storage-probe";
const RUNTIME_NAMESPACE = "dead-signal.runtime-state";

export function runSaveStorageSmokeTest(): void {
    const storage = new HackHubSaveStorageAdapter(RUNTIME_NAMESPACE);
    const previousProbe = HackHubSaveStorage.get<PersistenceProbe>(PROBE_KEY);

    try {
        const runtime = new GameRuntime(undefined, undefined, storage);
        runtime.persistence.save();

        if (!runtime.persistence.load()) {
            UI.notify("DEAD SIGNAL Phase 12: SaveStorage runtime round-trip FAILED");
            return;
        }

        if (previousProbe) {
            UI.notify("DEAD SIGNAL Phase 12: SaveStorage persistence PASS");
            return;
        }

        HackHubSaveStorage.set(PROBE_KEY, {
            schema: 1,
            createdAt: new Date().toISOString(),
        });

        UI.notify(
            "DEAD SIGNAL Phase 12: SaveStorage write PASS — restart the same save to verify persistence",
        );
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : String(error);

        console.error("[DEAD SIGNAL] Phase 12 SaveStorage smoke test failed", error);
        UI.notify(`DEAD SIGNAL Phase 12: SaveStorage FAILED: ${message}`);
    }
}
