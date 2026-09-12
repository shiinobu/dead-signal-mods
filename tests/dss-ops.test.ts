import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
    OpsSessionStore,
    OpsToolRegistry,
    DSS_RECON_EVENTS,
} from "../src/application/ops/index.js";

const appSource = readFileSync(
    resolve(
        fileURLToPath(
            new URL(
                "../src/infrastructure/hackhub/apps/dead-signal.ts",
                import.meta.url,
            ),
        ),
    ),
    "utf8",
);

const appHtml = readFileSync(
    resolve(
        fileURLToPath(
            new URL(
                "../src/infrastructure/hackhub/apps/dead-signal.html",
                import.meta.url,
            ),
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

describe("DSS operations application foundation", () => {
    it("registers DEAD-SIGNAL as the canonical desktop application", () => {
        assert.match(appSource, /@RegisterApp/);
        assert.match(appSource, /AppName\s*=\s*"dss"/);
        assert.match(appSource, /Title\s*=\s*"DEAD-SIGNAL"/);
        assert.match(appSource, /HTML\s*=\s*"\.\/dead-signal\.html"/);
        assert.match(appSource, /DefaultSize\s*=\s*\{\s*width:\s*1100,\s*height:\s*720\s*\}/);
        assert.match(appSource, /Unlocked\s*=\s*true/);
    });

    it("exposes the DSS runtime boundary to the desktop application", () => {
        assert.match(appSource, /opsRuntime\.tools\.getAll\(\)/);
        assert.match(appSource, /opsRuntime\.session\.getSnapshot\(\)/);
        assert.match(appSource, /opsRuntime\.recon\.run\(/);
        assert.match(appSource, /DSS_RECON_EVENTS\.started/);
        assert.match(appSource, /DSS_RECON_EVENTS\.sourceStarted/);
        assert.match(appSource, /DSS_RECON_EVENTS\.sourceCompleted/);
        assert.match(appSource, /DSS_RECON_EVENTS\.hostDiscovered/);
        assert.match(appSource, /DSS_RECON_EVENTS\.completed/);
    });

    it("contains a single-workspace navigator for the initial DSS tools", () => {
        assert.match(appHtml, /DEAD-SIGNAL/);
        assert.match(appHtml, /DSS \/\/ Dead Signal System/);
        assert.match(appHtml, /Terminal\+/);
        assert.match(appHtml, />Recon</);
        assert.match(appHtml, /Wireshark\+/);
        assert.match(appHtml, /OPERATIONS WORKSPACE/);
    });

    it("is imported by the production mod entry point", () => {
        assert.match(
            productionEntrySource,
            /import "\.\/infrastructure\/hackhub\/apps\/dead-signal\.js";/,
        );
    });

    it("defines stable DSS recon event names", () => {
        assert.equal(DSS_RECON_EVENTS.started, "DSS.Recon.Started");
        assert.equal(DSS_RECON_EVENTS.sourceStarted, "DSS.Recon.SourceStarted");
        assert.equal(DSS_RECON_EVENTS.sourceCompleted, "DSS.Recon.SourceCompleted");
        assert.equal(DSS_RECON_EVENTS.hostDiscovered, "DSS.Recon.HostDiscovered");
        assert.equal(DSS_RECON_EVENTS.completed, "DSS.Recon.Completed");
        assert.equal(DSS_RECON_EVENTS.failed, "DSS.Recon.Failed");
    });

    it("keeps the initial tool catalog centralized and extensible", () => {
        const registry = new OpsToolRegistry();
        assert.deepEqual(
            registry.getAll().map((tool) => tool.id),
            ["terminal", "recon", "wireshark"],
        );
        assert.equal(registry.get("recon")?.status, "ready");
        assert.equal(registry.get("terminal")?.status, "foundation");
        assert.equal(registry.get("wireshark")?.status, "foundation");
    });

    it("keeps investigation context separate from quest state", () => {
        const session = new OpsSessionStore();
        session.startRecon("q01", "www.skynet-logistics.idx", 5);

        assert.deepEqual(session.getSnapshot(), {
            status: "running",
            target: "www.skynet-logistics.idx",
            profileId: "q01",
            totalSources: 5,
            completedSources: 0,
            candidatesFound: 0,
            uniqueHostsFound: 0,
            discoveredHosts: [],
            lastElapsedMs: null,
        });
    });
});
