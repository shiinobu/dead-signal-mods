import {
    Bootstrap,
    RegisterModPackage,
    UI,
} from "@hotbunny/hackhub-content-sdk";

import { DeadSignalSmokeQuest } from "./infrastructure/hackhub/dead-signal-smoke-quest.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        UI.notify("DEAD SIGNAL V16: waiting before Quest.claim()...");

        setTimeout(() => {
            UI.notify("DEAD SIGNAL V16: attempting Quest.claim()...");

            try {
                DeadSignalSmokeQuest.claim();
                console.log("[DEAD SIGNAL] V16 Quest.claim() EXECUTED");
                UI.notify("DEAD SIGNAL V16: Quest.claim() executed");
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);

                console.error("[DEAD SIGNAL] V16 Quest.claim() FAILED", error);
                UI.notify(`DEAD SIGNAL V16: Quest.claim() FAILED: ${message}`);
            }
        }, 3000);
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
