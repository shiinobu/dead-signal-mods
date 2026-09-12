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
    Q01_LYNX_INPUT_IP,
    Q01_LYNX_INPUT_URL,
    Q01_OBJECTIVE_IDS,
    Q01_REPORT_BODY,
    Q01_REPORT_BODY_TEMPLATE,
    Q01_REPORT_RECIPIENT,
    Q01_REPORT_SUBJECT,
    Q01_SUBFINDER_INPUT_VARIANTS,
    Q01_SUBFINDER_RESULT,
    Q01_TARGET_IP,
    Q01_WEB_AUDIT_HOST,
    Q01_WEB_HOST,
    Q01_WEB_HOME_URL,
    Q01_WEB_SUBDOMAINS,
} from "../src/content/q01.js";

import { DEV_Q01_REPLAY_ID } from "./replay-id.generated.js";

interface Q01ReplayData {
    readonly targetIp: string;
    readonly networkScanned: boolean;
    readonly servicesIdentified: boolean;
    readonly lynxDiscovered: boolean;
    readonly subdomainsEnumerated: boolean;
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

interface Q01LynxResult {
    readonly ips?: readonly string[];
    readonly address?: readonly string[];
    readonly additional?: readonly string[];
}

const Q01_NMAP_RESULT = [
    { port: 22, status: "CLOSE", service: "ssh" },
    { port: 80, status: "CLOSE", service: "http" },
    { port: 443, status: "OPEN", service: "https" },
] as const;

const Q01_LYNX_RESULT: Q01LynxResult = {
    ips: [Q01_TARGET_IP],
    address: [Q01_WEB_HOME_URL],
    additional: [
        Q01_CLIENT_NAME,
        "Jakarta Operations",
        "Canonical public web host discovered from the target IP.",
    ],
};

const resetQ01ShellFixtures = (): void => {
    Shell.removeCommandData("nmap", Q01_TARGET_IP);
    Shell.removeCommandData("nmap", "");
    Shell.removeCommandData("lynx", Q01_LYNX_INPUT_IP);
    Shell.removeCommandData("lynx", Q01_LYNX_INPUT_URL);
    Q01_SUBFINDER_INPUT_VARIANTS.forEach((input) => {
        Shell.removeCommandData("subfinder", input);
    });
};

const Q01_INCOMING_MAIL_CONTENT = [
    "DEV REPLAY — Q01 TEST CONTRACT",
    "",
    "CLIENT",
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
    "Format report audit:",
    `Subject: ${Q01_REPORT_SUBJECT}`,
    "",
    Q01_REPORT_BODY_TEMPLATE,
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
        "Development replay fixture for the revised Q01 reconnaissance flow.";
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
            description: "Scan the ip target",
            terminalCommand: "nmap",
            unlocksAfter: [Q01_OBJECTIVE_IDS.reviewScope],
        },
        {
            name: Q01_OBJECTIVE_IDS.identifyServices,
            description: "Identify exposed services",
            unlocksAfter: [Q01_OBJECTIVE_IDS.scanNetwork],
        },
        {
            name: Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            description: "Perform basic vulnerability checks",
            hint: "Discover the public web host with lynx, enumerate its subdomains, then inspect the authorized security surface.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Submit audit report",
            hint: `Reply to ${Q01_REPORT_RECIPIENT} with subject \"${Q01_REPORT_SUBJECT}\". Fill in the company and open-port values you discovered during the audit.`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.basicVulnerabilityChecks],
        },
    ];

    override CreateData(): Q01ReplayData {
        return {
            targetIp: Q01_TARGET_IP,
            networkScanned: false,
            servicesIdentified: false,
            lynxDiscovered: false,
            subdomainsEnumerated: false,
            basicVulnerabilityChecksCompleted: false,
            reportSubmitted: false,
        };
    }

    override OnStart() {
        Network.createSubnetNetwork({
            ip: this.Data.targetIp,
            type: Network.Type.Router,
            ports: [
                { external: 22, internal: 22, active: false, service: "ssh" },
                { external: 80, internal: 80, active: false, service: "http" },
                { external: 443, internal: 443, active: true, service: "https" },
            ],
            users: [],
            children: [],
        });

        Network.registerDomain(Q01_WEB_HOST, this.Data.targetIp);
        Q01_WEB_SUBDOMAINS.forEach((hostname) => {
            Network.registerDomain(hostname, this.Data.targetIp);
        });

        Mail.send({
            from: Q01_ADRIAN_EMAIL,
            subject: Q01_REPORT_SUBJECT,
            content: Q01_INCOMING_MAIL_CONTENT,
        });

        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        resetQ01ShellFixtures();
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);
        Shell.addCommandData("nmap", "", Q01_NMAP_RESULT);
        Shell.addCommandData("lynx", Q01_LYNX_INPUT_IP, Q01_LYNX_RESULT);
        Shell.addCommandData("lynx", Q01_LYNX_INPUT_URL, Q01_LYNX_RESULT);
        Q01_SUBFINDER_INPUT_VARIANTS.forEach((input) => {
            Shell.addCommandData("subfinder", input, Q01_SUBFINDER_RESULT);
        });

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data as TerminalCommandData);
        });

        this.Events.on("Browser.Meta", (data) => {
            this.handleBrowserMeta(data as BrowserMetaData);
        });

        this.Events.on("Mail.Sent", (data) => {
            if (!this.isAuditReport(data.subject, data.content)) {
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

        resetQ01ShellFixtures();
        Network.removeDomain(Q01_WEB_HOST);
        Q01_WEB_SUBDOMAINS.forEach((hostname) => {
            Network.removeDomain(hostname);
        });
        Network.destroyNetwork(this.Data.targetIp);
    }

    override OnAbandon() {
        resetQ01ShellFixtures();
        Network.removeDomain(Q01_WEB_HOST);
        Q01_WEB_SUBDOMAINS.forEach((hostname) => {
            Network.removeDomain(hostname);
        });
        Network.destroyNetwork(this.Data.targetIp);
    }

    private handleTerminalCommand(data: TerminalCommandData): void {
        const input = data.args.join(" ").trim();

        if (data.command === "nmap") {
            if (
                data.args.length > 0 &&
                data.args[0] !== this.Data.targetIp
            ) {
                return;
            }

            const result = Shell.getCommandData(
                "nmap",
                data.args.length === 0 ? "" : this.Data.targetIp,
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

            return;
        }

        if (data.command === "lynx") {
            if (input !== Q01_LYNX_INPUT_IP && input !== Q01_LYNX_INPUT_URL) {
                return;
            }

            const result = Shell.getCommandData("lynx", input);

            if (!this.isExpectedLynxResult(result)) {
                return;
            }

            this.SetData("lynxDiscovered", true);
            return;
        }

        if (data.command === "subfinder") {
            if (
                !Q01_SUBFINDER_INPUT_VARIANTS.includes(
                    input as typeof Q01_SUBFINDER_INPUT_VARIANTS[number],
                )
            ) {
                return;
            }

            const result = Shell.getCommandData("subfinder", input);

            if (result !== Q01_SUBFINDER_RESULT) {
                return;
            }

            this.SetData("subdomainsEnumerated", true);
        }
    }

    private handleBrowserMeta(data: BrowserMetaData): void {
        if (
            this.Data.basicVulnerabilityChecksCompleted ||
            !this.Data.servicesIdentified ||
            !this.Data.lynxDiscovered ||
            !this.Data.subdomainsEnumerated
        ) {
            return;
        }

        if (
            data.protocol !== "https:" ||
            data.hostname !== Q01_WEB_AUDIT_HOST ||
            data.pathname !== "/"
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

        return Q01_NMAP_RESULT.every((expected) =>
            result.some(
                (actual) =>
                    actual &&
                    typeof actual === "object" &&
                    "port" in actual &&
                    "status" in actual &&
                    "service" in actual &&
                    actual.port === expected.port &&
                    actual.status === expected.status &&
                    actual.service === expected.service,
            ),
        );
    }

    private isExpectedLynxResult(result: unknown): result is Q01LynxResult {
        if (typeof result !== "object" || result === null) {
            return false;
        }

        if (
            !("address" in result) ||
            !Array.isArray(result.address) ||
            !result.address.includes(Q01_WEB_HOME_URL)
        ) {
            return false;
        }

        if (!("ips" in result) || !Array.isArray(result.ips)) {
            return false;
        }

        return result.ips.includes(Q01_TARGET_IP);
    }

    private isAuditReport(subject: string, content: string): boolean {
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedContent = content.trim();
        const subjectMatches =
            normalizedSubject === Q01_REPORT_SUBJECT.toLowerCase() ||
            normalizedSubject === `re: ${Q01_REPORT_SUBJECT}`.toLowerCase();

        return subjectMatches && normalizedContent === Q01_REPORT_BODY;
    }
}
