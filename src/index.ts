import {
    Bootstrap,
    RegisterModPackage,
    UI,
} from "@hotbunny/hackhub-content-sdk";

import { DeadSignalSmokeQuest } from "./infrastructure/hackhub/dead-signal-smoke-quest.js";

const SMOKE_TARGET_IP = "10.42.0.81";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        UI.notify("DEAD SIGNAL V17: waiting before Quest.claim()...");

        setTimeout(() => {
            UI.notify("DEAD SIGNAL V17: attempting Quest.claim()...");

            try {
                DeadSignalSmokeQuest.claim({
                    targetIp: SMOKE_TARGET_IP,
                });
                console.log("[DEAD SIGNAL] V17 Quest.claim() EXECUTED");
                UI.notify("DEAD SIGNAL V17: Quest.claim() executed");
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);

                console.error("[DEAD SIGNAL] V17 Quest.claim() FAILED", error);
                UI.notify(`DEAD SIGNAL V17: Quest.claim() FAILED: ${message}`);
            }
        }, 5000);
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
