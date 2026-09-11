import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import {
    gameRuntime,
} from "./infrastructure/hackhub/runtime.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        gameRuntime.persistence.load();
        console.log("DEAD SIGNAL mod loaded!");
    }

    override OnModPackageUnloaded() {
        gameRuntime.persistence.save();
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
