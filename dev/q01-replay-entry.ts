import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./q01-replay-quest.js";
import "../src/infrastructure/hackhub/commands/recon.js";
import "../src/infrastructure/hackhub/websites/q01-skynet-portal.js";

import { Q01_RECON_PROFILE } from "../src/content/q01.js";
import { opsRuntime } from "../src/application/ops/runtime.js";

@RegisterModPackage
export default class DeadSignalReplayMod extends Bootstrap {
    override OnModPackageLoaded() {
        opsRuntime.recon.registerProfile(Q01_RECON_PROFILE);
        console.log("DEAD SIGNAL Q01 replay build loaded.");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL Q01 replay build unloaded.");
    }
}
