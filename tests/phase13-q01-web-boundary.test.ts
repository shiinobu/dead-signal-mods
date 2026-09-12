import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
    Q01_WEB_AUDIT_HOST,
    Q01_WEB_AUDIT_URL,
    Q01_WEB_FORBIDDEN_HOSTS,
    Q01_WEB_HOME_HOST,
    Q01_WEB_HOME_URL,
    Q01_WEB_SUBDOMAINS,
} from "../src/content/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const websiteDir = resolve(
    __dirname,
    "../src/infrastructure/hackhub/websites",
);

const homePage = readFileSync(resolve(websiteDir, "q01-home.html"), "utf8");
const forbiddenPage = readFileSync(
    resolve(websiteDir, "q01-forbidden.html"),
    "utf8",
);
const securityPage = readFileSync(
    resolve(websiteDir, "q01-security.html"),
    "utf8",
);
const websiteRegistration = readFileSync(
    resolve(websiteDir, "q01-skynet-portal.ts"),
    "utf8",
);

describe("Phase 13 Q01 — web subdomain boundary", () => {
    it("defines exactly four subdomains", () => {
        assert.equal(Q01_WEB_SUBDOMAINS.length, 4);
        assert.deepEqual(Q01_WEB_SUBDOMAINS, [
            "www.skynet-logistics.idx",
            "portal.skynet-logistics.idx",
            "status.skynet-logistics.idx",
            "security.skynet-logistics.idx",
        ]);
        assert.deepEqual(Q01_WEB_FORBIDDEN_HOSTS, [
            "portal.skynet-logistics.idx",
            "status.skynet-logistics.idx",
        ]);
    });

    it("keeps www as the public homepage and security as the audit target", () => {
        assert.equal(Q01_WEB_HOME_HOST, "www.skynet-logistics.idx");
        assert.equal(Q01_WEB_HOME_URL, "https://www.skynet-logistics.idx/");
        assert.equal(Q01_WEB_AUDIT_HOST, "security.skynet-logistics.idx");
        assert.equal(Q01_WEB_AUDIT_URL, "https://security.skynet-logistics.idx/");
    });

    it("registers all four subdomains as root-page website surfaces", () => {
        assert.match(websiteRegistration, /Host = Q01_WEB_HOME_HOST/);
        assert.match(websiteRegistration, /Host = Q01_WEB_FORBIDDEN_HOSTS\[0\]/);
        assert.match(websiteRegistration, /Host = Q01_WEB_FORBIDDEN_HOSTS\[1\]/);
        assert.match(websiteRegistration, /Host = Q01_WEB_AUDIT_HOST/);
        assert.equal(
            (websiteRegistration.match(/Pages: WebsitePageDefinition\[\] = \[/g) ?? []).length,
            4,
        );
        assert.match(websiteRegistration, /const rootPage = \(/);
        assert.match(websiteRegistration, /path: \"\/\"/);
        assert.equal(
            (websiteRegistration.match(/\n\s+rootPage\(/g) ?? []).length,
            4,
        );
    });

    it("keeps only the security subdomain as the real audit page", () => {
        assert.match(securityPage, /SECURITY REVIEW/);
        assert.match(securityPage, /Skynet Logistics/);
        assert.match(websiteRegistration, /Host = Q01_WEB_AUDIT_HOST/);
        assert.match(websiteRegistration, /securityPage/);
    });

    it("serves 403 forbidden content on the other subdomains", () => {
        assert.match(forbiddenPage, /403/);
        assert.match(forbiddenPage, /FORBIDDEN/);
        assert.doesNotMatch(forbiddenPage, /SECURITY REVIEW/);
        assert.match(websiteRegistration, /Host = Q01_WEB_FORBIDDEN_HOSTS\[0\]/);
        assert.match(websiteRegistration, /Host = Q01_WEB_FORBIDDEN_HOSTS\[1\]/);
        assert.match(websiteRegistration, /forbiddenPage/);
    });

    it("does not expose a direct security link from www", () => {
        assert.doesNotMatch(homePage, /security\.skynet-logistics\.idx/);
        assert.doesNotMatch(homePage, /href=["']\/security["']/);
        assert.match(homePage, /Skynet Logistics/);
    });
});
