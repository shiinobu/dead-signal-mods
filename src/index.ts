import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import { runPhase12RuntimeRegression } from "./infrastructure/hackhub/phase12-runtime-regression.js";
import { prepareNmapSmokeTest } from "./infrastructure/hackhub/dead-signal-nmap-smoke-quest.js";
import "./infrastructure/hackhub/dead-signal-smoke-quest.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
        prepareNmapSmokeTest();
        runPhase12RuntimeRegression();
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
