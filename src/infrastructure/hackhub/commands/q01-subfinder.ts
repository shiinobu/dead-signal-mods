import {
    Command,
    RegisterCommand,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_SUBFINDER_RESULT,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
} from "../../../content/q01.js";

const SOURCE_DURATION_MS = 1000;
const SPINNER_DELAY_MS = 100;
const RESULT_DELAY_MS = 90;

const SOURCES = [
    {
        name: "crtsh",
        candidates: ["www.skynet-logistics.idx", "security.skynet-logistics.idx"],
    },
    {
        name: "rapiddns",
        candidates: ["security.skynet-logistics.idx", "portal.skynet-logistics.idx"],
    },
    {
        name: "hackertarget",
        candidates: ["status.skynet-logistics.idx", "www.skynet-logistics.idx"],
    },
    {
        name: "alienvault",
        candidates: ["status.skynet-logistics.idx"],
    },
    {
        name: "urlscan",
        candidates: ["portal.skynet-logistics.idx"],
    },
] as const;

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
type SourceStatus = "pending" | "scanning" | "complete";

const getSourceStatus = (index: number, activeSource: number): SourceStatus => {
    if (index < activeSource) {
        return "complete";
    }

    if (index === activeSource) {
        return "scanning";
    }

    return "pending";
};

const getFoundCount = (
    sourceIndex: number,
    elapsedInSource: number,
): number => {
    const candidates = SOURCES[sourceIndex]?.candidates ?? [];

    if (elapsedInSource >= SOURCE_DURATION_MS || candidates.length <= 1) {
        return candidates.length;
    }

    if (elapsedInSource >= SOURCE_DURATION_MS / 2) {
        return 1;
    }

    return 0;
};

const getProgress = (elapsedMs: number): number =>
    Math.min(
        100,
        Math.floor(
            (elapsedMs / (SOURCE_DURATION_MS * SOURCES.length)) * 100,
        ),
    );

const getCandidateCount = (elapsedMs: number): number => {
    let total = 0;

    for (let index = 0; index < SOURCES.length; index += 1) {
        const sourceStart = index * SOURCE_DURATION_MS;
        const elapsedInSource = elapsedMs - sourceStart;

        if (elapsedInSource <= 0) {
            continue;
        }

        total += getFoundCount(
            index,
            Math.min(elapsedInSource, SOURCE_DURATION_MS),
        );
    }

    return total;
};

const getUniqueCount = (elapsedMs: number): number => {
    const discovered = new Set<string>();

    for (let index = 0; index < SOURCES.length; index += 1) {
        const sourceStart = index * SOURCE_DURATION_MS;
        const elapsedInSource = elapsedMs - sourceStart;

        if (elapsedInSource <= 0) {
            continue;
        }

        const count = getFoundCount(
            index,
            Math.min(elapsedInSource, SOURCE_DURATION_MS),
        );

        for (const candidate of SOURCES[index]?.candidates.slice(0, count) ?? []) {
            discovered.add(candidate);
        }
    }

    return discovered.size;
};

const formatProgressBar = (percent: number, width = 24): string => {
    const filled = Math.round((percent / 100) * width);
    return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
};

@RegisterCommand({ default: true })
export class Q01SubfinderCommand extends Command {
    /**
     * Q01 intentionally uses the plural command name so it does not collide
     * with HackHub's native `subfinder` executable.
     *
     * Presentation uses native CommandTools.clear() so each frame redraws
     * cleanly in the HackHub terminal without ANSI cursor control. Source
     * enumeration is simulated and deterministic; Q01 never performs network
     * enumeration against external providers.
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

    private printScanFrame(
        tools: Q01SubfinderTools,
        target: string,
        elapsedMs: number,
        spinnerFrame: string,
    ): void {
        const activeSource = Math.min(
            SOURCES.length - 1,
            Math.floor(elapsedMs / SOURCE_DURATION_MS),
        );
        const elapsedInSource = elapsedMs % SOURCE_DURATION_MS;
        const progress = getProgress(elapsedMs);
        const candidateCount = getCandidateCount(elapsedMs);
        const uniqueCount = getUniqueCount(elapsedMs);

        tools.clear();
        this.printHeader(tools);
        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${target}`);
        tools.println("");

        for (let index = 0; index < SOURCES.length; index += 1) {
            const source = SOURCES[index];
            const status = getSourceStatus(index, activeSource);
            const foundCount =
                status === "complete"
                    ? source.candidates.length
                    : status === "scanning"
                      ? getFoundCount(activeSource, elapsedInSource)
                      : 0;
            const marker =
                status === "complete" ? "✓" : status === "scanning" ? ">" : " ";
            const suffix =
                status === "complete"
                    ? `${foundCount} found`
                    : status === "scanning"
                      ? `${spinnerFrame} scanning`
                      : "pending";

            tools.println(
                `[${marker}] ${source.name.padEnd(18, ".")} ${suffix}`,
            );
        }

        tools.println("");
        tools.println(
            `Progress: ${formatProgressBar(progress)} ${progress}%`,
        );
        tools.println(
            `Sources:  ${Math.min(
                SOURCES.length,
                Math.floor(elapsedMs / SOURCE_DURATION_MS),
            )}/${SOURCES.length}`,
        );
        tools.println(`Candidates: ${candidateCount}`);
        tools.println(`Unique:     ${uniqueCount}`);
    }

    override async Run(tools: Q01SubfinderTools) {
        const args = tools.getArgs();
        const rawTarget = getDomainArgument(args);
        const normalizedTarget = rawTarget ? normalizeTarget(rawTarget) : null;

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

        const animationStartedAt = Date.now();
        let spinnerFrame = 0;
        const animationDurationMs = SOURCE_DURATION_MS * SOURCES.length;

        while (Date.now() - animationStartedAt < animationDurationMs) {
            const elapsedMs = Math.min(
                Date.now() - animationStartedAt,
                animationDurationMs,
            );

            this.printScanFrame(
                tools,
                normalizedTarget,
                elapsedMs,
                SPINNER_FRAMES[spinnerFrame]!,
            );
            spinnerFrame = (spinnerFrame + 1) % SPINNER_FRAMES.length;
            await tools.sleep(SPINNER_DELAY_MS);
        }

        tools.clear();
        this.printHeader(tools);
        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);
        tools.println("");

        for (const source of SOURCES) {
            tools.println(
                `[✓] ${source.name.padEnd(18, ".")} ${source.candidates.length} found`,
            );
        }

        tools.println("");
        tools.println(`Progress: ${formatProgressBar(100)} 100%`);
        tools.println(`Sources:  ${SOURCES.length}/${SOURCES.length}`);
        tools.println(`Candidates: ${getCandidateCount(animationDurationMs)}`);
        tools.println(`Unique:     ${getUniqueCount(animationDurationMs)}`);
        tools.println("");
        tools.println("[INF] Enumeration completed");
        tools.println("");

        const resultStartedAt = Date.now();
        const subdomains = Q01_SUBFINDER_RESULT.split("\n");

        for (const subdomain of subdomains) {
            await tools.sleep(RESULT_DELAY_MS);
            tools.println(subdomain);
        }

        const elapsedMs = Date.now() - resultStartedAt;
        tools.println(
            `[INF] Found ${subdomains.length} unique subdomains for ${normalizedTarget} in ${elapsedMs} milliseconds`,
        );
    }
}
