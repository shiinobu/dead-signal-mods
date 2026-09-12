import {
    Events,
    Shell,
} from "@hotbunny/hackhub-content-sdk";

import {
    OpsCommandRouter,
} from "../../application/ops/command-router.js";
import {
    DSS_COMMAND_EVENTS,
    DSS_RECON_EVENTS,
} from "../../application/ops/events.js";
import {
    opsRuntime,
} from "../../application/ops/runtime.js";

interface NativeTerminalCommandResult {
    readonly ok: boolean;
    readonly message?: string;
}

const commandRouter = new OpsCommandRouter(opsRuntime);
let commandRunning = false;
let commandBridgeRegistered = false;

const parseCommandLine = (commandLine: string): {
    command: string;
    args: string[];
} => {
    const parts = commandLine.trim().split(/\s+/).filter(Boolean);
    return {
        command: parts[0]?.toLowerCase() ?? "",
        args: parts.slice(1),
    };
};

const emitNativeTerminalCommand = (
    command: string,
    args: readonly string[],
): void => {
    Events.emit("Terminal.Command", {
        command,
        args: [...args],
    });
};

const formatNmapResult = (result: unknown, target: string): string => {
    const lines = [
        "Starting Nmap — DSS terminal simulation",
        `Nmap scan report for ${target}`,
        "Host is up.",
        "",
        "PORT     STATE    SERVICE",
    ];

    if (!Array.isArray(result)) {
        lines.push("22/tcp   filtered  ssh");
        lines.push("80/tcp   closed    http");
        lines.push("443/tcp  closed    https");
        return lines.join("\n");
    }

    for (const entry of result) {
        if (
            typeof entry !== "object" ||
            entry === null ||
            !("port" in entry) ||
            !("status" in entry) ||
            !("service" in entry)
        ) {
            continue;
        }

        const port = `${String(entry.port)}/tcp`;
        const status = String(entry.status).toLowerCase();
        const service = String(entry.service);
        lines.push(`${port.padEnd(9, " ")}${status.padEnd(9, " ")}${service}`);
    }

    return lines.join("\n");
};

const formatLynxResult = (result: unknown): string => {
    if (typeof result !== "object" || result === null) {
        return "lynx: no response data.";
    }

    const lines = ["Lynx — DSS terminal simulation"];

    if ("ips" in result && Array.isArray(result.ips)) {
        for (const ip of result.ips) {
            lines.push(`IP: ${String(ip)}`);
        }
    }

    if ("address" in result && Array.isArray(result.address)) {
        for (const address of result.address) {
            lines.push(`Address: ${String(address)}`);
        }
    }

    return lines.join("\n");
};

const executeNativeTerminalCommand = async (
    commandLine: string,
): Promise<NativeTerminalCommandResult | null> => {
    const { command, args } = parseCommandLine(commandLine);

    if (command !== "nmap" && command !== "lynx") {
        return null;
    }

    const input = command === "nmap"
        ? args[0] ?? ""
        : args.join(" ").trim();

    if (command === "nmap" && args.length > 1) {
        return {
            ok: false,
            message: "Usage: nmap [ip]",
        };
    }

    if (!input && command === "lynx") {
        return {
            ok: false,
            message: "Usage: lynx <ip-or-url>",
        };
    }

    const result = Shell.getCommandData(command, input);

    if (typeof result === "undefined") {
        if (command === "nmap" && input) {
            return {
                ok: true,
                message: formatNmapResult(undefined, input),
            };
        }

        return {
            ok: false,
            message: `${command}: no fixture available for '${input || "default"}'.`,
        };
    }

    emitNativeTerminalCommand(command, command === "nmap" ? args : [input]);

    if (command === "nmap" && input) {
        Events.emit("Terminal.NmapScan", { ip: input });
    }

    return {
        ok: true,
        message: command === "nmap"
            ? formatNmapResult(result, input || "local")
            : formatLynxResult(result),
    };
};

export const executeDssCommand = async (commandLine: string): Promise<boolean> => {
    const trimmed = commandLine.trim();

    if (!trimmed) {
        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine,
            ok: false,
            message: "Command cannot be empty.",
        });
        return false;
    }

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
        const nativeResult = await executeNativeTerminalCommand(trimmed);

        if (nativeResult) {
            Events.emit(DSS_COMMAND_EVENTS.result, {
                commandLine: trimmed,
                ok: nativeResult.ok,
                message: nativeResult.message,
            });
            return nativeResult.ok;
        }

        if (trimmed.toLowerCase() === "help") {
            const message = [
                "Available DSS commands:",
                "  recon -d <domain>",
                "  nmap [ip]",
                "  lynx <ip-or-url>",
                "  clear",
            ].join("\n");

            Events.emit(DSS_COMMAND_EVENTS.result, {
                commandLine: trimmed,
                ok: true,
                message,
            });
            return true;
        }

        if (trimmed.toLowerCase() === "clear") {
            Events.emit(DSS_COMMAND_EVENTS.result, {
                commandLine: trimmed,
                ok: true,
                message: "__DSS_CLEAR__",
            });
            return true;
        }

        const result = await commandRouter.execute(trimmed, {
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
                target: trimmed,
                reason: message,
            });
            Events.emit(DSS_COMMAND_EVENTS.result, {
                commandLine: trimmed,
                ok: false,
                message,
            });
            return false;
        }

        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine: trimmed,
            ok: true,
        });
        return true;
    } catch (error) {
        opsRuntime.session.fail();
        const message = error instanceof Error
            ? error.message
            : "Unknown command execution error.";
        Events.emit(DSS_RECON_EVENTS.failed, {
            target: trimmed,
            reason: message,
        });
        Events.emit(DSS_COMMAND_EVENTS.result, {
            commandLine: trimmed,
            ok: false,
            message,
        });
        return false;
    } finally {
        commandRunning = false;
    }
};

export const registerDssCommandBridge = (): void => {
    if (commandBridgeRegistered) {
        return;
    }

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

    commandBridgeRegistered = true;
};
