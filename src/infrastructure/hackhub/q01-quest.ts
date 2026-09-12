import {
    Network,
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CLIENT_NAME,
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REWARDS,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
    Q01_WEB_HTTP_URL,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_HTTPS_URL,
    Q01_WEB_HOST,
} from "../../content/index.js";

import { asId } from "../../core/index.js";
import { gameRuntime } from "./runtime.js";

interface Q01QuestData {
    readonly targetIp: string;
    readonly auditScopeReviewed: boolean;
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

const Q01_REPORT_SUBJECT = "Security Audit — Jakarta";

const Q01_REPORT_REQUIRED_CONTENT = [
    Q01_CLIENT_NAME,
    Q01_TARGET_IP,
    "22",
    "80",
    "443",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
];

const markCanonicalCompletion = (): void => {
    gameRuntime.flagStore.set(Q01_FINAL_STATE_FLAG, true);
};

@RegisterQuest
export class DeadSignalQ01Quest extends HackHubQuest<Q01QuestData> {
    override Name = "dead_signal.q01";
    override Title = "THE CONTRACT";
    override Description =
        `Complete a routine external security audit for ${Q01_CLIENT_NAME} in Jakarta.`;
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
    override HackhubPost = {
        content:
            "Short security audit in Jakarta. One external network, a few services, basic vulnerability assessment.",
        author: {
            name: "Adrian Cole",
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
            hint: "Send your findings to Adrian.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.basicVulnerabilityChecks],
        },
    ];

    override Mails = [
        {
            title: Q01_REPORT_SUBJECT,
            content: [
                "I have a client looking for a short security audit.",
                "",
                "Nothing complicated.",
                "One external network.",
                "A few services.",
                "Basic vulnerability assessment.",
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
                "If you're interested, send the audit back when you're done.",
                "",
                "— Adrian",
            ].join("\n"),
        },
        {
            title: "Re: Security Audit — Jakarta",
            content:
                "Looks clean.\n\nClient should be happy.\n\nPayment's on the way.\n\nI'll let you know if they need anything else.\n\n— Adrian",
        },
    ];

    override CreateData(): Q01QuestData {
        return {
            targetIp: Q01_TARGET_IP,
            auditScopeReviewed: false,
            networkScanned: false,
            servicesIdentified: false,
            basicVulnerabilityChecksCompleted: false,
            reportSubmitted: false,
        };
    }

    override OnStart() {
        gameRuntime.quest.start(Q01_THE_CONTRACT);

        Network.createSubnetNetwork({
            ip: this.Data.targetIp,
            type: Network.Type.Router,
            domain: {
                name: Q01_WEB_HOST,
            },
            ports: [
                {
                    external: 22,
                    internal: 22,
                    active: true,
                    service: "ssh",
                },
                {
                    external: 80,
                    internal: 80,
                    active: true,
                    service: "http",
                },
                {
                    external: 443,
                    internal: 443,
                    active: true,
                    service: "https",
                },
            ],
            users: [],
            children: [],
        });

        Network.registerDomain(Q01_WEB_HOST, this.Data.targetIp);

        this.sendMail(0);
        this.SetData("auditScopeReviewed", true);
        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data);
        });

        this.Events.on("Browser.Meta", (data) => {
            this.handleBrowserMeta(data);
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
        markCanonicalCompletion();

        const completed = gameRuntime.quest.complete(Q01_THE_CONTRACT);

        if (!completed) {
            throw new Error(
                "Q01 HackHub completion diverged from canonical runtime completion.",
            );
        }

        gameRuntime.reward.claim({
            id: asId<"Reward">("dead_signal.q01.xp.external-audit"),
            kind: "experience",
            amount: Q01_REWARDS.externalAudit,
        });

        gameRuntime.reward.claim({
            id: asId<"Reward">("dead_signal.q01.xp.network-service-enumeration"),
            kind: "experience",
            amount: Q01_REWARDS.networkServiceEnumeration,
        });

        gameRuntime.reward.claim({
            id: asId<"Reward">("dead_signal.q01.xp.basic-vulnerability-assessment"),
            kind: "experience",
            amount: Q01_REWARDS.basicVulnerabilityAssessment,
        });

        gameRuntime.reward.claim({
            id: asId<"Reward">("dead_signal.q01.xp.submit-report"),
            kind: "experience",
            amount: Q01_REWARDS.submitCorrectReport,
        });

        gameRuntime.economy.applyMissionReward(
            {
                id: asId<"MissionReward">("dead_signal.q01.money"),
                questId: "dead_signal.q01",
                amount: Q01_REWARDS.money,
                rewardIndex: 0,
            },
            Q01_FINAL_STATE_FLAG,
        );

        this.sendMail(1);
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Network.removeDomain(Q01_WEB_HOST);
        Network.destroyNetwork(this.Data.targetIp);
        gameRuntime.persistence.save();
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

        const isSupportedProtocol =
            data.protocol === "http:" || data.protocol === "https:";

        if (
            !isSupportedProtocol ||
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
    ): result is readonly Q01NmapPort[] {
        if (
            !Array.isArray(result) ||
            result.length !== Q01_NMAP_RESULT.length
        ) {
            return false;
        }

        return (
            result.every((value): value is Q01NmapPort =>
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
            normalizedSubject !== `re: ${Q01_REPORT_SUBJECT}`.toLowerCase()
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
