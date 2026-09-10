import {
    Events,
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
import { HackHubSaveStorageAdapter } from "./save-storage-adapter.js";

interface SmokeQuestData {
    readonly targetIp: string;
}

const SMOKE_TARGET_IP = "10.42.0.79";
const runtime = new GameRuntime(
    undefined,
    undefined,
    new HackHubSaveStorageAdapter("dead-signal.runtime.v3"),
);

const smokeQuest: DomainQuest = {
    id: asId("quest.dead-signal.smoke.v3"),
    chapterId: "01",
    title: "Dead Signal — Runtime Smoke Test V3",
    description: "Verify HackHub global terminal event delivery and quest completion.",
    objectives: [
        {
            id: "scan-target",
            description: `Scan the smoke-test target ${SMOKE_TARGET_IP}.`,
            condition: flagEquals("dead_signal.smoke.v3.scan_complete", true),
        },
    ],
};

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV3";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V3";
    override Description = `Scan ${SMOKE_TARGET_IP} to isolate global Nmap event delivery.`;
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
            `DEAD SIGNAL V3: Nmap data ${nmapData ? "READY" : "MISSING"} for ${this.Data.targetIp}`,
        );

        console.log(
            `[DEAD SIGNAL] V3 terminal data registered: ${this.Data.targetIp}`,
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
        runtime.persistence.save();
        this.registerTerminalData();

        console.log(
            `[DEAD SIGNAL] V3 smoke target created: ${this.Data.targetIp}`,
        );
    }

    override OnObjectivesStart() {
        const loaded = runtime.persistence.load();

        this.registerTerminalData();

        UI.notify(
            `DEAD SIGNAL V3 persistence: ${loaded ? "LOADED" : "NEW"}`,
        );

        Events.on("Terminal.NmapScan", (data: { ip: string }) => {
            if (data.ip !== this.Data.targetIp) {
                return;
            }

            UI.notify(
                `DEAD SIGNAL V3 GLOBAL Nmap event received: ${data.ip}`,
            );

            console.log(
                `[DEAD SIGNAL] V3 global Nmap event received: ${data.ip}`,
            );

            this.completeObjective("scan-target");

            runtime.flagStore.set(
                "dead_signal.smoke.v3.scan_complete",
                true,
            );
            runtime.persistence.save();

            UI.notify(
                `DEAD SIGNAL V3 Nmap objective completed: ${data.ip}`,
            );

            console.log(
                `[DEAD SIGNAL] V3 Nmap objective completed and persisted: ${data.ip}`,
            );
        });

        console.log(
            `[DEAD SIGNAL] V3 GLOBAL Nmap event listener active for ${this.Data.targetIp}`,
        );
    }

    override OnComplete() {
        runtime.flagStore.set(
            "dead_signal.smoke.v3.scan_complete",
            true,
        );

        const completed = runtime.quest.complete(smokeQuest);
        runtime.persistence.save();

        if (completed) {
            runtime.reward.claim({
                id: asId("reward.dead-signal.smoke.v3"),
                kind: "experience",
                amount: 25,
            });

            runtime.economy.credit(
                100,
                "QUEST_REWARD",
                smokeQuest.id,
            );

            runtime.persistence.save();
        }

        Shell.removeCommandData("ping", this.Data.targetIp);
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Network.destroyNetwork(this.Data.targetIp);

        UI.notify(
            `DEAD SIGNAL V3 smoke test completed: ${completed ? "PASS" : "FAIL"}`,
        );

        console.log(
            `[DEAD SIGNAL] V3 runtime smoke test completed: ${completed}`,
        );
    }
}

export { runtime as deadSignalRuntime };
