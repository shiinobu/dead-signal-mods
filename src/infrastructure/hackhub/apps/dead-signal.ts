import {
    App,
    RegisterApp,
} from "@hotbunny/hackhub-content-sdk";
import appHTML from "../../../dead-signal.html";

import {
    executeDssCommand,
} from "../dss-command-runtime.js";
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
            executeDssCommand(`recon -d ${target}`),
        executeCommand: (commandLine: string): Promise<boolean> =>
            executeDssCommand(commandLine),
    };
}
