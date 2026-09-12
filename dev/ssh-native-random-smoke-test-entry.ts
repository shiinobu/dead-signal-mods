import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

import "./ssh-native-random-smoke-test-quest.js";

@RegisterModPackage
export default class DeadSignalSshNativeRandomSmokeMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL native SSH random-IP smoke-test build loaded.");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL native SSH random-IP smoke-test build unloaded.");
    }
}
