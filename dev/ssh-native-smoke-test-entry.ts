import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./ssh-native-smoke-test-quest.js";

@RegisterModPackage
export default class DeadSignalSshNativeSmokeMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL native SSH smoke-test build loaded.");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL native SSH smoke-test build unloaded.");
    }
}
