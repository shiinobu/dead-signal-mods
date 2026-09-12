import {
    Command,
    RegisterCommand,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_SUBFINDER_RESULT,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
} from "../../../content/q01.js";

const SUBFINDER_VERSION = "v2.16.0";
const RESULT_DELAY_MS = 90;
const SPINNER_DELAY_MS = 100;
const SPINNER_DURATION_MS = 2400;

const SUBFINDER_BANNER = [
    "               __    _____           __         ",
    "   _______  __/ /_  / __(_)___  ____/ /__  _____",
    "  / ___/ / / / __ \\/ /_/ / __ \\/ __  / _ \\/ ___/",
    " (__  ) /_/ / /_/ / __/ / / / / /_/ /  __/ /    ",
    "/____/\\__,_/_.___/_/ /_/_/ /_/\\__,_/\\___/_/",
] as const;

const SUBFINDER_WARNINGS = [
    "[WRN] Use with caution. You are responsible for your actions.",
    "[WRN] Developers assume no liability and are not responsible for any misuse or damage.",
    "[WRN] By using subfinder, you also agree to the terms of the APIs used.",
] as const;

const SPINNER_FRAMES = [
    "⠋",
    "⠙",
    "⠹",
    "⠸",
    "⠼",
    "⠴",
    "⠦",
    "⠧",
    "⠇",
    "⠏",
] as const;

const ANSI_CURSOR_UP = "\u001B[1A";
const ANSI_CLEAR_LINE = "\u001B[2K";
const ANSI_CARRIAGE_RETURN = "\r";

const normalizeTarget = (rawTarget: string): string | null => {
    const value = rawTarget.trim().replace(/^[\'"]|[\'"]$/g, "");

    if (!value) {
        return null;
    }

    try {
        const url = value.includes("://")
            ? new URL(value)
            : new URL(`https://${value}`);

        return url.hostname.toLowerCase().replace(/\.$/, "");
    } catch {
        return null;
    }
};

const getDomainArgument = (args: string[]): string | null => {
    const domainFlagIndex = args.findIndex(
        (arg) => arg === "-d" || arg === "--domain",
    );

    if (domainFlagIndex >= 0) {
        return args[domainFlagIndex + 1] ?? null;
    }

    return args[0] ?? null;
};

const sleep = (milliseconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

type Q01SubfinderTools = Parameters<Command["Run"]>[0];

@RegisterCommand({ default: true })
export class Q01SubfinderCommand extends Command {
    /**
     * Q01 intentionally uses the plural command name so it does not collide
     * with HackHub's native `subfinder` executable.
     *
     * Terminal presentation is adapted from the current ProjectDiscovery
     * subfinder CLI and the supplied HackHub reference capture. The Q01 result
     * itself remains deterministic and offline.
     */
    CommandName = "subfinders";
    Description = "Enumerate subdomains for a target domain.";

    override async Run(tools: Q01SubfinderTools) {
        const args = tools.getArgs();
        const rawTarget = getDomainArgument(args);
        const normalizedTarget = rawTarget
            ? normalizeTarget(rawTarget)
            : null;

        if (!normalizedTarget) {
            tools.println("Usage: subfinders -d <domain>");
            return;
        }

        for (const line of SUBFINDER_BANNER) {
            tools.println(line);
        }

        tools.println("");
        tools.println("\t\tprojectdiscovery.io");
        tools.println("");

        for (const warning of SUBFINDER_WARNINGS) {
            tools.println(warning);
        }

        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);
        tools.println("⠋");

        if (
            normalizedTarget !== Q01_WEB_HOST &&
            normalizedTarget !== Q01_WEB_HOME_HOST
        ) {
            await sleep(SPINNER_DELAY_MS * 2);
            tools.println("\u001B[1A\u001B[2K\r");
            tools.println(`[WRN] No subdomains found for ${normalizedTarget}`);
            return;
        }

        const spinnerStartedAt = Date.now();
        let spinnerFrame = 0;

        while (Date.now() - spinnerStartedAt < SPINNER_DURATION_MS) {
            await sleep(SPINNER_DELAY_MS);
            spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
            tools.println(
                `${ANSI_CURSOR_UP}${ANSI_CLEAR_LINE}${ANSI_CARRIAGE_RETURN}${SPINNER_FRAMES[spinnerFrame]}`,
            );
        }

        tools.println(
            `${ANSI_CURSOR_UP}${ANSI_CLEAR_LINE}${ANSI_CARRIAGE_RETURN}`,
        );

        const startedAt = Date.now();
        const subdomains = Q01_SUBFINDER_RESULT.split("\n");

        for (const subdomain of subdomains) {
            await sleep(RESULT_DELAY_MS);
            tools.println(subdomain);
        }

        const elapsedMs = Date.now() - startedAt;
        tools.println(
            `[INF] Found ${subdomains.length} subdomains for ${normalizedTarget} in ${elapsedMs} milliseconds`,
        );
    }
}
