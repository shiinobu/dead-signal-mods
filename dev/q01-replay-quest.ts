import {
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_OBJECTIVE_IDS,
    Q01_SSH_COMMAND,
    Q01_SSH_PASSWORD,
    Q01_SSH_USERNAME,
    Q01_TARGET_IP,
} from "../src/content/q01.js";

import { DEV_Q01_REPLAY_ID } from "./replay-id.generated.js";

interface Q01ReplayData {
    readonly targetIp: string;
    readonly networkScanned: boolean;
    readonly servicesIdentified: boolean;
    readonly basicVulnerabilityChecksCompleted: boolean;
    readonly reportSubmitted: boolean;
    readonly sshConnected: boolean;
}

interface TerminalCommandData {
    readonly command: string;
    readonly args: string[];
}

interface Q01NmapPort {
    readonly port: number;
    readonly status: "OPEN";
    readonly service: string;
}

interface Q01SshCommandInput {
    readonly host: string;
    readonly key: string;
}

interface Q01SshCommandData {
    readonly ip: string;
    readonly status: "OPEN" | "CLOSE";
}

const Q01_NMAP_RESULT: Q01NmapPort[] = [
    { port: 22, status: "OPEN", service: "ssh" },
    { port: 80, status: "OPEN", service: "http" },
    { port: 443, status: "OPEN", service: "https" },
];

const Q01_REPORT_SUBJECT = "Security Audit — Jakarta";

const Q01_REPORT_REQUIRED_CONTENT = [
    "Meridian Logistics",
    Q01_TARGET_IP,
    "22",
    "80",
    "443",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
];

const Q01_SSH_COMMAND_INPUT: Q01SshCommandInput = {
    host: `${Q01_SSH_USERNAME}@${Q01_TARGET_IP}`,
    key: "",
};

const Q01_SSH_COMMAND_RESULT: Q01SshCommandData = {
    ip: Q01_TARGET_IP,
    status: "OPEN",
};

@RegisterQuest
export class DeadSignalQ01ReplayQuest extends HackHubQuest<Q01ReplayData> {
    override Name = `dead_signal.dev.q01.${DEV_Q01_REPLAY_ID}`;
    override Title = "THE CONTRACT — DEV REPLAY";
    override Description =
        "Development replay fixture for the Q01 live-validation flow.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = { money: 0, xp: 0 };
    override HackhubPost = {
        content:
            `DEV REPLAY #${DEV_Q01_REPLAY_ID} — Q01 live-testing fixture. Apply to replay THE CONTRACT.`,
        author: {
            name: "Adrian Cole [DEV]",
            avatar: "assets/adrian-cole.png",
        },
    };

