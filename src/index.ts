import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import { runEndingSmokeTest } from "./infrastructure/hackhub/ending-smoke-test.js";
import { runRuntimeServicesSmokeTest } from "./infrastructure/hackhub/runtime-services-smoke-test.js";
import { runSaveStorageSmokeTest } from "./infrastructure/hackhub/save-storage-smoke-test.js";
import "./infrastructure/hackhub/dead-signal-smoke-quest.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        runSaveStorageSmokeTest();
        runRuntimeServicesSmokeTest();
        runEndingSmokeTest();
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
