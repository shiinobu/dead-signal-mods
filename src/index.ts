import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
    }

    OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
