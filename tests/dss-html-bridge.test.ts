import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appHtml = readFileSync(
    resolve(
        fileURLToPath(
            new URL("../src/dead-signal.html", import.meta.url),
        ),
    ),
    "utf8",
);

const productionEntrySource = readFileSync(
    resolve(
        fileURLToPath(
            new URL("../src/index.ts", import.meta.url),
        ),
    ),
    "utf8",
);

const replayEntrySource = readFileSync(
    resolve(
        fileURLToPath(
            new URL("../dev/q01-replay-entry.ts", import.meta.url),
        ),
    ),
    "utf8",
);

describe("DSS desktop HTML bridge", () => {
    it("keeps a static tool navigator even when exported catalogs are unavailable", () => {
        assert.match(appHtml, /fallbackTools=\[/);
        assert.match(appHtml, /fallbackCommands=\[/);
        assert.match(appHtml, /typeof value==='function'\?/);
        assert.doesNotMatch(appHtml, /window\.getToolCatalog/);
        assert.doesNotMatch(appHtml, /window\.startRecon/);
        assert.doesNotMatch(appHtml, /window\.executeCommand/);
    });

    it("uses the documented HackhubSDK global for DSS events", () => {
        assert.match(appHtml, /globalThis\.HackhubSDK/);
        assert.match(appHtml, /HackhubSDK.*Events\.on/);
        assert.doesNotMatch(appHtml, /window\.HackhubSDK/);
    });

    it("initializes the Q01 recon profile before desktop interaction", () => {
        assert.match(productionEntrySource, /opsRuntime\.recon\.registerProfile\(Q01_RECON_PROFILE\);/);
        assert.match(replayEntrySource, /opsRuntime\.recon\.registerProfile\(Q01_RECON_PROFILE\);/);
    });
});
