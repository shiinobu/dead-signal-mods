import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    Q01_CLIENT_NAME,
    Q01_FINAL_STATE_FLAG,
    Q01_OBJECTIVE_IDS,
    Q01_REWARDS,
    Q01_TARGET_IP,
    Q01_THE_CONTRACT,
    Q01_WEB_HTTP_URL,
    Q01_WEB_HTTPS_URL,
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_HOST,
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
    it("matches the revised quest identity, client, and target", () => {
        assert.equal(Q01_THE_CONTRACT.id, "dead_signal.q01");
        assert.equal(Q01_THE_CONTRACT.title, "THE CONTRACT");
        assert.equal(Q01_CLIENT_NAME, "Skynet Logistics");
        assert.equal(Q01_TARGET_IP, "203.0.113.42");
    });

    it("defines the revised HTTP/HTTPS audit interaction", () => {
        assert.equal(Q01_WEB_HOST, "skynet-logistics.test");
        assert.equal(Q01_WEB_AUDIT_PATH, "/security");
        assert.equal(
            Q01_WEB_HTTP_URL,
            "http://skynet-logistics.test/security",
        );
        assert.equal(
            Q01_WEB_HTTPS_URL,
            "https://skynet-logistics.test/security",
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
