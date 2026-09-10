import {
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

interface SmokeQuestData {
    readonly targetIp: string;
}

const SMOKE_TARGET_IP = "10.42.0.81";

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV11";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V11";
    override Description = "Control test: direct objective completion without the Events API.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "direct-complete",
            description: "This objective should complete directly from OnObjectivesStart.",
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    override OnObjectivesStart() {
        console.log("[DEAD SIGNAL] V11 OnObjectivesStart EXECUTED");
        setTimeout(() => {
            console.log("[DEAD SIGNAL] V11 DIRECT COMPLETE");
            this.completeObjective("direct-complete");
        }, 500);
    }
}
