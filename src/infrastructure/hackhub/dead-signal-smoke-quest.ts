import {
    Events,
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
    override Name = "DeadSignalRuntimeSmokeTestV5";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V5";
    override Description = `Listen for the native Terminal.NmapScan event.`;
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "nmap-event",
            description: `Run nmap and verify Terminal.NmapScan for ${SMOKE_TARGET_IP}.`,
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnStart() {
        UI.notify(
            `DEAD SIGNAL V5 EVENT TEST: waiting for Terminal.NmapScan on ${this.Data.targetIp}`,
        );

        Events.on("Terminal.NmapScan", (data: unknown) => {
            let payload = "undefined";

            try {
                payload = JSON.stringify(data);
            } catch {
                payload = String(data);
            }

            console.log("[DEAD SIGNAL] V5 raw Terminal.NmapScan:", data);
            UI.notify(`DEAD SIGNAL V5 EVENT RECEIVED: ${payload}`);
        });
    }
}
