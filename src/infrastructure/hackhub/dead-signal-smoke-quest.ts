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
    override Name = "DeadSignalRuntimeSmokeTestV7";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V7";
    override Description = "Isolate native terminal event delivery with Ping as a control.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "terminal-event",
            description: `Run ping and nmap against ${SMOKE_TARGET_IP} and verify native terminal events.`,
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        const eventsApi = Events as unknown as Record<string, unknown>;
        const apiKeys = Object.keys(eventsApi).sort().join(",") || "<none>";

        UI.notify(`DEAD SIGNAL V7: Events.on=${typeof Events.on}, emit=${typeof Events.emit}`);
        UI.notify(`DEAD SIGNAL V7: Events keys=${apiKeys}`);
        UI.notify(`DEAD SIGNAL V7: waiting for Ping + Nmap events on ${this.Data.targetIp}`);

        this.Events.on("Terminal.Ping", (data) => {
            let payload = "undefined";
            try {
                payload = JSON.stringify(data);
            } catch {
                payload = String(data);
            }
            console.log("[DEAD SIGNAL] V7 Terminal.Ping:", data);
            UI.notify(`DEAD SIGNAL V7 PING RECEIVED: ${payload}`);
        });

        this.Events.on("Terminal.NmapScan", (data) => {
            let payload = "undefined";
            try {
                payload = JSON.stringify(data);
            } catch {
                payload = String(data);
            }
            console.log("[DEAD SIGNAL] V7 Terminal.NmapScan:", data);
            UI.notify(`DEAD SIGNAL V7 NMAP RECEIVED: ${payload}`);
        });
    }
}
