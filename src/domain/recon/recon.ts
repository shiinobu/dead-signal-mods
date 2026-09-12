export interface ReconSourceDefinition {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly candidates: readonly string[];
}

export interface ReconProfile {
    readonly id: string;
    readonly targets: readonly string[];
    readonly sources: readonly ReconSourceDefinition[];
    readonly resultHosts: readonly string[];
}

export interface ReconProgress {
    readonly target: string;
    readonly source: ReconSourceDefinition;
    readonly sourceIndex: number;
    readonly totalSources: number;
    readonly progressPercent: number;
    readonly candidatesFound: number;
    readonly uniqueHostsFound: number;
    readonly spinnerFrame: string;
}

export interface ReconResult {
    readonly profileId: string;
    readonly target: string;
    readonly sources: readonly ReconSourceDefinition[];
    readonly candidatesFound: number;
    readonly uniqueHostsFound: number;
    readonly hosts: readonly string[];
    readonly elapsedMs: number;
}

export interface ReconAnimationConfig {
    readonly sourceDurationMs: number;
    readonly resultDelayMs: number;
    readonly spinnerFrames: readonly string[];
    readonly progressBarWidth: number;
}
