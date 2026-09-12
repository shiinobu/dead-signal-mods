import {
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

import { DEV_SSH_FULL_SMOKE_ID } from "./ssh-full-scaffold-smoke-id.generated.js";

const TARGET_IP = "45.33.32.156";

interface SshFullScaffoldSmokeData {
    readonly connected: boolean;
}

interface RemoteConnectionEstablishedData {
    readonly ip: string;
    readonly service?: string;
}

@RegisterQuest
export class DeadSignalSshFullScaffoldSmokeQuest extends HackHubQuest<SshFullScaffoldSmokeData> {
    override Name = `dead_signal.dev.ssh-full-scaffold-smoke.${DEV_SSH_FULL_SMOKE_ID}`;
    override Title = "SSH FULL SCAFFOLD SMOKE TEST";
    override Description =
        "Minimal SSH diagnostic following the FULL npm create hackhub-mod InvestigationQuest pattern.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
    override HackhubPost = {
        content:
            `SSH FULL SCAFFOLD SMOKE TEST #${DEV_SSH_FULL_SMOKE_ID}\n\n` +
            "Accept this post to start the test.\n" +
            `Target: ${TARGET_IP}\n\n` +
            "This diagnostic follows the FULL scaffold: no Network.createSubnetNetwork(), no Shell.addCommandData(), no child device, and no Network.openPort().\n" +
            "The quest only observes the normal remote-connection events produced by HackHub.",
        author: {
            name: "DEAD SIGNAL [DEV]",
        },
    };
    override Objectives = [
        {
            name: "connect",
            description:
                `Gain remote access — connect to ${TARGET_IP} via SSH or another remote service.`,
        },
    ];

    override CreateData(): SshFullScaffoldSmokeData {
        return {
            connected: false,
        };
    }

    override OnStart() {
        this.sendMail(0);
    }

    override OnObjectivesStart() {
        this.Events.on("RemoteConnection.Established", (data) => {
            const connection = data as RemoteConnectionEstablishedData;

            console.log(
                `[DEAD SIGNAL SSH FULL SMOKE] RemoteConnection.Established ip=${connection.ip} service=${connection.service ?? "unknown"}`,
            );

            if (connection.ip !== TARGET_IP || this.Data.connected) {
                return;
            }

            this.SetData("connected", true);
            this.completeObjective("connect");
        });

        this.Events.on("Terminal.SSH.Connected", (ip) => {
            console.log(
                `[DEAD SIGNAL SSH FULL SMOKE] Terminal.SSH.Connected ip=${ip}`,
            );
        });
    }

    override OnComplete() {
        this.sendMail(1);
    }
}
