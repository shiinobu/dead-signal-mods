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
    override Name = "DeadSignalRuntimeSmokeTest";
    override Title = "DEAD SIGNAL — Runtime Smoke Test";
    override Description = "In-game smoke test for the HackHub quest and Terminal event integration.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = false;

    override Objectives = [
        {
            name: "ping-event",
            description: `Run ping against ${SMOKE_TARGET_IP}. The objective should complete from Terminal.Ping.`,
            trigger: {
                event: "Terminal.Ping",
                condition: (data: { ip: string }) => data.ip === SMOKE_TARGET_IP,
            },
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }
}
