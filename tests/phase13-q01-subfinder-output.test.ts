import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const subfinderCommandSource = readFileSync(
    resolve(
        fileURLToPath(
            new URL(
                "../src/infrastructure/hackhub/commands/q01-subfinder.ts",
                import.meta.url,
            ),
        ),
    ),
    "utf8",
);

describe("Phase 13 Q01 — subfinder presentation", () => {
    it("uses the current ProjectDiscovery banner and attribution", () => {
        assert.match(subfinderCommandSource, /SUBFINDER_BANNER = \[/);
        assert.match(subfinderCommandSource, /__    _____           __/);
        assert.match(subfinderCommandSource, /projectdiscovery\.io/);
        assert.match(subfinderCommandSource, /SUBFINDER_VERSION = \"v2\.16\.0\"/);
    });

    it("matches the upstream enumeration logging sequence", () => {
        assert.match(
            subfinderCommandSource,
            /\[INF\] Current subfinder version \$\{SUBFINDER_VERSION\}/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Enumerating subdomains for \$\{normalizedTarget\}/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Found \$\{subdomains\.length\} subdomains for \$\{normalizedTarget\} in \$\{elapsedMs\} milliseconds/,
        );
    });

    it("streams the deterministic Q01 result instead of using an external enumerator", () => {
        assert.match(subfinderCommandSource, /RESULT_DELAY_MS = 90/);
        assert.match(
            subfinderCommandSource,
            /await sleep\(RESULT_DELAY_MS\);[\s\S]*tools\.println\(subdomain\)/,
        );
        assert.match(
            subfinderCommandSource,
            /Q01_SUBFINDER_RESULT\.split\(\"\\n\"\)/,
        );
    });

    it("retains the Q01-only target gate and non-Q01 warning path", () => {
        assert.match(
            subfinderCommandSource,
            /normalizedTarget !== Q01_WEB_HOST &&[\s\S]*normalizedTarget !== Q01_WEB_HOME_HOST/,
        );
        assert.match(
            subfinderCommandSource,
            /\[WRN\] No subdomains found for \$\{normalizedTarget\}/,
        );
    });
});
