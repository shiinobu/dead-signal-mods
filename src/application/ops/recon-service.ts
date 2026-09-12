import type {
    ReconAnimationConfig,
    ReconProgress,
    ReconProfile,
    ReconResult,
    ReconSourceDefinition,
} from "../../domain/recon/index.js";

export interface ReconStartedEvent {
    readonly profileId: string;
    readonly target: string;
    readonly totalSources: number;
}

export interface ReconObserver {
    onStarted(event: ReconStartedEvent): void;
    onSourceStarted(event: ReconProgress): void;
    onSourceCompleted(event: ReconProgress): void;
    onHostDiscovered(host: string): void;
    onCompleted(result: ReconResult): void;
    sleep(ms: number): Promise<void>;
}

export interface ReconServiceOptions {
    readonly animation?: Partial<ReconAnimationConfig>;
}

export const DEFAULT_RECON_ANIMATION: ReconAnimationConfig = {
    sourceDurationMs: 1000,
    resultDelayMs: 90,
    spinnerFrames: [
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
    ],
    progressBarWidth: 24,
};

export const formatReconProgressBar = (
    percent: number,
    width = DEFAULT_RECON_ANIMATION.progressBarWidth,
): string => {
    const clamped = Math.max(0, Math.min(100, percent));
    const filled = Math.round((clamped / 100) * width);
    return `[${"█".repeat(filled)}${"░".repeat(width - filled)}]`;
};

export const normalizeReconTarget = (rawTarget: string): string | null => {
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

export class ReconService {
    private readonly profiles = new Map<string, ReconProfile>();
    private readonly animation: ReconAnimationConfig;

    constructor(options: ReconServiceOptions = {}) {
        this.animation = {
            ...DEFAULT_RECON_ANIMATION,
            ...options.animation,
        };
    }

    registerProfile(profile: ReconProfile): void {
        if (!profile.id.trim()) {
            throw new Error("Recon profile id must not be empty.");
        }

        if (profile.targets.length === 0) {
            throw new Error(`Recon profile '${profile.id}' has no targets.`);
        }

        if (profile.sources.length === 0) {
            throw new Error(`Recon profile '${profile.id}' has no sources.`);
        }

        this.profiles.set(profile.id, profile);
    }

    getProfiles(): readonly ReconProfile[] {
        return [...this.profiles.values()];
    }

    resolveProfile(rawTarget: string): ReconProfile | null {
        const normalizedTarget = normalizeReconTarget(rawTarget);

        if (!normalizedTarget) {
            return null;
        }

        for (const profile of this.profiles.values()) {
            if (
                profile.targets.some(
                    (target) => normalizeReconTarget(target) === normalizedTarget,
                )
            ) {
                return profile;
            }
        }

        return null;
    }

    getAnimationConfig(): ReconAnimationConfig {
        return this.animation;
    }

    async run(rawTarget: string, observer: ReconObserver): Promise<ReconResult | null> {
        const target = normalizeReconTarget(rawTarget);

        if (!target) {
            return null;
        }

        const profile = this.resolveProfile(target);

        if (!profile) {
            return null;
        }

        const startedAt = Date.now();
        observer.onStarted({
            profileId: profile.id,
            target,
            totalSources: profile.sources.length,
        });

        const completedSources: ReconSourceDefinition[] = [];

        for (let index = 0; index < profile.sources.length; index += 1) {
            const source = profile.sources[index]!;
            const progressBefore = this.createProgress(
                profile,
                target,
                source,
                index,
                completedSources,
            );

            observer.onSourceStarted(progressBefore);
            await observer.sleep(this.animation.sourceDurationMs);

            completedSources.push(source);

            const progressAfter = this.createProgress(
                profile,
                target,
                source,
                index,
                completedSources,
                true,
            );

            observer.onSourceCompleted(progressAfter);
        }

        const result: ReconResult = {
            profileId: profile.id,
            target,
            sources: profile.sources,
            candidatesFound: completedSources.reduce(
                (total, source) => total + source.candidates.length,
                0,
            ),
            uniqueHostsFound: new Set(
                completedSources.flatMap((source) => source.candidates),
            ).size,
            hosts: profile.resultHosts,
            elapsedMs: Date.now() - startedAt,
        };

        observer.onCompleted(result);

        for (const host of result.hosts) {
            await observer.sleep(this.animation.resultDelayMs);
            observer.onHostDiscovered(host);
        }

        return result;
    }

    private createProgress(
        profile: ReconProfile,
        target: string,
        source: ReconSourceDefinition,
        index: number,
        completedSources: readonly ReconSourceDefinition[],
        completed = false,
    ): ReconProgress {
        const candidateCount = completedSources.reduce(
            (total, item) => total + item.candidates.length,
            0,
        );
        const uniqueCount = new Set(
            completedSources.flatMap((item) => item.candidates),
        ).size;
        const progressPercent = Math.round(
            (completedSources.length / profile.sources.length) * 100,
        );

        return {
            target,
            source,
            sourceIndex: index,
            totalSources: profile.sources.length,
            progressPercent: completed
                ? progressPercent
                : Math.round((index / profile.sources.length) * 100),
            candidatesFound: candidateCount,
            uniqueHostsFound: uniqueCount,
            spinnerFrame:
                this.animation.spinnerFrames[
                    index % this.animation.spinnerFrames.length
                ] ?? "⠋",
        };
    }
}
