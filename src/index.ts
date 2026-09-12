import "./infrastructure/hackhub/commands/recon.js";
import "./infrastructure/hackhub/websites/q01-skynet-portal.js";
import "./infrastructure/hackhub/q01-quest.js";

import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import { Q01_RECON_PROFILE } from "./content/q01.js";
import { opsRuntime } from "./application/ops/runtime.js";
import { gameRuntime } from "./infrastructure/hackhub/runtime.js";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        opsRuntime.recon.registerProfile(Q01_RECON_PROFILE);
        gameRuntime.persistence.load();
        console.log("DEAD SIGNAL mod loaded!");
    }

    override OnModPackageUnloaded() {
        gameRuntime.persistence.save();
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
