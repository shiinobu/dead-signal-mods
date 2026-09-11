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
    override Name = "DeadSignalRuntimeSmokeTestV17";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V17";
    override Description = "Control test: programmatic Quest.claim() followed by direct objective completion.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "direct-complete",
            description: "This objective should complete after the quest is explicitly claimed and reaches OnObjectivesStart.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnStart() {
        console.log("[DEAD SIGNAL] V17 OnStart EXECUTED");
        UI.notify("DEAD SIGNAL V17: OnStart executed");
    }

    override OnObjectivesStart() {
        console.log("[DEAD SIGNAL] V17 OnObjectivesStart EXECUTED");
        UI.notify("DEAD SIGNAL V17: OnObjectivesStart executed");

        setTimeout(() => {
            console.log("[DEAD SIGNAL] V17 DIRECT COMPLETE");
            UI.notify("DEAD SIGNAL V17: completing objective...");
            this.completeObjective("direct-complete");
        }, 1000);
    }
}
