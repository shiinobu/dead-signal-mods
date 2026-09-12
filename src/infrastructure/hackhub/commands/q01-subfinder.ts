import {
    Command,
    RegisterCommand,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_SUBFINDER_RESULT,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
} from "../../../content/q01.js";

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

const getDomainArgument = (args: string[]): string | null => {
    const domainFlagIndex = args.findIndex(
        (arg) => arg === "-d" || arg === "--domain",
    );

    if (domainFlagIndex >= 0) {
        return args[domainFlagIndex + 1] ?? null;
    }

    return args[0] ?? null;
};

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

type Q01SubfinderTools = Parameters<Command["Run"]>[0];

@RegisterCommand({ default: true })
export class Q01SubfinderCommand extends Command {
    /**
     * Q01 intentionally uses the plural command name so it does not collide
     * with HackHub's native `subfinder` executable.
     *
     * The animation below is an experimental native-HackHub probe: it uses
     * CommandTools.clear() instead of ANSI cursor control. If the runtime
     * redraws the terminal correctly, this becomes the canonical animation.
     * Otherwise Q01 falls back to the agreed append-only presentation.
     */
    CommandName = "subfinders";
    Description = "Enumerate subdomains for a target domain.";

    private printHeader(tools: Q01SubfinderTools): void {
        for (const line of SUBFINDER_BANNER) {
            tools.println(line);
        }

        tools.println("");
        tools.println("\t\tprojectdiscovery.io");
        tools.println("");

        for (const warning of SUBFINDER_WARNINGS) {
            tools.println(warning);
        }
    }

    private printFrame(
        tools: Q01SubfinderTools,
        normalizedTarget: string,
        frame: string,
    ): void {
        tools.clear();
        this.printHeader(tools);
        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);
        tools.println("");
        tools.println(`  ${frame} Enumerating...`);
    }

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

        if (
            normalizedTarget !== Q01_WEB_HOST &&
            normalizedTarget !== Q01_WEB_HOME_HOST
        ) {
            this.printHeader(tools);
            tools.println("");
            tools.println(`[WRN] No subdomains found for ${normalizedTarget}`);
            return;
        }

        let spinnerFrame = 0;
        const spinnerStartedAt = Date.now();

        while (Date.now() - spinnerStartedAt < SPINNER_DURATION_MS) {
            const frame = SPINNER_FRAMES[spinnerFrame]!;
            this.printFrame(tools, normalizedTarget, frame);
            spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
            await tools.sleep(SPINNER_DELAY_MS);
        }

        tools.clear();
        this.printHeader(tools);
        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);
        tools.println("");

        const startedAt = Date.now();
        const subdomains = Q01_SUBFINDER_RESULT.split("\n");

        for (const subdomain of subdomains) {
            await tools.sleep(RESULT_DELAY_MS);
            tools.println(subdomain);
        }

        const elapsedMs = Date.now() - startedAt;
        tools.println(
            `[INF] Found ${subdomains.length} subdomains for ${normalizedTarget} in ${elapsedMs} milliseconds`,
        );
    }
}
