import {
    Files,
    Quest as HackHubQuest,
    RegisterQuest,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_CERTIFICATE_FILE_PATH,
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REWARDS,
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
const Q01_CERTIFICATE_FILE_NAME = "meridian-443-certificate";
const Q01_CERTIFICATE_RECORD = [
    "MERIDIAN LOGISTICS — HTTPS CERTIFICATE INSPECTION",
    "",
    `Target: ${Q01_TARGET_IP}`,
    "Port: 443/tcp",
    "Service: HTTPS",
    "",
    "Issuer: ARKA Secure Infrastructure",
].join("\n");

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
                "Confirm that ports 22, 80, and 443 are exposed and identify their services.",
            info: "Expected services: 22/ssh, 80/http, 443/https.",
            unlocksAfter: [Q01_OBJECTIVE_IDS.scanNetwork],
        },
        {
            name: Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            description:
                `Inspect the HTTPS certificate record for port 443. Open ${Q01_CERTIFICATE_FILE_PATH}.`,
            hint: `File: ${Q01_CERTIFICATE_FILE_PATH}`,
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

        if (this.Data.servicesIdentified) {
            void this.ensureCertificateRecord();
        }

        this.Events.on("Terminal.Command", (data) => {
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

            void this.ensureCertificateRecord();
        });

        this.Events.on("Files.Open", (data) => {
            if (
                this.Data.basicVulnerabilityChecksCompleted ||
                !this.Data.servicesIdentified ||
                !this.isCertificateOpenEvent(data)
            ) {
                return;
            }

            this.SetData(
                "basicVulnerabilityChecksCompleted",
                true,
            );
            this.completeObjective(
                Q01_OBJECTIVE_IDS.basicVulnerabilityChecks,
            );
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

    private async ensureCertificateRecord(): Promise<void> {
        try {
            if (await Files.exists(Q01_CERTIFICATE_FILE_PATH)) {
                return;
            }

            await Files.create({
                name: Q01_CERTIFICATE_FILE_NAME,
                extension: "txt",
                data: Q01_CERTIFICATE_RECORD,
                parentPath: "~",
            });
        } catch (error) {
            console.error(
                "DEAD SIGNAL Q01: failed to create certificate inspection record.",
                error,
            );
        }
    }

    private isCertificateOpenEvent(data: unknown): boolean {
        const payload = data as {
            fileId?: unknown;
            id?: unknown;
            name?: unknown;
            path?: unknown;
        };

        return (
            payload.name === `${Q01_CERTIFICATE_FILE_NAME}.txt` ||
            payload.path === Q01_CERTIFICATE_FILE_PATH
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
