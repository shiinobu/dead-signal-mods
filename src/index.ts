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
        UI.notify("DEAD SIGNAL V15: claiming smoke quest...");

        try {
            DeadSignalSmokeQuest.claim();
            console.log("[DEAD SIGNAL] V15 Quest.claim() EXECUTED");
            UI.notify("DEAD SIGNAL V15: Quest.claim() executed");
        } catch (error) {
            console.error("[DEAD SIGNAL] V15 Quest.claim() FAILED", error);
            UI.notify("DEAD SIGNAL V15: Quest.claim() FAILED");
        }
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
