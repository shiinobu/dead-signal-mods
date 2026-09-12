import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const q01Source = readFileSync(resolve(projectRoot, "src/content/q01.ts"), "utf8");
const questSource = readFileSync(resolve(projectRoot, "src/infrastructure/hackhub/q01-quest.ts"), "utf8");
const reconCommandSource = readFileSync(resolve(projectRoot, "src/infrastructure/hackhub/commands/recon.ts"), "utf8");
const productionEntrySource = readFileSync(resolve(projectRoot, "src/index.ts"), "utf8");
const replayEntrySource = readFileSync(resolve(projectRoot, "dev/q01-replay-entry.ts"), "utf8");

const Q01_RECON_RESULT = [
    "portal.skynet-logistics.idx",
    "security.skynet-logistics.idx",
    "status.skynet-logistics.idx",
    "www.skynet-logistics.idx",
].join("\n");

const Q01_RECON_PROFILE = {
    id: "q01",
    resultHosts: [
        "portal.skynet-logistics.idx",
        "security.skynet-logistics.idx",
        "status.skynet-logistics.idx",
        "www.skynet-logistics.idx",
    ],
};

describe("Phase 13 Q01 — THE CONTRACT", () => {
    it("matches the revised quest identity, client, target, and apex domain", () => {
        assert.match(q01Source, /Q01_CLIENT_NAME\s*=\s*"Skynet Logistics"/);
        assert.match(q01Source, /Q01_TARGET_IP\s*=\s*"203\.0\.113\.42"/);
        assert.match(q01Source, /Q01_WEB_HOST\s*=\s*"skynet-logistics\.idx"/);
        assert.match(q01Source, /chapterId:\s*"chapter-01-dead-signal"/);
    });

    it("defines the canonical public and audit subdomains", () => {
        assert.match(q01Source, /Q01_WEB_HOME_HOST/);
        assert.match(q01Source, /Q01_WEB_AUDIT_HOST/);
        assert.match(q01Source, /Q01_WEB_FORBIDDEN_HOSTS/);
        assert.match(q01Source, /security\.skynet-logistics\.idx/);
    });

    it("defines the reusable recon input variants and deterministic Q01 profile", () => {
        assert.match(q01Source, /Q01_RECON_INPUT_VARIANTS/);
        assert.match(q01Source, /Q01_RECON_PROFILE/);
        assert.equal(
            Q01_RECON_RESULT,
            "portal.skynet-logistics.idx\nsecurity.skynet-logistics.idx\nstatus.skynet-logistics.idx\nwww.skynet-logistics.idx",
        );
        assert.equal(Q01_RECON_PROFILE.id, "q01");
        assert.deepEqual(Q01_RECON_PROFILE.resultHosts, [
            "portal.skynet-logistics.idx",
            "security.skynet-logistics.idx",
            "status.skynet-logistics.idx",
            "www.skynet-logistics.idx",
        ]);
    });

    it("registers the shared recon command in production and replay", () => {
        assert.match(
            reconCommandSource,
            /@RegisterCommand\(\{\s*default:\s*true\s*\}\)/,
        );
        assert.match(reconCommandSource, /CommandName\s*=\s*"recon"/);
        assert.match(reconCommandSource, /opsRuntime\.runRecon/);
        assert.match(
            productionEntrySource,
            /import "\.\/infrastructure\/hackhub\/commands\/recon\.js";/,
        );
        assert.match(
            replayEntrySource,
            /import "\.\.\/src\/infrastructure\/hackhub\/commands\/recon\.js";/,
        );
    });

    it("keeps the Lynx address as one runtime list entry and resets stale fixtures before registration", () => {
        assert.match(questSource, /address:\s*\[Q01_WEB_HOME_URL\],/);
        assert.doesNotMatch(
            questSource,
            /Q01_WEB_HOME_URL\s+as unknown as string\[\]/,
        );
        assert.match(questSource, /registerQ01ShellFixtures\(\)/);
        assert.match(questSource, /resetQ01ShellFixtures\(\)/);
    });

    it("defines the canonical email identity and player-facing report template", () => {
        assert.match(q01Source, /Q01_REPORT_BODY_TEMPLATE/);
        assert.match(q01Source, /Target: <COMPANY>/);
        assert.match(q01Source, /Open Ports: <PORTS>/);
    });

    it("preserves the five locked player objective ids", () => {
        assert.match(q01Source, /reviewScope:\s*"q01\.objective\.01"/);
        assert.match(q01Source, /scanNetwork:\s*"q01\.objective\.02"/);
        assert.match(q01Source, /identifyServices:\s*"q01\.objective\.03"/);
        assert.match(q01Source, /basicVulnerabilityChecks:\s*"q01\.objective\.04"/);
        assert.match(q01Source, /submitAudit:\s*"q01\.objective\.05"/);
    });

    it("uses the canonical completion flag as its runtime completion boundary", () => {
        assert.match(q01Source, /Q01_FINAL_STATE_FLAG\s*=\s*"dead_signal\.q01\.completed"/);
    });

    it("preserves the Phase 8 Q01 XP allocation and final money reward", () => {
        assert.match(q01Source, /externalAudit:\s*35/);
        assert.match(q01Source, /networkServiceEnumeration:\s*20/);
        assert.match(q01Source, /basicVulnerabilityAssessment:\s*10/);
        assert.match(q01Source, /submitCorrectReport:\s*15/);
        assert.match(q01Source, /money:\s*200/);
    });
});
