import {
    Bootstrap,
    RegisterModPackage,
} from "@hotbunny/hackhub-content-sdk";

@RegisterModPackage
export default class DeadSignalMod extends Bootstrap {
    override OnModPackageLoaded() {
        console.log("DEAD SIGNAL mod loaded!");
    }

    override OnModPackageUnloaded() {
        console.log("DEAD SIGNAL mod unloaded.");
    }
}
