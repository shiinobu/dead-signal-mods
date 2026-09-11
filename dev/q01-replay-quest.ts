import {
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CERTIFICATE_COMMAND,
    Q01_CERTIFICATE_TARGET,
    Q01_OBJECTIVE_IDS,
    Q01_TARGET_IP,
} from "../src/content/q01.js";

import { DEV_Q01_REPLAY_ID } from "./replay-id.generated.js";

interface Q01ReplayData {
    readonly targetIp: string;
    readonly networkScanned: boolean;
    readonly servicesIdentified: boolean;
    readonly certificateInspected: boolean;
    readonly reportSubmitted: boolean;
}

interface Q01NmapPort {
    readonly port: number;
    readonly status: "OPEN";
    readonly service: string;
}

const Q01_NMAP_RESULT: Q01NmapPort[] = [
    { port: 22, status: "OPEN", service: "ssh" },
    { port: 80, status: "OPEN", service: "http" },
    { port: 443, status: "OPEN", service: "https" },
];

const Q01_CERTIFICATE_RECORD = [
    "MERIDIAN LOGISTICS — HTTPS CERTIFICATE INSPECTION",
    "",
    `Target: ${Q01_TARGET_IP}`,
    "Port: 443/tcp",
    "Service: HTTPS",
    "",
    "Issuer: ARKA Secure Infrastructure",
].join("\n");

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

@RegisterQuest
export class DeadSignalQ01ReplayQuest extends HackHubQuest<Q01ReplayData> {
    override Name = `dead_signal.dev.q01.${DEV_Q01_REPLAY_ID}`;
    override Title = "THE CONTRACT — DEV REPLAY";
    override Description =
        "Development replay fixture for the Q01 live-validation flow.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
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
            description: "Review the authorized audit scope.",
        },
        {
            name: Q01_OBJECTIVE_IDS.scanNetwork,
            description: `Run nmap ${Q01_TARGET_IP} in Terminal.`,
            terminalCommand: `nmap ${Q01_TARGET_IP}`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.reviewScope],
        },
        {
            name: Q01_OBJECTIVE_IDS.identifyServices,
            description:
                "Confirm ports 22, 80, and 443 are exposed and identify their services.",
            info: "Expected services: 22/ssh, 80/http, 443/https.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.scanNetwork],
        },
        {
            name: Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            description:
                `Inspect the HTTPS certificate for port 443. Run: ${Q01_CERTIFICATE_COMMAND} ${Q01_CERTIFICATE_TARGET}`,
            terminalCommand: `${Q01_CERTIFICATE_COMMAND} ${Q01_CERTIFICATE_TARGET}`,
            info: "Read the returned certificate details. No exploitation is required.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Send the completed audit report to Adrian.",
            info:
                "Subject: Security Audit — Jakarta. Include the target, ports 22/80/443, and the finding that no critical vulnerabilities were identified.",
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
            certificateInspected: false,
            reportSubmitted: false,
        };
    }

    override OnStart() {
        this.sendMail(0);
        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);
        Shell.addCommandData(
            Q01_CERTIFICATE_COMMAND,
            Q01_CERTIFICATE_TARGET,
            Q01_CERTIFICATE_RECORD,
        );

        this.Events.on("Terminal.Command", (data) => {
            if (
                data.command === "nmap" &&
                data.args[0] === this.Data.targetIp
            ) {
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

                return;
            }

            if (
                data.command !== Q01_CERTIFICATE_COMMAND ||
                data.args[0] !== Q01_CERTIFICATE_TARGET ||
                !this.Data.servicesIdentified
            ) {
                return;
            }

            const result = Shell.getCommandData(
                Q01_CERTIFICATE_COMMAND,
                Q01_CERTIFICATE_TARGET,
            );

            if (
                result !== Q01_CERTIFICATE_RECORD ||
                this.Data.certificateInspected
            ) {
                return;
            }

            this.SetData("certificateInspected", true);
            this.completeObjective(
                Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            );
        });

        this.Events.on("Mail.Sent", (data) => {
            if (
                !this.isAuditReport(data.subject, data.content) ||
                !this.Data.certificateInspected
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
        Shell.removeCommandData(
            Q01_CERTIFICATE_COMMAND,
            Q01_CERTIFICATE_TARGET,
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
            normalizedSubject !== `${Q01_REPORT_SUBJECT} [dev replay]`.toLowerCase()
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
