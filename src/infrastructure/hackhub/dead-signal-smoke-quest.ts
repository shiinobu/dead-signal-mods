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
const CUSTOM_EVENT = "DeadSignal.CustomEvent.V13" as const;

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV13";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V13";
    override Description = "Control test: register a custom event, then verify the quest-scoped Events bridge.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "custom-event",
            description: "This objective should complete when the registered synthetic event callback fires.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        console.log("[DEAD SIGNAL] V13 OnObjectivesStart EXECUTED");
        UI.notify("DEAD SIGNAL V13: registering custom event listener...");

        try {
            Events.register(CUSTOM_EVENT);
            console.log("[DEAD SIGNAL] V13 custom event registered");
            UI.notify("DEAD SIGNAL V13: custom event registered");
        } catch (error) {
            console.error("[DEAD SIGNAL] V13 Events.register FAILED", error);
            UI.notify("DEAD SIGNAL V13: Events.register FAILED");
        }

        this.Events.on(CUSTOM_EVENT, (data) => {
            console.log("[DEAD SIGNAL] V13 CUSTOM EVENT CALLBACK EXECUTED", data);
            UI.notify("DEAD SIGNAL V13: CUSTOM EVENT CALLBACK RECEIVED");
            this.completeObjective("custom-event");
        });

        setTimeout(() => {
            console.log("[DEAD SIGNAL] V13 EMITTING CUSTOM EVENT");
            UI.notify("DEAD SIGNAL V13: emitting custom event...");
            try {
                Events.emit(CUSTOM_EVENT, {
                    source: "dead-signal-smoke-test-v13",
                });
            } catch (error) {
                console.error("[DEAD SIGNAL] V13 Events.emit FAILED", error);
                UI.notify("DEAD SIGNAL V13: Events.emit FAILED");
            }
        }, 1000);
    }
}
