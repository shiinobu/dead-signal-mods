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
    override Name = "DeadSignalRuntimeSmokeTestV14";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V14";
    override Description = "Control test: isolate the HackHub quest lifecycle without the Events API.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "direct-complete",
            description: "This objective should complete after the quest lifecycle reaches OnObjectivesStart.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnStart() {
        console.log("[DEAD SIGNAL] V14 OnStart EXECUTED");
        UI.notify("DEAD SIGNAL V14: OnStart executed");
    }

    override OnObjectivesStart() {
        console.log("[DEAD SIGNAL] V14 OnObjectivesStart EXECUTED");
        UI.notify("DEAD SIGNAL V14: OnObjectivesStart executed");

        setTimeout(() => {
            console.log("[DEAD SIGNAL] V14 DIRECT COMPLETE");
            UI.notify("DEAD SIGNAL V14: completing objective...");
            this.completeObjective("direct-complete");
        }, 1000);
    }
}
