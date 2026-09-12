import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    DEFAULT_RECON_ANIMATION,
    ReconService,
} from "../src/application/ops/recon-service.js";
import { Q01_RECON_PROFILE, Q01_RECON_RESULT, Q01_RECON_INPUT } from "../src/content/q01.js";

describe("DSS recon service", () => {
    it("keeps animation behavior in the shared service instead of the Q01 command", () => {
        assert.equal(DEFAULT_RECON_ANIMATION.sourceDurationMs, 1000);
        assert.equal(DEFAULT_RECON_ANIMATION.resultDelayMs, 90);
        assert.deepEqual(DEFAULT_RECON_ANIMATION.spinnerFrames, [
            "⠋", "⠙", "⠹", "⠸", "⠼",
            "⠴", "⠦", "⠧", "⠇", "⠏",
        ]);
        assert.equal(DEFAULT_RECON_ANIMATION.progressBarWidth, 24);
    });

    it("resolves a registered profile from normalized URL input", () => {
        const service = new ReconService();
        service.registerProfile(Q01_RECON_PROFILE);

        assert.equal(
            service.resolveProfile(Q01_RECON_INPUT.replace("-d ", ""))?.id,
            "q01",
        );
        assert.equal(
            service.resolveProfile("https://SKYNET-LOGISTICS.IDX/")?.id,
            "q01",
        );
    });

    it("executes a deterministic profile without any external dependency", async () => {
        const service = new ReconService({
            animation: {
                sourceDurationMs: 0,
                resultDelayMs: 0,
            },
        });
        service.registerProfile(Q01_RECON_PROFILE);

        const events: string[] = [];
        const result = await service.run(Q01_RECON_INPUT.replace("-d ", ""), {
            onStarted: ({ profileId, sources }) => {
                events.push(`started:${profileId}:${sources.length}`);
            },
            onSourceStarted: ({ source }) => events.push(`scan:${source.id}`),
            onSourceCompleted: ({ source, progressPercent }) =>
                events.push(`done:${source.id}:${progressPercent}`),
            onCompleted: ({ uniqueHostsFound }) => events.push(`completed:${uniqueHostsFound}`),
            onHostDiscovered: (host) => events.push(`host:${host}`),
            sleep: async () => undefined,
        });

        assert.ok(result);
        assert.equal(result?.profileId, "q01");
        assert.equal(result?.candidatesFound, 8);
        assert.equal(result?.uniqueHostsFound, 4);
        assert.equal(
            result?.hosts.join("\n"),
            Q01_RECON_RESULT,
        );
        assert.equal(events[0], "started:q01:5");
        assert.equal(events.at(-5), "completed:4");
        assert.deepEqual(events.slice(-4), [
            "host:portal.skynet-logistics.idx",
            "host:security.skynet-logistics.idx",
            "host:status.skynet-logistics.idx",
            "host:www.skynet-logistics.idx",
        ]);
    });
});
