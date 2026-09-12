import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./ssh-full-scaffold-smoke-quest.js";

@RegisterModPackage
export default class DeadSignalSshFullScaffoldSmokeMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log(
            "DEAD SIGNAL FULL scaffold native SSH smoke-test build loaded.",
        );
    }

    override OnModPackageUnloaded() {
        console.log(
            "DEAD SIGNAL FULL scaffold native SSH smoke-test build unloaded.",
        );
    }
}
