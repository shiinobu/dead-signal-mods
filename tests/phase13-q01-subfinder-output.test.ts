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
    it("keeps the command visually aligned with ProjectDiscovery subfinder output", () => {
        assert.match(
            subfinderCommandSource,
            /tools\.println\(\"                   __    _____           __/, 
        );
        assert.match(
            subfinderCommandSource,
            /tools\.println\(\"\\tprojectdiscovery\.io\"\)/,
        );
        assert.match(
            subfinderCommandSource,
            /Current subfinder version v2\.15\.0/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Enumerating subdomains for \$\{normalizedTarget\}/,
        );
    });

    it("keeps the Q01 result deterministic after the presentation banner", () => {
        const resultIndex = subfinderCommandSource.indexOf(
            'Q01_SUBFINDER_RESULT.split("\\n")',
        );

        assert.notEqual(resultIndex, -1);
        assert.ok(
            subfinderCommandSource.indexOf("tools.println(subdomain)", resultIndex) >
                resultIndex,
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
