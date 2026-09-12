import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    Q01_WEB_AUDIT_HOST,
    Q01_WEB_AUDIT_URL,
    Q01_WEB_FORBIDDEN_HOSTS,
    Q01_WEB_HOME_HOST,
    Q01_WEB_HOME_URL,
    Q01_WEB_SUBDOMAINS,
} from "../src/content/index.js";

import {
    Q01SkynetLogisticsPortalWebsite,
    Q01SkynetLogisticsSecurityWebsite,
    Q01SkynetLogisticsStatusWebsite,
    Q01SkynetLogisticsWebsite,
} from "../src/infrastructure/hackhub/websites/q01-skynet-portal.js";

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

    it("registers each subdomain as its own root page", () => {
        const websites = [
            new Q01SkynetLogisticsWebsite(),
            new Q01SkynetLogisticsPortalWebsite(),
            new Q01SkynetLogisticsStatusWebsite(),
            new Q01SkynetLogisticsSecurityWebsite(),
        ];

        assert.deepEqual(
            websites.map((website) => website.Host),
            Q01_WEB_SUBDOMAINS,
        );
        assert.deepEqual(
            websites.map((website) => website.Pages.map((page) => page.path)),
            [["/"], ["/"], ["/"], ["/"]],
        );
    });

    it("keeps only the security subdomain as the real audit page", () => {
        const securityWebsite = new Q01SkynetLogisticsSecurityWebsite();
        const securityPage = securityWebsite.Pages[0];

        assert.ok(securityPage);
        assert.match(securityPage.html, /SECURITY REVIEW/);
        assert.match(securityPage.html, /Skynet Logistics/);
        assert.equal(securityWebsite.Host, Q01_WEB_AUDIT_HOST);
    });

    it("serves 403 forbidden on the other subdomains", () => {
        const forbiddenWebsites = [
            new Q01SkynetLogisticsPortalWebsite(),
            new Q01SkynetLogisticsStatusWebsite(),
        ];

        assert.deepEqual(
            forbiddenWebsites.map((website) => website.Host),
            Q01_WEB_FORBIDDEN_HOSTS,
        );

        for (const website of forbiddenWebsites) {
            const page = website.Pages[0];

            assert.ok(page);
            assert.match(page.html, /403/);
            assert.match(page.html, /FORBIDDEN/);
            assert.doesNotMatch(page.html, /SECURITY REVIEW/);
        }
    });

    it("does not expose a direct security link from www", () => {
        const website = new Q01SkynetLogisticsWebsite();
        const homePage = website.Pages[0];

        assert.ok(homePage);
        assert.doesNotMatch(homePage.html, /security\.skynet-logistics\.idx/);
        assert.doesNotMatch(homePage.html, /href=["']\/security["']/);
        assert.match(homePage.html, /Skynet Logistics/);
    });
});
