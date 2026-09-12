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

const SUBFINDER_BANNER = [
    "                   __    _____           __         ",
    "       _______  __/ /_  / __(_)___  ____/ /__  _____",
    "      / ___/ / / / __ \\/ /_/ / __ \\/ __  / _ \\/ ___/",
    "     (__  ) /_/ / /_/ / __/ / / / / /_/ /  __/ /    ",
    "    /____/\\__,_/_.___/_/ /_/_/ /_/\\__,_/\\___/_/",
] as const;

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
     * Terminal presentation is adapted from ProjectDiscovery/subfinder's
     * banner and enumeration logging conventions. The Q01 result itself
     * remains deterministic and offline.
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
        tools.println(`[INF] Current subfinder version ${SUBFINDER_VERSION}`);
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);

        if (
            normalizedTarget !== Q01_WEB_HOST &&
            normalizedTarget !== Q01_WEB_HOME_HOST
        ) {
            tools.println(`[WRN] No subdomains found for ${normalizedTarget}`);
            return;
        }

        const startedAt = Date.now();

        for (const subdomain of Q01_SUBFINDER_RESULT.split("\n")) {
            await sleep(RESULT_DELAY_MS);
            tools.println(subdomain);
        }

        const elapsedMs = Date.now() - startedAt;
        tools.println(
            `[INF] Found ${Q01_SUBFINDER_RESULT.split("\n").length} subdomains for ${normalizedTarget} in ${elapsedMs} milliseconds`,
        );
    }
}
