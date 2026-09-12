import {
    App,
    Events,
    RegisterApp,
} from "@hotbunny/hackhub-content-sdk";
import appHTML from "../../../dead-signal.html";

import {
    OpsCommandRouter,
} from "../../../application/ops/command-router.js";
import {
    DSS_RECON_EVENTS,
} from "../../../application/ops/events.js";
import {
    opsRuntime,
} from "../../../application/ops/runtime.js";
import type {
    OpsCommandDefinition,
} from "../../../application/ops/command-registry.js";
import type {
    OpsSessionSnapshot,
} from "../../../application/ops/session-store.js";
import type {
    OpsToolDefinition,
} from "../../../application/ops/tool-registry.js";

@RegisterApp
export class DeadSignalApp extends App {
    AppName = "dss";
    Title = "DSS";
    Icon = "./assets/dss.svg";
    HTML = appHTML;
    DefaultSize = { width: 1220, height: 800 };
    override MinSize = { width: 1200, height: 780 };
    override Unlocked = true;

    override Store = {
        title: "DSS",
        ratings: 0,
        description: "DSS // Dead Signal System — integrated investigation workspace.",
    };

    override Exports = {
        getToolCatalog: (): readonly OpsToolDefinition[] =>
            opsRuntime.tools.getAll(),
        getCommandCatalog: (): readonly OpsCommandDefinition[] =>
            opsRuntime.commands.getAll(),
        getSession: (): OpsSessionSnapshot =>
            opsRuntime.session.getSnapshot(),
        startRecon: (target: string): Promise<boolean> =>
            this.executeCommand(`recon -d ${target}`),
        executeCommand: (commandLine: string): Promise<boolean> =>
            this.executeCommand(commandLine),
    };

    private readonly commandRouter = new OpsCommandRouter(opsRuntime);
    private commandRunning = false;

    private async executeCommand(commandLine: string): Promise<boolean> {
        if (this.commandRunning) {
            return false;
        }

        this.commandRunning = true;

        try {
            const result = await this.commandRouter.execute(commandLine, {
                observer: {
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
                },
            });

            if (!result.ok) {
                Events.emit(DSS_RECON_EVENTS.failed, {
                    target: commandLine,
                    reason: result.message ?? "Command execution failed.",
                });
            }

            return result.ok;
        } catch (error) {
            opsRuntime.session.fail();
            Events.emit(DSS_RECON_EVENTS.failed, {
                target: commandLine,
                reason: error instanceof Error ? error.message : "Unknown command execution error.",
            });
            return false;
        } finally {
            this.commandRunning = false;
        }
    }
}
