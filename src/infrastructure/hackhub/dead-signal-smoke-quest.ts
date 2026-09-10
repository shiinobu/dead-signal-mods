import {
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
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
const SMOKE_TARGET_IP = "10.42.0.78";

const smokeQuest: DomainQuest = {
    id: asId("quest.dead-signal.smoke.v2"),
    chapterId: "01",
    title: "Dead Signal — Runtime Smoke Test V2",
    description: "Verify the DEAD SIGNAL runtime inside HackHub with a fresh quest instance.",
    objectives: [
        {
            id: "scan-target",
            description: `Scan the smoke-test target ${SMOKE_TARGET_IP}.`,
            condition: flagEquals("dead_signal.smoke.v2.scan_complete", true),
        },
    ],
};

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV2";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V2";
    override Description = `Scan ${SMOKE_TARGET_IP} to verify fresh quest lifecycle and terminal integration.`;
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = true;

    override Objectives = [
        {
            name: "scan-target",
            description: `Scan the smoke-test target ${SMOKE_TARGET_IP}`,
            trigger: {
                event: "Terminal.NmapScan",
                condition: (data: { ip: string }) =>
                    data.ip === this.Data.targetIp,
            },
        },
    ];

    override CreateData(): SmokeQuestData {
        return {
            targetIp: SMOKE_TARGET_IP,
        };
    }

    private registerTerminalData() {
        Shell.addCommandData("ping", this.Data.targetIp, true);
        Shell.addCommandData("nmap", this.Data.targetIp, [
            {
                port: 22,
                status: "OPEN",
                service: "ssh",
                version: "DEAD SIGNAL Smoke SSH",
            },
        ]);

        const nmapData = Shell.getCommandData(
            "nmap",
            this.Data.targetIp,
        );

        UI.notify(
            `DEAD SIGNAL V2: Nmap data ${nmapData ? "READY" : "MISSING"} for ${this.Data.targetIp}`,
        );

        console.log(
            `[DEAD SIGNAL] V2 terminal data registered: ${this.Data.targetIp}`,
            nmapData,
        );
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
        this.registerTerminalData();

        console.log(
            `[DEAD SIGNAL] V2 smoke target created: ${this.Data.targetIp}`,
        );
    }

    override OnObjectivesStart() {
        this.registerTerminalData();
    }

    override OnComplete() {
        runtime.flagStore.set(
            "dead_signal.smoke.v2.scan_complete",
            true,
        );

        const completed = runtime.quest.complete(smokeQuest);

        if (completed) {
            runtime.reward.claim({
                id: asId("reward.dead-signal.smoke.v2"),
                kind: "experience",
                amount: 25,
            });

            runtime.economy.credit(
                100,
                "QUEST_REWARD",
                smokeQuest.id,
            );
        }

        Shell.removeCommandData("ping", this.Data.targetIp);
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Network.destroyNetwork(this.Data.targetIp);

        UI.notify(
            `DEAD SIGNAL V2 smoke test completed: ${completed ? "PASS" : "FAIL"}`,
        );

        console.log(
            `[DEAD SIGNAL] V2 runtime smoke test completed: ${completed}`,
        );
    }
}

export { runtime as deadSignalRuntime };
