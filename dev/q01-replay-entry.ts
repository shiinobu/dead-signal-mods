import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./q01-replay-quest.js";
import "../src/infrastructure/hackhub/commands/q01-subfinder.js";
import "../src/infrastructure/hackhub/websites/q01-skynet-portal.js";

@RegisterModPackage
export default class DeadSignalReplayMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL Q01 replay build loaded.");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL Q01 replay build unloaded.");
    }
}
