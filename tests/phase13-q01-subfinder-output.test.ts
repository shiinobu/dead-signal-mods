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
    });

    it("matches the HackHub reference warning and enumeration sequence", () => {
        assert.match(
            subfinderCommandSource,
            /\[WRN\] Use with caution\. You are responsible for your actions\./,
        );
        assert.match(
            subfinderCommandSource,
            /\[WRN\] Developers assume no liability and are not responsible for any misuse or damage\./,
        );
        assert.match(
            subfinderCommandSource,
            /\[WRN\] By using subfinder, you also agree to the terms of the APIs used\./,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Enumerating subdomains for \$\{target\}/,
        );
    });

    it("uses native CommandTools.clear() without emitting ANSI control sequences", () => {
        assert.match(subfinderCommandSource, /tools\.clear\(\);/);
        assert.match(
            subfinderCommandSource,
            /await tools\.sleep\(SPINNER_DELAY_MS\)/,
        );
        assert.doesNotMatch(subfinderCommandSource, /\\u001B\[/);
        assert.doesNotMatch(subfinderCommandSource, /ANSI_CURSOR_UP/);
        assert.doesNotMatch(subfinderCommandSource, /ANSI_CLEAR_LINE/);
        assert.doesNotMatch(subfinderCommandSource, /ANSI_CARRIAGE_RETURN/);
    });

    it("uses the reference braille sequence and source-by-source progress timing", () => {
        assert.match(subfinderCommandSource, /SPINNER_FRAMES = \[/);
        assert.match(subfinderCommandSource, /"⠋"/);
        assert.match(subfinderCommandSource, /"⠙"/);
        assert.match(subfinderCommandSource, /"⠹"/);
        assert.match(subfinderCommandSource, /"⠸"/);
        assert.match(subfinderCommandSource, /"⠼"/);
        assert.match(subfinderCommandSource, /"⠴"/);
        assert.match(subfinderCommandSource, /"⠦"/);
        assert.match(subfinderCommandSource, /"⠧"/);
        assert.match(subfinderCommandSource, /"⠇"/);
        assert.match(subfinderCommandSource, /"⠏"/);
        assert.match(subfinderCommandSource, /SOURCE_DURATION_MS = 1000/);
        assert.match(subfinderCommandSource, /SPINNER_DELAY_MS = 100/);
        assert.match(
            subfinderCommandSource,
            /Sources:.*SOURCES\.length/,
        );
    });

    it("defines deterministic simulated discovery sources with duplicate candidates", () => {
        assert.match(subfinderCommandSource, /const SOURCES = \[/);
        assert.match(subfinderCommandSource, /name: "crtsh"/);
        assert.match(subfinderCommandSource, /name: "rapiddns"/);
        assert.match(subfinderCommandSource, /name: "hackertarget"/);
        assert.match(subfinderCommandSource, /name: "alienvault"/);
        assert.match(subfinderCommandSource, /name: "urlscan"/);
        assert.match(
            subfinderCommandSource,
            /Candidates: \$\{candidateCount\}/,
        );
        assert.match(subfinderCommandSource, /Unique:\s+\$\{uniqueCount\}/);
    });

    it("renders a live progress bar and active-source spinner", () => {
        assert.match(subfinderCommandSource, /const formatProgressBar =/);
        assert.match(subfinderCommandSource, /█/);
        assert.match(subfinderCommandSource, /░/);
        assert.match(
            subfinderCommandSource,
            /\[\$\{marker\}\] \$\{source\.name\.padEnd\(18, "\."\)\} \$\{suffix\}/,
        );
        assert.match(
            subfinderCommandSource,
            /Progress: \$\{formatProgressBar\(progress\)\} \$\{progress\}%/,
        );
    });

    it("streams the canonical deterministic Q01 result after enumeration completes", () => {
        assert.match(
            subfinderCommandSource,
            /Q01_SUBFINDER_RESULT\.split\(\"\\n\"\)/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Enumeration completed/,
        );
        assert.match(
            subfinderCommandSource,
            /await tools\.sleep\(RESULT_DELAY_MS\);[\s\S]*tools\.println\(subdomain\)/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Found \$\{subdomains\.length\} unique subdomains for \$\{normalizedTarget\}/,
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
