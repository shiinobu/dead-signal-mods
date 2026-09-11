import {
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
    UI,
} from "@hotbunny/hackhub-content-sdk";

interface NmapSmokeQuestData {
    readonly targetIp: string;
}

const NMAP_TARGET_IP = "10.42.0.81";
const NMAP_TARGET_PORT = 22;

@RegisterQuest
export class DeadSignalNmapSmokeQuest extends HackHubQuest<NmapSmokeQuestData> {
    override Name = "DeadSignalNmapIntegrationSmokeTest";
    override Title = "DEAD SIGNAL — Nmap Integration Smoke Test";
    override Description = "Phase 12 validation for Nmap command routing and typed command response data.";
    override Group = "storyline" as const;
    override AutoStart = true;
    override AutoComplete = true;

    override Objectives = [
        {
            name: "nmap-command",
            description: `Run nmap against ${NMAP_TARGET_IP}. The objective completes from Terminal.Command.`,
            terminalCommand: `nmap ${NMAP_TARGET_IP}`,
            trigger: {
                event: "Terminal.Command",
                condition: (data: { command: string; args: string[] }) =>
                    data.command.toLowerCase() === "nmap" &&
                    data.args[0] === NMAP_TARGET_IP,
            },
        },
    ];

    override CreateData(): NmapSmokeQuestData {
        return {
            targetIp: NMAP_TARGET_IP,
        };
    }

    override OnStart() {
        Shell.addCommandData("nmap", NMAP_TARGET_IP, [
            {
                port: NMAP_TARGET_PORT,
                status: "OPEN",
                service: "ssh",
                version: "OpenSSH 9.0",
            },
        ]);
    }

    override OnComplete() {
        const ports = Shell.getCommandData("nmap", NMAP_TARGET_IP);

        if (ports === undefined) {
            UI.notify("DEAD SIGNAL Phase 12: Nmap integration FAILED: command data missing.");
            return;
        }

        const sshPort = ports.find((port) => port.port === NMAP_TARGET_PORT);

        if (sshPort?.status !== "OPEN" || sshPort.service !== "ssh") {
            UI.notify("DEAD SIGNAL Phase 12: Nmap integration FAILED: expected SSH port data missing.");
            return;
        }

        UI.notify("DEAD SIGNAL Phase 12: Nmap integration PASS");
        Shell.removeCommandData("nmap", NMAP_TARGET_IP);
    }
}
