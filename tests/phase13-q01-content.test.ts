import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    Q01_ADRIAN_EMAIL,
    Q01_CLIENT_NAME,
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REPORT_BODY,
    Q01_REPORT_BODY_TEMPLATE,
    Q01_REPORT_RECIPIENT,
    Q01_REPORT_SUBJECT,
    Q01_REWARDS,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_AUDIT_URL,
    Q01_WEB_HOST,
    Q01_WEB_HOME_URL,
    Q01_WEB_HTTPS_URL,
} from "../src/content/index.js";

import { ConditionEvaluator } from "../src/domain/shared/index.js";

import {
    DomainStateAccess,
    FlagStore,
    StateStore,
    createDefaultRuntimeState,
} from "../src/state/index.js";

import { QuestService } from "../src/application/index.js";

describe("Phase 13 Q01 — THE CONTRACT", () => {
    it("matches the revised quest identity, client, target, and domain", () => {
        assert.equal(Q01_THE_CONTRACT.id, "dead_signal.q01");
        assert.equal(Q01_THE_CONTRACT.title, "THE CONTRACT");
        assert.equal(Q01_CLIENT_NAME, "Skynet Logistics");
        assert.equal(Q01_TARGET_IP, "203.0.113.42");
        assert.equal(Q01_WEB_HOST, "skynet-logistics.idx");
    });

    it("defines the public HTTPS home and security-review surface", () => {
        assert.equal(Q01_WEB_HOME_URL, "https://skynet-logistics.idx/");
        assert.equal(Q01_WEB_HTTPS_URL, Q01_WEB_HOME_URL);
        assert.equal(Q01_WEB_AUDIT_PATH, "/security");
        assert.equal(
            Q01_WEB_AUDIT_URL,
            "https://skynet-logistics.idx/security",
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
