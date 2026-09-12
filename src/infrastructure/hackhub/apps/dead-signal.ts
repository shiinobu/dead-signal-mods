import {
    App,
    Events,
    RegisterApp,
} from "@hotbunny/hackhub-content-sdk";

import {
    DSS_RECON_EVENTS,
} from "../../../application/ops/events.js";
import {
    opsRuntime,
} from "../../../application/ops/runtime.js";
import type {
    OpsSessionSnapshot,
} from "../../../application/ops/session-store.js";
import type {
    OpsToolDefinition,
} from "../../../application/ops/tool-registry.js";

const DSS_APP_TITLE = "DEAD-SIGNAL";

@RegisterApp
export class DeadSignalApp extends App {
    AppName = "dss";
    Title = DSS_APP_TITLE;
    Icon = "./assets/dss.svg";
    HTML = "./dead-signal.html";
    DefaultSize = { width: 1100, height: 720 };
    Unlocked = true;

    Store = {
        title: "DEAD-SIGNAL",
        ratings: 5,
        description: "DSS // Dead Signal System — integrated investigation workspace.",
    };

    Exports = {
        getToolCatalog: (): readonly OpsToolDefinition[] =>
            opsRuntime.tools.getAll(),
        getSession: (): OpsSessionSnapshot =>
            opsRuntime.session.getSnapshot(),
        startRecon: (target: string): Promise<boolean> =>
            this.startRecon(target),
    };

    private reconRunning = false;

    private async startRecon(rawTarget: string): Promise<boolean> {
        if (this.reconRunning) {
            return false;
        }

        const target = opsRuntime.recon.resolveProfile(rawTarget);

        if (!target) {
            Events.emit(DSS_RECON_EVENTS.failed, {
                target: rawTarget,
                reason: "No registered reconnaissance profile matched the target.",
            });
            return false;
        }

        this.reconRunning = true;

        try {
            const result = await opsRuntime.recon.run(rawTarget, {
                onStarted: (event) => {
                    opsRuntime.session.startRecon(
                        event.profileId,
                        event.target,
                        event.totalSources,
                    );
                    Events.emit(DSS_RECON_EVENTS.started, event);
                },
                onSourceStarted: (event) => {
                    opsRuntime.session.applySourceProgress(event, false);
                    Events.emit(DSS_RECON_EVENTS.sourceStarted, event);
                },
                onSourceCompleted: (event) => {
                    opsRuntime.session.applySourceProgress(event, true);
                    Events.emit(DSS_RECON_EVENTS.sourceCompleted, event);
                },
                onHostDiscovered: (host) => {
                    opsRuntime.session.addHost(host);
                    Events.emit(DSS_RECON_EVENTS.hostDiscovered, { host });
                },
                onCompleted: (reconResult) => {
                    opsRuntime.session.completeRecon(reconResult);
                    Events.emit(DSS_RECON_EVENTS.completed, reconResult);
                },
                sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
            });

            if (!result) {
                opsRuntime.session.fail();
                Events.emit(DSS_RECON_EVENTS.failed, {
                    target: rawTarget,
                    reason: "Reconnaissance did not resolve a registered profile.",
                });
                return false;
            }

            return true;
        } catch (error) {
            opsRuntime.session.fail();
            Events.emit(DSS_RECON_EVENTS.failed, {
                target: rawTarget,
                reason: error instanceof Error ? error.message : "Unknown reconnaissance error.",
            });
            return false;
        } finally {
            this.reconRunning = false;
        }
    }
}
