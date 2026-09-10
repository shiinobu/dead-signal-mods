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

const SMOKE_TARGET_IP = "10.42.0.81";
const runtime = new GameRuntime(
    undefined,
    undefined,
    new HackHubSaveStorageAdapter("dead-signal.runtime.v5"),
);

const smokeQuest: DomainQuest = {
    id: asId("quest.dead-signal.smoke.v5"),
    chapterId: "01",
    title: "Dead Signal — Runtime Smoke Test V5",
    description: "Verify native HackHub Nmap event delivery without injected Nmap response data.",
    objectives: [
        {
            id: "scan-target",
            description: `Scan the smoke-test target ${SMOKE_TARGET_IP}.`,
            condition: flagEquals("dead_signal.smoke.v5.scan_complete", true),
        },
    ],
};

@RegisterQuest
export class DeadSignalSmokeQuest extends HackHubQuest<SmokeQuestData> {
    override Name = "DeadSignalRuntimeSmokeTestV5";
    override Title = "DEAD SIGNAL — Runtime Smoke Test V5";
    override Description = `Scan ${SMOKE_TARGET_IP} using the native Nmap path.`;
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
        // Keep only the ping override. V5 deliberately does NOT inject
        // Nmap response data so the scan exercises HackHub's native Nmap path.
        Shell.addCommandData("ping", this.Data.targetIp, true);

        UI.notify(
            `DEAD SIGNAL V5: native Nmap test target ${this.Data.targetIp}`,
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
    }

    override OnObjectivesStart() {
        const loaded = runtime.persistence.load();

        this.registerTerminalData();

        UI.notify(
            `DEAD SIGNAL V5 persistence: ${loaded ? "LOADED" : "NEW"}`,
        );
        UI.notify(
            `DEAD SIGNAL V5: waiting for native Terminal.NmapScan on ${this.Data.targetIp}`,
        );

        Events.on("Terminal.NmapScan", (data: unknown) => {
            let payload = "undefined";

            try {
                payload = JSON.stringify(data);
            } catch {
                payload = String(data);
            }

            UI.notify(`DEAD SIGNAL V5 EVENT: ${payload}`);
            console.log("[DEAD SIGNAL] V5 raw Nmap event payload:", data);

            if (
                typeof data !== "object" ||
                data === null ||
                !("ip" in data) ||
                typeof data.ip !== "string" ||
                data.ip !== this.Data.targetIp
            ) {
                return;
            }

            this.completeObjective("scan-target");
            runtime.flagStore.set(
                "dead_signal.smoke.v5.scan_complete",
                true,
            );
            runtime.persistence.save();

            UI.notify(
                `DEAD SIGNAL V5 Nmap objective completed: ${data.ip}`,
            );
        });
    }

    override OnComplete() {
        runtime.flagStore.set(
            "dead_signal.smoke.v5.scan_complete",
            true,
        );

        const completed = runtime.quest.complete(smokeQuest);
        runtime.persistence.save();

        if (completed) {
            runtime.reward.claim({
                id: asId("reward.dead-signal.smoke.v5"),
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
        Network.destroyNetwork(this.Data.targetIp);

        UI.notify(
            `DEAD SIGNAL V5 smoke test completed: ${completed ? "PASS" : "FAIL"}`,
        );
    }
}

export { runtime as deadSignalRuntime };
