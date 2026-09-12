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

describe("DSS recon workspace scrolling", () => {
    it("allows only the Recon view to scroll vertically", () => {
        assert.match(
            appHtml,
            /\.view-recon\.active\{[^}]*overflow-y:auto/,
        );
        assert.match(appHtml, /html,body\{[^}]*overflow:hidden/);
        assert.match(appHtml, /\.content\{[^}]*overflow:hidden/);
        assert.doesNotMatch(appHtml, /\.view-terminal\.active\{[^}]*overflow-y:auto/);
        assert.doesNotMatch(appHtml, /\.view-wireshark\.active\{[^}]*overflow-y:auto/);
    });
});
