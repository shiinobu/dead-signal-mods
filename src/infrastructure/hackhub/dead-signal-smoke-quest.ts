import {
    Quest as HackHubQuest,
    RegisterQuest,
    UI,
} from "@hotbunny/hackhub-content-sdk";

interface SmokeQuestData {
    readonly targetIp: string;
}

const SMOKE_TARGET_IP = "10.42.0.81";

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV6";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V6";
    override Description = "Official declarative Terminal.NmapScan trigger test.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "nmap-event",
            description: `Run nmap and verify Terminal.NmapScan for ${SMOKE_TARGET_IP}.`,
            trigger: {
                event: "Terminal.NmapScan",
                condition: (data: { ip: string }) => data.ip === SMOKE_TARGET_IP,
            },
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        UI.notify(
            `DEAD SIGNAL V6: declarative Nmap trigger armed for ${this.Data.targetIp}`,
        );
    }
}
