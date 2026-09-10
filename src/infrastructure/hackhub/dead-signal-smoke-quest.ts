import {
    Events,
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

interface SmokeQuestData {
    readonly targetIp: string;
}

const SMOKE_TARGET_IP = "10.42.0.81";

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV9";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V9";
    override Description = "Control test: manually emit Terminal.NmapScan into the declarative objective trigger.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "nmap-event",
            description: `Wait for a synthetic Terminal.NmapScan event for ${SMOKE_TARGET_IP}.`,
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
        setTimeout(() => {
            Events.emit("Terminal.NmapScan", {
                ip: this.Data.targetIp,
            });
        }, 500);
    }
}
