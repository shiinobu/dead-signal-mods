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
    override Name = "DeadSignalRuntimeSmokeTestV12";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V12";
    override Description = "Control test: verify the SDK Events callback with direct objective completion.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "custom-event",
            description: "This objective should complete when the synthetic custom event callback fires.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        console.log("[DEAD SIGNAL] V12 OnObjectivesStart EXECUTED");

        Events.on(CUSTOM_EVENT, () => {
            console.log("[DEAD SIGNAL] V12 CUSTOM EVENT CALLBACK EXECUTED");
            this.completeObjective("custom-event");
        });

        setTimeout(() => {
            console.log("[DEAD SIGNAL] V12 EMITTING CUSTOM EVENT");
            Events.emit(CUSTOM_EVENT, {
                source: "dead-signal-smoke-test-v12",
            });
        }, 500);
    }
}
