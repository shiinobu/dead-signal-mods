import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    Q01_WEB_AUDIT_PATH,
    Q01_WEB_FORBIDDEN_PATHS,
    Q01_WEB_HOST,
    Q01_WEB_SURFACE_PATHS,
} from "../src/content/index.js";

import { Q01SkynetLogisticsWebsite } from "../src/infrastructure/hackhub/websites/q01-skynet-portal.js";

describe("Phase 13 Q01 — web boundary", () => {
    it("defines exactly four non-root web surfaces with /security as the only authorized target", () => {
        assert.equal(Q01_WEB_SURFACE_PATHS.length, 4);
        assert.deepEqual(Q01_WEB_SURFACE_PATHS, [
            "/security",
            "/admin",
            "/portal",
            "/api",
        ]);
        assert.deepEqual(Q01_WEB_FORBIDDEN_PATHS, [
            "/admin",
            "/portal",
            "/api",
        ]);
    });

    it("registers the root homepage plus the four non-root surfaces", () => {
        const website = new Q01SkynetLogisticsWebsite();

        assert.equal(website.Host, Q01_WEB_HOST);
        assert.equal(website.Pages.length, 5);
        assert.deepEqual(
            website.Pages.map((page) => page.path),
            ["/", "/security", "/admin", "/portal", "/api"],
        );
    });

    it("keeps /security as the only real audit page", () => {
        const website = new Q01SkynetLogisticsWebsite();
        const securityPage = website.Pages.find(
            (page) => page.path === Q01_WEB_AUDIT_PATH,
        );

        assert.ok(securityPage);
        assert.match(securityPage.html, /SECURITY REVIEW/);

        for (const path of Q01_WEB_FORBIDDEN_PATHS) {
            const page = website.Pages.find((candidate) => candidate.path === path);
            assert.ok(page);
            assert.match(page.html, /403/);
            assert.match(page.html, /FORBIDDEN/);
            assert.notEqual(page.html, securityPage.html);
        }
    });

    it("removes direct security navigation from the public homepage", () => {
        const website = new Q01SkynetLogisticsWebsite();
        const homePage = website.Pages.find((page) => page.path === "/");

        assert.ok(homePage);
        assert.doesNotMatch(homePage.html, /href=["']\/security["']/);
        assert.match(homePage.html, /Skynet Logistics/);
    });
});
