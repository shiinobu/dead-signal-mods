import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
    Q01_ADRIAN_EMAIL,
    Q01_CLIENT_NAME,
    Q01_FINAL_STATE_FLAG,
    Q01_LYNX_INPUT_IP,
    Q01_LYNX_INPUT_URL,
    Q01_OBJECTIVE_IDS,
    Q01_REPORT_BODY,
    Q01_REPORT_BODY_TEMPLATE,
    Q01_REPORT_RECIPIENT,
    Q01_REPORT_SUBJECT,
    Q01_REWARDS,
    Q01_SUBFINDER_INPUT,
    Q01_SUBFINDER_INPUT_VARIANTS,
    Q01_SUBFINDER_RESULT,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
    Q01_WEB_AUDIT_HOST,
    Q01_WEB_AUDIT_URL,
    Q01_WEB_FORBIDDEN_HOSTS,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
    Q01_WEB_HOME_URL,
    Q01_WEB_HTTPS_URL,
    Q01_WEB_SUBDOMAINS,
} from "../src/content/index.js";

import { ConditionEvaluator } from "../src/domain/shared/index.js";

import {
    DomainStateAccess,
    FlagStore,
    StateStore,
    createDefaultRuntimeState,
} from "../src/state/index.js";

import { QuestService } from "../src/application/index.js";

const questSource = readFileSync(
    resolve(fileURLToPath(new URL("../src/infrastructure/hackhub/q01-quest.ts", import.meta.url))),
    "utf8",
);

const replayQuestSource = readFileSync(
    resolve(fileURLToPath(new URL("../dev/q01-replay-quest.ts", import.meta.url))),
    "utf8",
);

const subfinderCommandSource = readFileSync(
    resolve(fileURLToPath(new URL("../src/infrastructure/hackhub/commands/q01-subfinder.ts", import.meta.url))),
    "utf8",
);

const productionEntrySource = readFileSync(
    resolve(fileURLToPath(new URL("../src/index.ts", import.meta.url))),
    "utf8",
);

const replayEntrySource = readFileSync(
    resolve(fileURLToPath(new URL("../dev/q01-replay-entry.ts", import.meta.url))),
    "utf8",
);

