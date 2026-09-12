import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const reconCommandSource = readFileSync(
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

describe("Phase 13 Q01 — DEAD SIGNAL recon presentation", () => {
    it("uses the current ProjectDiscovery banner as the visual inspiration", () => {
        assert.match(reconCommandSource, /SUBFINDER_BANNER = \[/);
        assert.match(reconCommandSource, /__    _____           __/);
        assert.match(reconCommandSource, /projectdiscovery\.io/);
    });

    it("uses the DEAD SIGNAL reconnaissance wording while preserving the reference warning sequence", () => {
        assert.match(
            reconCommandSource,
            /\[WRN\] Use with caution\. You are responsible for your actions\./,
        );
        assert.match(
            reconCommandSource,
            /\[WRN\] Developers assume no liability and are not responsible for any misuse or damage\./,
        );
        assert.match(
            reconCommandSource,
            /\[WRN\] By using subfinder, you also agree to the terms of the APIs used\./,
        );
        assert.match(
            reconCommandSource,
            /\[INF\] Reconnaissance started for \$\{normalizedTarget\}/,
        );
        assert.match(
            reconCommandSource,
            /\[INF\] Reconnaissance completed/,
        );
    });

    it("preserves append-only terminal history and does not clear or emit ANSI control sequences", () => {
        assert.doesNotMatch(reconCommandSource, /tools\.clear\(\)/);
        assert.doesNotMatch(reconCommandSource, /\\u001B\[/);
        assert.doesNotMatch(reconCommandSource, /ANSI_CURSOR_UP/);
        assert.doesNotMatch(reconCommandSource, /ANSI_CLEAR_LINE/);
        assert.doesNotMatch(reconCommandSource, /ANSI_CARRIAGE_RETURN/);
        assert.match(reconCommandSource, /await tools\.sleep\(SOURCE_DURATION_MS\)/);
    });

    it("uses five deterministic simulated discovery sources with duplicate candidates", () => {
        assert.match(reconCommandSource, /const SOURCES = \[/);
        assert.match(reconCommandSource, /name: "crtsh"/);
        assert.match(reconCommandSource, /name: "rapiddns"/);
        assert.match(reconCommandSource, /name: "hackertarget"/);
        assert.match(reconCommandSource, /name: "alienvault"/);
        assert.match(reconCommandSource, /name: "urlscan"/);
        assert.match(reconCommandSource, /certificate transparency/);
        assert.match(reconCommandSource, /passive DNS/);
        assert.match(reconCommandSource, /Candidates: \$\{candidateCount\}/);
        assert.match(reconCommandSource, /Unique:\s+\$\{uniqueCount\}/);
    });

    it("renders source-by-source progress with a progress bar and active-source indicator", () => {
        assert.match(reconCommandSource, /SPINNER_FRAMES = \[/);
        assert.match(reconCommandSource, /const formatProgressBar =/);
        assert.match(reconCommandSource, /█/);
        assert.match(reconCommandSource, /░/);
        assert.match(
            reconCommandSource,
            /\[>] \$\{source\.name\.padEnd\(18, "\."\)\} \$\{frame\} scanning \$\{source\.description\}/,
        );
        assert.match(
            reconCommandSource,
            /\[✓\] \$\{source\.name\.padEnd\(18, "\."\)\} \$\{source\.candidates\.length\} found/,
        );
        assert.match(
            reconCommandSource,
            /Progress: \$\{formatProgressBar\(progress\)\} \$\{progress\}%/,
        );
        assert.match(
            reconCommandSource,
            /Sources:  \$\{completedSources\.length\}\/\$\{SOURCES\.length\}/,
        );
    });

    it("streams the canonical deterministic Q01 result after reconnaissance completes", () => {
        assert.match(
            reconCommandSource,
            /Q01_SUBFINDER_RESULT\.split\(\"\\n\"\)/,
        );
        assert.match(
            reconCommandSource,
            /await tools\.sleep\(RESULT_DELAY_MS\);[\s\S]*tools\.println\(subdomain\)/,
        );
        assert.match(
            reconCommandSource,
            /\[INF\] Found \$\{subdomains\.length\} unique hosts for \$\{normalizedTarget\}/,
        );
    });

    it("registers the original DEAD SIGNAL command name", () => {
        assert.match(reconCommandSource, /CommandName = "recon"/);
        assert.match(reconCommandSource, /Usage: recon -d <domain>/);
        assert.match(reconCommandSource, /export class Q01ReconCommand/);
    });

    it("retains the Q01-only target gate and non-Q01 warning path", () => {
        assert.match(
            reconCommandSource,
            /normalizedTarget !== Q01_WEB_HOST &&[\s\S]*normalizedTarget !== Q01_WEB_HOME_HOST/,
        );
        assert.match(
            reconCommandSource,
            /\[WRN\] No reconnaissance data found for \$\{normalizedTarget\}/,
        );
    });
});
