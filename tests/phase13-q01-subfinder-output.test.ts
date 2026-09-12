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
            /\[INF\] Enumerating subdomains for \$\{normalizedTarget\}/,
        );
    });

    it("implements the in-place braille spinner used by the reference capture", () => {
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
        assert.match(subfinderCommandSource, /ANSI_CURSOR_UP = "\\u001B\[1A"/);
        assert.match(subfinderCommandSource, /ANSI_CLEAR_LINE = "\\u001B\[2K"/);
        assert.match(subfinderCommandSource, /ANSI_CARRIAGE_RETURN = "\\r"/);
        assert.match(subfinderCommandSource, /SPINNER_DELAY_MS = 100/);
        assert.match(subfinderCommandSource, /SPINNER_DURATION_MS = 2400/);
        assert.match(
            subfinderCommandSource,
            /`\$\{ANSI_CURSOR_UP\}\$\{ANSI_CLEAR_LINE\}\$\{ANSI_CARRIAGE_RETURN\}\$\{SPINNER_FRAMES\[spinnerFrame\]\}`/,
        );
    });

    it("streams the deterministic Q01 result after the spinner instead of using an external enumerator", () => {
        assert.match(subfinderCommandSource, /RESULT_DELAY_MS = 90/);
        assert.match(
            subfinderCommandSource,
            /Q01_SUBFINDER_RESULT\.split\(\"\\n\"\)/,
        );
        assert.match(
            subfinderCommandSource,
            /await sleep\(RESULT_DELAY_MS\);[\s\S]*tools\.println\(subdomain\)/,
        );
        assert.match(
            subfinderCommandSource,
            /\[INF\] Found \$\{subdomains\.length\} subdomains for \$\{normalizedTarget\} in \$\{elapsedMs\} milliseconds/,
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
