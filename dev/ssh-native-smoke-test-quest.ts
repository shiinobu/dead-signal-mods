import {
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

import { DEV_SSH_NATIVE_SMOKE_ID } from "./ssh-native-smoke-id.generated.js";
import { DEV_SSH_NATIVE_SMOKE_CONFIG } from "./ssh-native-smoke-config.generated.js";

const TARGET_IP = "45.33.32.156";
const SSH_PORT = 22;
const SSH_USERNAME = "admin";

interface SshNativeSmokeData {
    readonly connected: boolean;
}

@RegisterQuest
export class DeadSignalSshNativeSmokeQuest extends HackHubQuest<SshNativeSmokeData> {
    override Name = `dead_signal.dev.ssh-smoke.${DEV_SSH_NATIVE_SMOKE_ID}`;
    override Title = "SSH NATIVE SMOKE TEST";
    override Description =
        "Minimal native SSH validation based on the FULL npm create hackhub-mod scaffold.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
    override HackhubPost = {
        content:
            `NATIVE SSH SMOKE TEST #${DEV_SSH_NATIVE_SMOKE_ID}\n\n` +
            "Accept this post to start the test.\n" +
            `Target: ${TARGET_IP}\n` +
            `SSH user: ${SSH_USERNAME}\n` +
            `Password: ${DEV_SSH_NATIVE_SMOKE_CONFIG.password}\n\n` +
            "This fixture intentionally uses only the standard HackHub Network + native SSH event flow.",
        author: {
            name: "DEAD SIGNAL [DEV]",
        },
    };
    override Objectives = [
        {
            name: "connect",
            description: `Connect to ${TARGET_IP} using native SSH.`,
        },
    ];

    override CreateData(): SshNativeSmokeData {
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
                    password: DEV_SSH_NATIVE_SMOKE_CONFIG.password,
                }),
            ],
            children: [],
        });

        this.Events.on("Terminal.SSH.Connected", (ip) => {
            console.log(
                `[DEAD SIGNAL SSH SMOKE] Terminal.SSH.Connected: ${ip}`,
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
