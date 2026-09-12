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

        if (!opsRuntime.recon.resolveProfile(rawTarget)) {
            Events.emit(DSS_RECON_EVENTS.failed, {
                target: rawTarget,
                reason: "No registered reconnaissance profile matched the target.",
            });
            return false;
        }

        this.reconRunning = true;

        try {
            const result = await opsRuntime.runRecon(rawTarget, {
                onStarted: (event) => {
                    Events.emit(DSS_RECON_EVENTS.started, event);
                },
                onSourceStarted: (event) => {
                    Events.emit(DSS_RECON_EVENTS.sourceStarted, event);
                },
                onSourceCompleted: (event) => {
                    Events.emit(DSS_RECON_EVENTS.sourceCompleted, event);
                },
                onHostDiscovered: (host) => {
                    Events.emit(DSS_RECON_EVENTS.hostDiscovered, { host });
                },
                onCompleted: (reconResult) => {
                    Events.emit(DSS_RECON_EVENTS.completed, reconResult);
                },
                sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
            });

            if (!result) {
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
