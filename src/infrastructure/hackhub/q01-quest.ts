import {
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REWARDS,
    Q01_SERVICE_CHECK_OPTION,
    Q01_SERVICE_CHECK_TARGET,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
} from "../../content/index.js";

import {
    asId,
} from "../../core/index.js";

import {
    gameRuntime,
} from "./runtime.js";

interface Q01QuestData {
    readonly targetIp: string;
    readonly auditScopeReviewed: boolean;
    readonly networkScanned: boolean;
    readonly servicesIdentified: boolean;
    readonly basicVulnerabilityChecksCompleted: boolean;
    readonly reportSubmitted: boolean;
}

interface Q01NmapPort {
    readonly port: number;
    readonly status: "OPEN";
    readonly service: string;
}

interface TerminalCommandData {
    readonly command: string;
    readonly args: string[];
}

const Q01_NMAP_RESULT: Q01NmapPort[] = [
    {
        port: 22,
        status: "OPEN",
        service: "ssh",
    },
    {
        port: 80,
        status: "OPEN",
        service: "http",
    },
    {
        port: 443,
        status: "OPEN",
        service: "https",
    },
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

const markCanonicalCompletion = (): void => {
    gameRuntime.flagStore.set(Q01_FINAL_STATE_FLAG, true);
};

@RegisterQuest
export class DeadSignalQ01Quest extends HackHubQuest<Q01QuestData> {
    override Name = "dead_signal.q01";
    override Title = "THE CONTRACT";
    override Description =
        "Complete a routine external security audit for Meridian Logistics in Jakarta.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: 0,
    };
    override HackhubPost = {
        content:
            "Short security audit in Jakarta. One external network, a few services, basic vulnerability assessment. Reply if interested.",
        author: {
            name: "Adrian Cole",
            avatar: "assets/adrian-cole.png",
        },
    };

    override Objectives = [
        {
            name: Q01_OBJECTIVE_IDS.reviewScope,
            description: "Review the scope",
        },
        {
            name: Q01_OBJECTIVE_IDS.scanNetwork,
            description: "Scan the IP",
            terminalCommand: `nmap ${Q01_TARGET_IP}`,
            unlocksAfter: [Q01_OBJECTIVE_IDS.reviewScope],
        },
        {
            name: Q01_OBJECTIVE_IDS.identifyServices,
            description: "Check the result",
            hint: "Look for 22/ssh, 80/http, and 443/https.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.scanNetwork],
        },
        {
            name: Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            description: "Run a basic security check",
            terminalCommand:
                `nmap ${Q01_SERVICE_CHECK_TARGET} ${Q01_SERVICE_CHECK_OPTION}`,
            hint:
                "This is a read-only service/version check. No exploitation is required.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.identifyServices],
        },
        {
            name: Q01_OBJECTIVE_IDS.submitAudit,
            description: "Send the report",
            hint:
                "Send it to Adrian. Include the target, ports 22/80/443, and your finding.",
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
        this.sendMail(0);
        this.SetData("auditScopeReviewed", true);
        this.completeObjective(Q01_OBJECTIVE_IDS.reviewScope);
    }

    override OnObjectivesStart() {
        Shell.addCommandData(
            "nmap",
            this.Data.targetIp,
            Q01_NMAP_RESULT,
        );

        this.Events.on("Terminal.Command", (data) => {
            this.handleTerminalCommand(data);
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

        const completed = gameRuntime.quest.complete(
            Q01_THE_CONTRACT,
        );

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
            id: asId<"Reward">(
                "dead_signal.q01.xp.network-service-enumeration",
            ),
            kind: "experience",
            amount: Q01_REWARDS.networkServiceEnumeration,
        });

        gameRuntime.reward.claim({
            id: asId<"Reward">(
                "dead_signal.q01.xp.basic-vulnerability-assessment",
            ),
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
        gameRuntime.persistence.save();
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

        const isServiceCheck = data.args.includes(Q01_SERVICE_CHECK_OPTION);

        if (isServiceCheck) {
            if (
                this.Data.servicesIdentified &&
                !this.Data.basicVulnerabilityChecksCompleted
            ) {
                this.SetData(
                    "basicVulnerabilityChecksCompleted",
                    true,
                );
                this.completeObjective(
                    Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
                );
            }

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

    private isAuditReport(
        subject: string,
        content: string,
    ): boolean {
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedContent = content.toLowerCase();
        const reportBody = normalizedContent.trimStart();

        if (
            normalizedSubject !== Q01_REPORT_SUBJECT.toLowerCase() &&
            normalizedSubject !== `re: ${Q01_REPORT_SUBJECT}`.toLowerCase()
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
