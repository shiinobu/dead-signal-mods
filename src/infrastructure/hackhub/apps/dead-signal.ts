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
    DSS_COMMAND_EVENTS,
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

const DSS_NAVIGATION_PATCH = `
<script>
(() => {
    const views = {
        terminal: "view-terminal",
        recon: "view-recon",
        wireshark: "view-wireshark",
    };

    const showDssView = (id) => {
        const activeView = Object.prototype.hasOwnProperty.call(views, id)
            ? id
            : "recon";

        for (const key of Object.keys(views)) {
            const view = document.getElementById(views[key]);
            if (view) {
                view.classList.toggle("active", key === activeView);
            }
        }

        document.querySelectorAll("#nav button").forEach((button) => {
            button.classList.toggle("active", button.dataset.view === activeView);
        });

        const crumb = document.getElementById("crumb");
        if (crumb) {
            crumb.textContent = activeView === "wireshark"
                ? "Wireshark+"
                : activeView === "terminal"
                    ? "Terminal+"
                    : "Recon";
        }

        if (activeView === "terminal") {
            setTimeout(() => document.getElementById("cmd-input")?.focus(), 0);
        }
    };

    const bindNavigation = () => {
        const nav = document.getElementById("nav");
        if (!nav) {
            return;
        }

        nav.querySelectorAll("button").forEach((button) => {
            if (button.dataset.dssNavigationBound === "true") {
                return;
            }

            button.dataset.dssNavigationBound = "true";
            button.addEventListener("click", () => {
                showDssView(button.dataset.view || "recon");
            });
        });

        showDssView("recon");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindNavigation, { once: true });
    } else {
        bindNavigation();
    }
})();
</script>`;

const dssHTML = `${appHTML}${DSS_NAVIGATION_PATCH}`;

const commandRouter = new OpsCommandRouter(opsRuntime);
let commandRunning = false;

const executeDssCommand = async (commandLine: string): Promise<boolean> => {
    if (commandRunning) {
        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine,
            ok: false,
            message: "Another DSS command is already running.",
        });
        return false;
    }

    commandRunning = true;

    try {
        const result = await commandRouter.execute(commandLine, {
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
            const message = result.message ?? "Command execution failed.";
            Events.emit(DSS_RECON_EVENTS.failed, {
                target: commandLine,
                reason: message,
            });
            Events.emit(DSS_COMMAND_EVENTS.result, {
                commandLine,
                ok: false,
                message,
            });
            return false;
        }

        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine,
            ok: true,
        });
        return true;
    } catch (error) {
        opsRuntime.session.fail();
        const message = error instanceof Error
            ? error.message
            : "Unknown command execution error.";
        Events.emit(DSS_RECON_EVENTS.failed, {
            target: commandLine,
            reason: message,
        });
        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine,
            ok: false,
            message,
        });
        return false;
    } finally {
        commandRunning = false;
    }
};

Events.on(
    DSS_COMMAND_EVENTS.request,
    (event: { commandLine?: string } | string) => {
        const commandLine = typeof event === "string"
            ? event
            : event?.commandLine;
        if (!commandLine?.trim()) {
            return;
        }

        void executeDssCommand(commandLine);
    },
);

@RegisterApp
export class DeadSignalApp extends App {
    AppName = "dss";
    Title = "DSS";
    Icon = "./assets/dss.svg";
    HTML = dssHTML;
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
            executeDssCommand(`recon -d ${target}`),
        executeCommand: (commandLine: string): Promise<boolean> =>
            executeDssCommand(commandLine),
    };
}
