import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import { runSaveStorageSmokeTest } from "./infrastructure/hackhub/save-storage-smoke-test.js";
import "./infrastructure/hackhub/dead-signal-smoke-quest.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        runSaveStorageSmokeTest();
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
