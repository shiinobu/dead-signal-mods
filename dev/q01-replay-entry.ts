import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./q01-replay-quest.js";

@RegisterModPackage
export default class DeadSignalReplayMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL Q01 replay build loaded.");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL Q01 replay build unloaded.");
    }
}
