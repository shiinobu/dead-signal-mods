import {
    Mail,
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_ADRIAN_EMAIL,
    Q01_CLIENT_NAME,
    Q01_OBJECTIVE_IDS,
    Q01_REPORT_BODY,
    Q01_REPORT_RECIPIENT,
    Q01_REPORT_SUBJECT,
    Q01_TARGET_IP,
    Q01_WEB_HTTP_URL,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_HTTPS_URL,
    Q01_WEB_HOST,
} from "../src/content/q01.js";

import { DEV_Q01_REPLAY_ID } from "./replay-id.generated.js";

interface Q01ReplayData {
    readonly targetIp: string;
    readonly networkScanned: boolean;
    readonly servicesIdentified: boolean;
    readonly basicVulnerabilityChecksCompleted: boolean;
    readonly reportSubmitted: boolean;
}

interface TerminalCommandData {
    readonly command: string;
    readonly args: string[];
}

interface BrowserMetaData {
    readonly protocol: string;
    readonly hostname: string;
    readonly pathname: string;
}

const Q01_NMAP_RESULT = [
    { port: 22, status: "OPEN", service: "ssh" },
    { port: 80, status: "OPEN", service: "http" },
    { port: 443, status: "OPEN", service: "https" },
] as const;

const Q01_REPORT_REQUIRED_CONTENT = [
    Q01_CLIENT_NAME,
    Q01_TARGET_IP,
    "22",
    "80",
    "443",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
];

const Q01_INCOMING_MAIL_CONTENT = [
    "DEV REPLAY — Q01 TEST CONTRACT",
    "",
    "CLIENT",
    `Company: ${Q01_CLIENT_NAME}`,
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
    "Web audit surface:",
    `HTTP: ${Q01_WEB_HTTP_URL}`,
    `HTTPS: ${Q01_WEB_HTTPS_URL}`,
    "",
    "Not Authorized:",
    "Data extraction",
    "Internal access",
    "Credential attacks",
    "",
    `Reply to ${Q01_REPORT_RECIPIENT} using the subject below and the provided report text:`,
    `Subject: ${Q01_REPORT_SUBJECT}`,
    "",
    Q01_REPORT_BODY,
    "",
    "This mail belongs to the development replay fixture.",
    "— Adrian",
].join("\n");

const Q01_COMPLETION_MAIL_CONTENT = [
    "Looks clean.",
    "",
    "Client should be happy.",
    "",
    "DEV replay complete.",
    "",
    "— Adrian",
].join("\n");

@RegisterQuest
export class DeadSignalQ01ReplayQuest extends HackHubQuest<Q01ReplayData> {
    override Name = `dead_signal.dev.q01.${DEV_Q01_REPLAY_ID}`;
    override Title = "THE CONTRACT — DEV REPLAY";
    override Description =
        "Development replay fixture for the revised Q01 HTTP/HTTPS audit flow.";
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
            hint: `Inspect ${Q01_WEB_HTTP_URL} or ${Q01_WEB_HTTPS_URL} and review the security findings.`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Submit audit report",
            hint: `Reply to ${Q01_REPORT_RECIPIENT} with subject \"${Q01_REPORT_SUBJECT}\". The exact report text is included in Adrian's audit email.`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.basicVulnerabilityChecks],
        },
    ];

    override CreateData(): Q01ReplayData {
        return {
            targetIp: Q01_TARGET_IP,
            networkScanned: false,
            servicesIdentified: false,
            basicVulnerabilityChecksCompleted: false,
            reportSubmitted: false,
        };
    }

    override OnStart() {
        Network.createSubnetNetwork({
            ip: this.Data.targetIp,
            type: Network.Type.Router,
            domain: {
                name: Q01_WEB_HOST,
            },
            ports: [
                { external: 22, internal: 22, active: true, service: "ssh" },
                { external: 80, internal: 80, active: true, service: "http" },
                { external: 443, internal: 443, active: true, service: "https" },
            ],
            users: [],
            children: [],
        });

        Network.registerDomain(Q01_WEB_HOST, this.Data.targetIp);

        Mail.send({
            from: Q01_ADRIAN_EMAIL,
            subject: Q01_REPORT_SUBJECT,
            content: Q01_INCOMING_MAIL_CONTENT,
        });

        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data as TerminalCommandData);
        });

        this.Events.on("Browser.Meta", (data) => {
            this.handleBrowserMeta(data as BrowserMetaData);
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
        Mail.send({
            from: Q01_ADRIAN_EMAIL,
            subject: `Re: ${Q01_REPORT_SUBJECT}`,
            content: Q01_COMPLETION_MAIL_CONTENT,
        });

        Shell.removeCommandData("nmap", this.Data.targetIp);
        Network.removeDomain(Q01_WEB_HOST);
        Network.destroyNetwork(this.Data.targetIp);
    }

    override OnAbandon() {
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Network.removeDomain(Q01_WEB_HOST);
        Network.destroyNetwork(this.Data.targetIp);
    }

    private handleTerminalCommand(data: TerminalCommandData): void {
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
            this.completeObjective(Q01_OBJECTIVE_IDS.identifyServices);
        }
    }

    private handleBrowserMeta(data: BrowserMetaData): void {
        if (
            this.Data.basicVulnerabilityChecksCompleted ||
            !this.Data.servicesIdentified
        ) {
            return;
        }

        const supportedProtocol =
            data.protocol === "http:" || data.protocol === "https:";

        if (
            !supportedProtocol ||
            data.hostname !== Q01_WEB_HOST ||
            data.pathname !== Q01_WEB_AUDIT_PATH
        ) {
            return;
        }

        this.SetData("basicVulnerabilityChecksCompleted", true);
        this.completeObjective(Q01_OBJECTIVE_IDS.basicVulnerabilityChecks);
    }

    private isExpectedNmapResult(
        result: unknown,
    ): result is readonly typeof Q01_NMAP_RESULT[number][] {
        if (
            !Array.isArray(result) ||
            result.length !== Q01_NMAP_RESULT.length
        ) {
            return false;
        }

        return (
            result.every((value): value is typeof Q01_NMAP_RESULT[number] =>
                typeof value === "object" &&
                value !== null &&
                "port" in value &&
                "status" in value &&
                "service" in value &&
                typeof value.port === "number" &&
                value.status === "OPEN" &&
                typeof value.service === "string",
            ) &&
            Q01_NMAP_RESULT.every((expected) =>
                result.some(
                    (actual) =>
                        actual.port === expected.port &&
                        actual.status === expected.status &&
                        actual.service === expected.service,
                ),
            )
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

        if (!reportBody.startsWith(`target: ${Q01_CLIENT_NAME.toLowerCase()}`)) {
            return false;
        }

        return Q01_REPORT_REQUIRED_CONTENT.every((required) =>
            normalizedContent.includes(required.toLowerCase()),
        );
    }
}