    override Objectives = [
        {
            name: Q01_OBJECTIVE_IDS.reviewScope,
            description: "Review audit scope",
        },
        {
            name: Q01_OBJECTIVE_IDS.scanNetwork,
            description: `Scan ${Q01_TARGET_IP}`,
            terminalCommand: `nmap ${Q01_TARGET_IP}`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.reviewScope],
        },
        {
            name: Q01_OBJECTIVE_IDS.identifyServices,
            description: "Identify exposed services",
            hint: "Check the scan for 22/ssh, 80/http, and 443/https.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.scanNetwork],
        },
        {
            name: Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            description: "Perform basic vulnerability checks",
            terminalCommand: Q01_SSH_COMMAND,
            hint: "Use the authorized audit account to verify SSH access.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Submit audit report",
            hint: "Send your findings to Adrian.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.basicVulnerabilityChecks],
        },
    ];

    override Mails = [
        {
            title: Q01_REPORT_SUBJECT,
            content: [
                "DEV REPLAY — Q01 TEST CONTRACT",
                "",
                "CLIENT",
                "Company: Meridian Logistics",
                "Location: Jakarta",
                `Target: ${Q01_TARGET_IP}`,
                "",
                "Scope:",
                "External infrastructure only.",
                "",
                "Authorized:",
                "Network discovery",
                "Service enumeration",
                "Basic vulnerability checks",
                "",
                "Temporary audit access:",
                `SSH user: ${Q01_SSH_USERNAME}`,
                `Audit access password: ${Q01_SSH_PASSWORD}`,
                "",
                "Not Authorized:",
                "Data extraction",
                "Internal access",
                "Credential attacks",
                "",
                "This mail belongs to the development replay fixture.",
                "— Adrian",
            ].join("\n"),
        },
        {
            title: "Re: Security Audit — Jakarta [DEV REPLAY]",
            content:
                "Looks clean.\n\nClient should be happy.\n\nDEV replay complete.\n\n— Adrian",
        },
    ];

    override CreateData(): Q01ReplayData {
        return {
            targetIp: Q01_TARGET_IP,
            networkScanned: false,
            servicesIdentified: false,
            basicVulnerabilityChecksCompleted: false,
            reportSubmitted: false,
            sshConnected: false,
        };
    }

    override OnStart() {
        this.sendMail(0);
        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);
        Shell.addCommandData(
            "ssh",
            Q01_SSH_COMMAND_INPUT,
            Q01_SSH_COMMAND_RESULT,
        );

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data as TerminalCommandData);
        });

        this.Events.on("Terminal.SSH.Connected", (ip) => {
            this.handleSshConnection(ip);
        });

        this.Events.on("Mail.Sent", (data) => {
            if (
                !this.isAuditReport(data.subject, data.content) ||
                !this.Data.basicVulnerabilityChecksCompleted
            ) {
                return;
            }

            if (!this.Data.reportSubmitted) {
                this.SetData("reportSubmitted", true);
                this.completeObjective(Q01_OBJECTIVE_IDS.submitAudit);
            }
        });
    }

    override OnComplete() {
        this.sendMail(1);
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Shell.removeCommandData("ssh", Q01_SSH_COMMAND_INPUT);
    }

    override OnAbandon() {
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Shell.removeCommandData("ssh", Q01_SSH_COMMAND_INPUT);
    }

    private handleTerminalCommand(data: TerminalCommandData): void {
        if (data.command === "ssh") {
            this.handleSshCommand(data.args);
            return;
        }

        if (
            data.command !== "nmap" ||
            data.args[0] !== this.Data.targetIp
        ) {
            return;
        }

        const result = Shell.getCommandData(
            "nmap",
            this.Data.targetIp,
        );

        if (!this.isExpectedNmapResult(result)) {
            return;
        }

        if (!this.Data.networkScanned) {
            this.SetData("networkScanned", true);
            this.completeObjective(Q01_OBJECTIVE_IDS.scanNetwork);
        }

        if (!this.Data.servicesIdentified) {
            this.SetData("servicesIdentified", true);
            this.completeObjective(
                Q01_OBJECTIVE_IDS.identifyServices,
            );
        }
    }

    private handleSshCommand(args: readonly string[]): void {
        if (
            args.length !== 2 ||
            args[0] !== "-h" ||
            args[1] !== Q01_SSH_COMMAND_INPUT.host ||
            !this.Data.servicesIdentified
        ) {
            return;
        }

        const result = Shell.getCommandData(
            "ssh",
            Q01_SSH_COMMAND_INPUT,
        );

        if (!this.isExpectedSshCommandResult(result)) {
            return;
        }

        if (
            result.ip !== this.Data.targetIp ||
            result.status !== "OPEN"
        ) {
            return;
        }

        if (!this.Data.sshConnected) {
            this.SetData("sshConnected", true);
            this.completeObjective(
                Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            );
        }
    }

    private handleSshConnection(ip: string): void {
        if (
            ip !== this.Data.targetIp ||
            !this.Data.servicesIdentified
        ) {
            return;
        }

        if (!this.Data.sshConnected) {
            this.SetData("sshConnected", true);
            this.completeObjective(
                Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            );
        }
    }

    private isExpectedSshCommandResult(
        result: unknown,
    ): result is Q01SshCommandData {
        return (
            typeof result === "object" &&
            result !== null &&
            "ip" in result &&
            "status" in result &&
            typeof result.ip === "string" &&
            (result.status === "OPEN" || result.status === "CLOSE")
        );
    }

    private isExpectedNmapResult(
        result: unknown,
    ): result is readonly Q01NmapPort[] {
        if (
            !Array.isArray(result) ||
            result.length !== Q01_NMAP_RESULT.length
        ) {
            return false;
        }

        return result.every((value): value is Q01NmapPort =>
            typeof value === "object" &&
            value !== null &&
            "port" in value &&
            "status" in value &&
            "service" in value &&
            typeof value.port === "number" &&
            value.status === "OPEN" &&
            typeof value.service === "string",
        ) && Q01_NMAP_RESULT.every((expected) =>
            result.some(
                (actual) =>
                    actual.port === expected.port &&
                    actual.status === expected.status &&
                    actual.service === expected.service,
            ),
        );
    }

    private isAuditReport(subject: string, content: string): boolean {
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedContent = content.toLowerCase();
        const reportBody = normalizedContent.trimStart();

        if (
            normalizedSubject !== Q01_REPORT_SUBJECT.toLowerCase() &&
            normalizedSubject !== `${Q01_REPORT_SUBJECT} [DEV REPLAY]`.toLowerCase()
        ) {
            return false;
        }

        if (!reportBody.startsWith("target: meridian logistics")) {
            return false;
        }

        return Q01_REPORT_REQUIRED_CONTENT.every((required) =>
            normalizedContent.includes(required.toLowerCase()),
        );
    }
}
