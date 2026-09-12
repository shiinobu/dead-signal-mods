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
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REPORT_BODY,
    Q01_REPORT_RECIPIENT,
    Q01_REPORT_SUBJECT,
    Q01_REWARDS,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_HOST,
    Q01_WEB_HTTPS_URL,
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
    readonly status: "OPEN" | "CLOSED";
    readonly service: string;
}

const Q01_NMAP_RESULT: Q01NmapPort[] = [
    { port: 22, status: "CLOSED", service: "ssh" },
    { port: 80, status: "CLOSED", service: "http" },
    { port: 443, status: "OPEN", service: "https" },
];

const Q01_INCOMING_MAIL_CONTENT = [
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
    `HTTPS: ${Q01_WEB_HTTPS_URL}`,
    "",
    "Not Authorized:",
    "Data extraction",
    "Internal access",
    "Credential attacks",
    "",
    "For the final submission, reply to this address using the subject below and the provided report text:",
    `To: ${Q01_REPORT_RECIPIENT}`,
    `Subject: ${Q01_REPORT_SUBJECT}`,
    "",
    Q01_REPORT_BODY,
    "",
    "— Adrian",
].join("\n");

const Q01_COMPLETION_MAIL_CONTENT = [
    "Looks clean.",
    "",
    "Client should be happy.",
    "",
    "Payment's on the way.",
    "",
    "I'll let you know if they need anything else.",
    "",
    "— Adrian",
].join("\n");

const markCanonicalCompletion = (): void => {
    gameRuntime.flagStore.set(Q01_FINAL_STATE_FLAG, true);
};

const sendAdrianMail = (subject: string, content: string): void => {
    Mail.send({
        from: Q01_ADRIAN_EMAIL,
        subject,
        content,
    });
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
            "Short security audit in Jakarta. One external network, a few services, basic vulnerability assessment. Adrian will provide the report submission format by email.",
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
            hint: "Inspect web service and review the security findings.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Submit audit report",
            hint: `Reply to ${Q01_REPORT_RECIPIENT} with subject \"${Q01_REPORT_SUBJECT}\". The report text is provided in Adrian's audit email.`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.basicVulnerabilityChecks],
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
                    active: false,
                    service: "ssh",
                },
                {
                    external: 80,
                    internal: 80,
                    active: false,
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

        sendAdrianMail(Q01_REPORT_SUBJECT, Q01_INCOMING_MAIL_CONTENT);
        this.SetData("auditScopeReviewed", true);
        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData("nmap", this.Data.targetIp, Q01_NMAP_RESULT);
        Shell.addCommandData("nmap", "", Q01_NMAP_RESULT);

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data);
        });

        this.Events.on("Browser.Meta", (data) => {
            this.handleBrowserMeta(data);
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

        sendAdrianMail("Re: Security Audit — Jakarta", Q01_COMPLETION_MAIL_CONTENT);
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Shell.removeCommandData("nmap", "");
        Network.removeDomain(Q01_WEB_HOST);
        Network.destroyNetwork(this.Data.targetIp);
        gameRuntime.persistence.save();
    }

    override OnAbandon() {
        Shell.removeCommandData("nmap", this.Data.targetIp);
        Shell.removeCommandData("nmap", "");
        Network.removeDomain(Q01_WEB_HOST);
        Network.destroyNetwork(this.Data.targetIp);
    }

    private handleTerminalCommand(data: TerminalCommandData): void {
        if (data.command !== "nmap") {
            return;
        }

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
    }

    private handleBrowserMeta(data: BrowserMetaData): void {
        if (
            this.Data.basicVulnerabilityChecksCompleted ||
            !this.Data.servicesIdentified
        ) {
            return;
        }

        if (
            data.protocol !== "https:" ||
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
                (value.status === "OPEN" || value.status === "CLOSED") &&
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
        const normalizedContent = content.trim();

        const subjectMatches =
            normalizedSubject === Q01_REPORT_SUBJECT.toLowerCase() ||
            normalizedSubject === `re: ${Q01_REPORT_SUBJECT}`.toLowerCase();

        return subjectMatches && normalizedContent === Q01_REPORT_BODY;
    }
}
