import {
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
    UI,
} from "@hotbunny/hackhub-content-sdk";

import { GameRuntime } from "../../application/index.js";
import { asId } from "../../core/index.js";
import type { Quest as DomainQuest } from "../../domain/quest/index.js";
import { flagEquals } from "../../domain/shared/index.js";

interface SmokeQuestData {
    readonly targetIp: string;
}

const runtime = new GameRuntime();

const smokeQuest: DomainQuest = {
    id: asId("quest.dead-signal.smoke"),
    chapterId: "01",
    title: "Dead Signal — Runtime Smoke Test",
    description: "Verify the DEAD SIGNAL runtime inside HackHub.",
    objectives: [
        {
            id: "scan-target",
            description: "Scan the smoke-test target.",
            condition: flagEquals("dead_signal.smoke.scan_complete", true),
        },
    ],
};

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTest";
    override Title = "DEAD SIGNAL — Runtime Smoke Test";
    override Description = "Scan the target to verify the DEAD SIGNAL runtime is connected to HackHub.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = true;

    override Objectives = [
        {
            name: "scan-target",
            description: "Scan the smoke-test target",
            trigger: {
                event: "Terminal.NmapScan",
                condition: (data: { ip: string }) =>
                    data.ip === this.Data.targetIp,
            },
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: Network.randomIp(),
        };
    }

    override OnStart() {
        Network.createSubnetNetwork({
            ip: this.Data.targetIp,
            type: Network.Type.Router,
            ports: [
                {
                    external: 22,
                    internal: 22,
                    active: true,
                    service: "ssh",
                },
            ],
            users: [
                Network.createUser({
                    username: "smoke",
                    password: "dead-signal",
                }),
            ],
            children: [],
        });

        runtime.quest.start(smokeQuest);

        console.log(
            `[DEAD SIGNAL] Smoke target created: ${this.Data.targetIp}`,
        );
    }

    override OnObjectivesStart() {
        UI.notify(`DEAD SIGNAL smoke target: ${this.Data.targetIp}`);

        console.log(
            `[DEAD SIGNAL] Smoke objective active for: ${this.Data.targetIp}`,
        );
    }

    override OnComplete() {
        runtime.flagStore.set(
            "dead_signal.smoke.scan_complete",
            true,
        );

        const completed = runtime.quest.complete(smokeQuest);

        if (completed) {
            runtime.reward.claim({
                id: asId("reward.dead-signal.smoke"),
                kind: "experience",
                amount: 25,
            });

            runtime.economy.credit(
                100,
                "QUEST_REWARD",
                smokeQuest.id,
            );
        }

        Network.destroyNetwork(this.Data.targetIp);

        UI.notify(
            `DEAD SIGNAL smoke test completed: ${completed ? "PASS" : "FAIL"}`,
        );

        console.log(
            `[DEAD SIGNAL] Runtime smoke test completed: ${completed}`,
        );
    }
}

export { runtime as deadSignalRuntime };
