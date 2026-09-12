import {
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

import { DEV_SSH_RANDOM_SMOKE_ID } from "./ssh-native-random-smoke-id.generated.js";

const TARGET_IP = Network.randomIp();
const SSH_PORT = 22;
const SSH_USERNAME = "admin";
const SSH_PASSWORD = "secret123";

interface SshNativeRandomSmokeData {
    readonly connected: boolean;
}

@RegisterQuest
export class DeadSignalSshNativeRandomSmokeQuest extends HackHubQuest<SshNativeRandomSmokeData> {
    override Name = `dead_signal.dev.ssh-random-smoke.${DEV_SSH_RANDOM_SMOKE_ID}`;
    override Title = "SSH RANDOM-IP SMOKE TEST";
    override Description =
        "Minimal native SSH validation using Network.randomIp() and the FULL npm create hackhub-mod scaffold pattern.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
    override HackhubPost = {
        content:
            `NATIVE SSH RANDOM-IP SMOKE TEST #${DEV_SSH_RANDOM_SMOKE_ID}\n\n` +
            "Accept this post to start the test.\n" +
            `Target: ${TARGET_IP}\n` +
            `SSH user: ${SSH_USERNAME}\n` +
            `Password: ${SSH_PASSWORD}\n\n` +
            "This fixture uses only Network.randomIp(), a Router target, a native SSH service, and Terminal.SSH.Connected.",
        author: {
            name: "DEAD SIGNAL [DEV]",
        },
    };
    override Objectives = [
        {
            name: "connect",
            description: "Connect using native SSH to the generated virtual target.",
        },
    ];

    override CreateData(): SshNativeRandomSmokeData {
        return {
            connected: false,
        };
    }

    override OnStart() {
        Network.createSubnetNetwork({
            ip: TARGET_IP,
            type: Network.Type.Router,
            ports: [
                {
                    external: SSH_PORT,
                    internal: SSH_PORT,
                    active: true,
                    service: "ssh",
                },
            ],
            users: [
                Network.createUser({
                    username: SSH_USERNAME,
                    password: SSH_PASSWORD,
                }),
            ],
            children: [],
        });

        this.Events.on("Terminal.SSH.Connected", (ip) => {
            console.log(
                `[DEAD SIGNAL SSH RANDOM SMOKE] Terminal.SSH.Connected: ${ip}`,
            );

            if (ip !== TARGET_IP || this.Data.connected) {
                return;
            }

            this.SetData("connected", true);
            this.completeObjective("connect");
        });
    }

    override OnComplete() {
        Network.destroyNetwork(TARGET_IP);
    }

    override OnAbandon() {
        Network.destroyNetwork(TARGET_IP);
    }
}
