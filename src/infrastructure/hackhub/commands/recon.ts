import {
    Command,
    RegisterCommand,
} from "@hotbunny/hackhub-content-sdk";

import {
    formatReconProgressBar,
    normalizeReconTarget,
} from "../../../application/ops/recon-service.js";
import { opsRuntime } from "../../../application/ops-runtime.js";

const DSS_RECON_BANNER = [
    "  ____  _____ ____    ____   _  _ ____ _  _ ",
    " |  _ \\| ____|  _ \\  / ___| | || / ___| || |",
    " | | | |  _| | |_) | \\___ \\ | || \\___ \\ || |_",
    " | |_| | |___|  _ <   ___) ||__   _|___) /__   _|",
    " |____/|_____|_| \\_\\ |____/    |_| |____/   |_| ",
] as const;

const printBanner = (tools: Q01ReconTools): void => {
    for (const line of DSS_RECON_BANNER) {
        tools.println(line);
    }

    tools.println("");
    tools.println("        DSS // Dead Signal System");
    tools.println("        RECONNAISSANCE MODULE");
};

type Q01ReconTools = Parameters<Command["Run"]>[0];

@RegisterCommand({ default: true })
export class ReconCommand extends Command {
    CommandName = "recon";
    Description = "Run the DEAD SIGNAL reconnaissance module.";

    override async Run(tools: Q01ReconTools): Promise<void> {
        const args = tools.getArgs();
        const rawTarget = args[0] ?? null;

        if (!rawTarget) {
            tools.println("Usage: recon -d <domain>");
            return;
        }

        const normalizedTarget = normalizeReconTarget(rawTarget);

        if (!normalizedTarget) {
            tools.println("Usage: recon -d <domain>");
            return;
        }

        const result = await opsRuntime.recon.run(rawTarget, {
            onStarted: ({ target }) => {
                printBanner(tools);
                tools.println("");
                tools.println(`[INF] Reconnaissance started for ${target}`);
            },

            onSourceStarted: ({ source, spinnerFrame }) => {
                tools.println("");
                tools.println(
                    `[>] ${source.name.padEnd(18, ".")} ${spinnerFrame} scanning ${source.description}`,
                );
            },

            onSourceCompleted: ({
                source,
                progressPercent,
                totalSources,
                candidatesFound,
                uniqueHostsFound,
            }) => {
                tools.println(
                    `[✓] ${source.name.padEnd(18, ".")} ${source.candidates.length} found`,
                );
                tools.println(
                    `Progress: ${formatReconProgressBar(progressPercent)} ${progressPercent}%`,
                );
                tools.println(`Sources:  ${Math.round((progressPercent / 100) * totalSources)}/${totalSources}`);
                tools.println(`Candidates: ${candidatesFound}`);
                tools.println(`Unique:     ${uniqueHostsFound}`);
            },

            onCompleted: () => {
                tools.println("");
                tools.println("[INF] Reconnaissance completed");
                tools.println("");
            },

            onHostDiscovered: (host) => {
                tools.println(host);
            },

            sleep: (ms) => tools.sleep(ms),
        });

        if (!result) {
            printBanner(tools);
            tools.println("");
            tools.println(
                `[WRN] No reconnaissance profile matched ${normalizedTarget}`,
            );
            return;
        }

        tools.println("");
        tools.println(
            `[INF] Found ${result.uniqueHostsFound} unique hosts for ${result.target} in ${result.elapsedMs} milliseconds`,
        );
    }
}
