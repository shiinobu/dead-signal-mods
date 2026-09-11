import {
    Bootstrap,
    RegisterModPackage,
    UI,
} from "@hotbunny/hackhub-content-sdk";

import { DeadSignalSmokeQuest } from "./infrastructure/hackhub/dead-signal-smoke-quest.js";

const CLAIM_RETRY_INTERVAL_MS = 5000;
const CLAIM_MAX_ATTEMPTS = 10;

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        UI.notify("DEAD SIGNAL V17: waiting for game runtime...");

        let attempt = 0;
        const retryClaim = () => {
            attempt += 1;
            UI.notify(`DEAD SIGNAL V17: Quest.claim() attempt ${attempt}/${CLAIM_MAX_ATTEMPTS}...`);

            try {
                DeadSignalSmokeQuest.claim();
                console.log(`[DEAD SIGNAL] V17 Quest.claim() EXECUTED on attempt ${attempt}`);
                UI.notify(`DEAD SIGNAL V17: Quest.claim() executed on attempt ${attempt}`);
                return;
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);

                console.error(`[DEAD SIGNAL] V17 Quest.claim() FAILED on attempt ${attempt}`, error);
                UI.notify(`DEAD SIGNAL V17: claim failed: ${message}`);
            }

            if (attempt < CLAIM_MAX_ATTEMPTS) {
                setTimeout(retryClaim, CLAIM_RETRY_INTERVAL_MS);
                return;
            }

            UI.notify("DEAD SIGNAL V17: Quest.claim() failed after all retry attempts.");
        };

        setTimeout(retryClaim, CLAIM_RETRY_INTERVAL_MS);
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
