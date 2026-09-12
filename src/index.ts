import "./infrastructure/hackhub/commands/q01-subfinder.js";
import "./infrastructure/hackhub/websites/q01-skynet-portal.js";
import "./infrastructure/hackhub/q01-quest.js";

import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import { gameRuntime } from "./infrastructure/hackhub/runtime.js";

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
