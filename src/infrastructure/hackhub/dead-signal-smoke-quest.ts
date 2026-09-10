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
    override Description = `Isolate the global Terminal.NmapScan event system.`;
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

    override OnObjectivesStart() {
        UI.notify(
            `DEAD SIGNAL V5 GLOBAL TEST: waiting for Terminal.NmapScan on ${this.Data.targetIp}`,
        );

        Events.on("Terminal.NmapScan", (data) => {
            let payload = "undefined";

            try {
                payload = JSON.stringify(data);
            } catch {
                payload = String(data);
            }

            console.log("[DEAD SIGNAL] V5 global Terminal.NmapScan received:", data);
            UI.notify(`DEAD SIGNAL V5 GLOBAL EVENT RECEIVED: ${payload}`);
        });

        Events.emit("Terminal.NmapScan", {
            ip: this.Data.targetIp,
        });
    }
}