describe("Phase 13 Q01 — THE CONTRACT", () => {
    it("matches the revised quest identity, client, target, and apex domain", () => {
        assert.equal(Q01_THE_CONTRACT.id, "dead_signal.q01");
        assert.equal(Q01_THE_CONTRACT.title, "THE CONTRACT");
        assert.equal(Q01_CLIENT_NAME, "Skynet Logistics");
        assert.equal(Q01_TARGET_IP, "203.0.113.42");
        assert.equal(Q01_WEB_HOST, "skynet-logistics.idx");
    });

    it("defines the canonical public and audit subdomains", () => {
        assert.equal(Q01_WEB_HOME_HOST, "www.skynet-logistics.idx");
        assert.equal(Q01_WEB_AUDIT_HOST, "security.skynet-logistics.idx");
        assert.deepEqual(Q01_WEB_FORBIDDEN_HOSTS, [
            "portal.skynet-logistics.idx",
            "status.skynet-logistics.idx",
        ]);
        assert.deepEqual(Q01_WEB_SUBDOMAINS, [
            "www.skynet-logistics.idx",
            "portal.skynet-logistics.idx",
            "status.skynet-logistics.idx",
            "security.skynet-logistics.idx",
        ]);
        assert.equal(Q01_WEB_SUBDOMAINS.length, 4);
        assert.equal(Q01_WEB_HOME_URL, "https://www.skynet-logistics.idx/");
        assert.equal(Q01_WEB_HTTPS_URL, Q01_WEB_HOME_URL);
        assert.equal(Q01_WEB_AUDIT_URL, "https://security.skynet-logistics.idx/");
    });

    it("defines the Lynx target and format-tolerant subfinder reconnaissance contract", () => {
        assert.equal(Q01_LYNX_INPUT_IP, "203.0.113.42");
        assert.equal(
            Q01_LYNX_INPUT_URL,
            "https://203.0.113.42/",
        );
        assert.equal(Q01_SUBFINDER_INPUT, "-d https://www.skynet-logistics.idx/");
        assert.deepEqual(Q01_SUBFINDER_INPUT_VARIANTS, [
            "-d https://www.skynet-logistics.idx/",
            "-d skynet-logistics.idx",
            "-d www.skynet-logistics.idx",
            "-d https://skynet-logistics.idx",
            "-d https://skynet-logistics.idx/",
            "-d https://www.skynet-logistics.idx",
            "skynet-logistics.idx",
            "www.skynet-logistics.idx",
            "https://skynet-logistics.idx",
            "https://www.skynet-logistics.idx",
            "https://skynet-logistics.idx/",
            "https://www.skynet-logistics.idx/",
        ]);
        assert.equal(
            Q01_SUBFINDER_RESULT,
            "portal.skynet-logistics.idx\nsecurity.skynet-logistics.idx\nstatus.skynet-logistics.idx\nwww.skynet-logistics.idx",
        );
    });

    it("registers the Q01 custom subfinder command in production and replay", () => {
        assert.match(
            subfinderCommandSource,
            /@RegisterCommand/,
        );
        assert.match(
            subfinderCommandSource,
            /CommandName\s*=\s*"subfinder"/,
        );
        assert.match(
            subfinderCommandSource,
            /async Run\(tools(?:\s*:\s*Q01SubfinderTools)?\)/,
        );
        assert.match(
            productionEntrySource,
            /import "\.\/infrastructure\/hackhub\/commands\/q01-subfinder\.js";/,
        );
        assert.match(
            replayEntrySource,
            /import "\.\.\/src\/infrastructure\/hackhub\/commands\/q01-subfinder\.js";/,
        );
        assert.doesNotMatch(
            questSource,
            /Shell\.addCommandData\("subfinder"/,
        );
        assert.doesNotMatch(
            replayQuestSource,
            /Shell\.addCommandData\("subfinder"/,
        );
    });

    it("keeps the Lynx address as one runtime list entry and resets stale fixtures before registration", () => {
        assert.match(
            questSource,
            /address:\s*\[Q01_WEB_HOME_URL\],/,
        );
        assert.doesNotMatch(
            questSource,
            /Q01_WEB_HOME_URL\s+as unknown as string\[\]/,
        );
        assert.match(
            questSource,
            /Shell\.removeCommandData\("lynx", Q01_LYNX_INPUT_IP\);[\s\S]*Shell\.addCommandData\("lynx", Q01_LYNX_INPUT_IP, Q01_LYNX_RESULT\);/,
        );
        assert.match(
            questSource,
            /Shell\.removeCommandData\("lynx", Q01_LYNX_INPUT_URL\);[\s\S]*Shell\.addCommandData\("lynx", Q01_LYNX_INPUT_URL, Q01_LYNX_RESULT\);/,
        );
    });

    it("defines the canonical email identity and player-facing report template", () => {
        assert.equal(Q01_ADRIAN_EMAIL, "adrian.cole@deadsignal.lock");
        assert.equal(Q01_REPORT_RECIPIENT, Q01_ADRIAN_EMAIL);
        assert.equal(Q01_REPORT_SUBJECT, "Security Audit — Jakarta");
        assert.equal(
            Q01_REPORT_BODY_TEMPLATE,
            "Target: <COMPANY>\nOpen Ports: <PORTS>\n\nNo critical vulnerabilities identified.\nFurther internal assessment is recommended.",
        );
        assert.equal(
            Q01_REPORT_BODY,
            "Target: Skynet Logistics\nOpen Ports: 443\n\nNo critical vulnerabilities identified.\nFurther internal assessment is recommended.",
        );
    });

    it("preserves the five locked player objective ids", () => {
        assert.deepEqual(
            Q01_OBJECTIVE_IDS,
            {
                reviewScope: "q01.objective.01",
                scanNetwork: "q01.objective.02",
                identifyServices: "q01.objective.03",
                basicVulnerabilityChecks: "q01.objective.04",
                submitAudit: "q01.objective.05",
            },
        );
    });

    it("uses the canonical completion flag as its runtime completion boundary", () => {
        const stateStore = new StateStore(createDefaultRuntimeState());
        const flagStore = new FlagStore(stateStore);
        const service = new QuestService(
            new DomainStateAccess(stateStore),
            new ConditionEvaluator(flagStore),
        );

        assert.equal(
            service.areObjectivesComplete(Q01_THE_CONTRACT),
            false,
        );

        flagStore.set(Q01_FINAL_STATE_FLAG, true);

        assert.equal(
            service.areObjectivesComplete(Q01_THE_CONTRACT),
            true,
        );
    });

    it("preserves the Phase 8 Q01 XP allocation and final money reward", () => {
        assert.deepEqual(
            Q01_REWARDS,
            {
                externalAudit: 35,
                networkServiceEnumeration: 20,
                basicVulnerabilityAssessment: 10,
                submitCorrectReport: 15,
                money: 200,
            },
        );

        assert.equal(
            Q01_REWARDS.externalAudit +
            Q01_REWARDS.networkServiceEnumeration +
            Q01_REWARDS.basicVulnerabilityAssessment +
            Q01_REWARDS.submitCorrectReport,
            80,
        );
    });
});
