import {
    Command,
    RegisterCommand,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q01_SUBFINDER_RESULT,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
} from "../../../content/q01.js";

const normalizeTarget = (rawTarget: string): string | null => {
    const value = rawTarget.trim().replace(/^['"]|['"]$/g, "");

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

@RegisterCommand
export class Q01SubfinderCommand extends Command {
    CommandName = "subfinder";
    Description = "Enumerate subdomains for a target domain.";

    override async Run(tools) {
        const args = tools.getArgs();
        const rawTarget = getDomainArgument(args);
        const normalizedTarget = rawTarget
            ? normalizeTarget(rawTarget)
            : null;

        if (!normalizedTarget) {
            tools.println("Usage: subfinder -d <domain>");
            return;
        }

        tools.println("");
        tools.println("               SUBFINDER");
        tools.println("");
        tools.println(`[INF] Enumerating subdomains for ${normalizedTarget}`);

        if (
            normalizedTarget !== Q01_WEB_HOST &&
            normalizedTarget !== Q01_WEB_HOME_HOST
        ) {
            tools.println(`[WRN] No subdomains found for ${normalizedTarget}`);
            return;
        }

        for (const subdomain of Q01_SUBFINDER_RESULT.split("\n")) {
            tools.println(subdomain);
        }
    }
}
