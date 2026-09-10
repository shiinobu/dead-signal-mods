import {
    Events,
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

interface SmokeQuestData {
    readonly targetIp: string;
}

const SMOKE_TARGET_IP = "10.42.0.81";
const CUSTOM_EVENT = "DeadSignal.CustomEvent" as any;

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV10";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V10";
    override Description = "Control test: isolate the SDK custom Events bus from Terminal.NmapScan.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "custom-event",
            description: "Wait for a synthetic DEAD SIGNAL custom event. Completion proves the Events bus callback works.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        Events.on(CUSTOM_EVENT, () => {
            console.log("[DEAD SIGNAL] CUSTOM EVENT RECEIVED");
            this.completeObjective("custom-event");
        });

        setTimeout(() => {
            console.log("[DEAD SIGNAL] EMITTING CUSTOM EVENT");
            Events.emit(CUSTOM_EVENT, {
                source: "dead-signal-smoke-test",
            });
        }, 500);
    }
}
