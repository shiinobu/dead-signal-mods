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

// Prefix for profiles synthesized by synthesizeGenericReconProfile, so callers
// can distinguish a curated quest profile from a generic fallback scan.
export const GENERIC_RECON_PROFILE_PREFIX = "generic:";

// Prefix for profiles built from real native `subfinder` results, so callers
// can distinguish a native-backed scan from both curated and synthetic ones.
export const NATIVE_RECON_PROFILE_PREFIX = "native:";

const GENERIC_RECON_SUBDOMAIN_POOL = [
    "www", "mail", "api", "admin", "portal", "status", "dev", "staging",
    "vpn", "cdn", "blog", "shop", "support", "beta", "internal",
] as const;

const RECON_SOURCE_TEMPLATE: readonly (Omit<ReconSourceDefinition, "candidates">)[] = [
    { id: "certificate-index", name: "cert-index", description: "certificate index" },
    { id: "passive-dns", name: "passive-dns", description: "passive DNS" },
    { id: "host-intel", name: "host-intel", description: "host intelligence" },
    { id: "threat-feed", name: "threat-feed", description: "threat feed index" },
    { id: "web-index", name: "web-index", description: "indexed web hosts" },
];

const distributeAcrossSources = (
    hosts: readonly string[],
): ReconSourceDefinition[] =>
    RECON_SOURCE_TEMPLATE.map((template, index) => ({
        ...template,
        candidates: hosts.filter(
            (_, hostIndex) => hostIndex % RECON_SOURCE_TEMPLATE.length === index,
        ),
    }));

/**
 * Builds a ReconProfile from subdomains returned by HackHub's own native
 * `subfinder` command (via the infrastructure-layer native-subfinder
 * bridge), so a real in-game result flows through the same source/animation
 * pipeline as curated and synthetic profiles.
 */
export const buildReconProfileFromNativeSubdomains = (
    targetHost: string,
    subdomains: readonly string[],
): ReconProfile => {
    const uniqueHosts = [...new Set(subdomains.map((host) => host.toLowerCase()))];

    return {
        id: `${NATIVE_RECON_PROFILE_PREFIX}${targetHost}`,
        targets: [targetHost],
        sources: distributeAcrossSources(uniqueHosts),
        resultHosts: uniqueHosts,
    };
};

// Deterministic FNV-1a style hash so the same target always synthesizes the
// same subdomains, keeping generic scans reproducible and testable.
const hashHostname = (value: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

/**
 * Synthesizes a deterministic ReconProfile for a target with no curated
 * quest profile and no usable native subfinder result. Used as the final
 * fallback so Recon never fails outright for a domain the player types.
 */
export const synthesizeGenericReconProfile = (targetHost: string): ReconProfile => {
    const hash = hashHostname(targetHost);
    const subdomainCount = 3 + (hash % 4);
    const selected: string[] = [];
    let cursor = hash;

    while (
        selected.length < subdomainCount
        && selected.length < GENERIC_RECON_SUBDOMAIN_POOL.length
    ) {
        cursor = (cursor * 1103515245 + 12345) >>> 0;
        const prefix = GENERIC_RECON_SUBDOMAIN_POOL[
            cursor % GENERIC_RECON_SUBDOMAIN_POOL.length
        ]!;
        const candidateHost = `${prefix}.${targetHost}`;

        if (!selected.includes(candidateHost)) {
            selected.push(candidateHost);
        }
    }

    return {
        id: `${GENERIC_RECON_PROFILE_PREFIX}${targetHost}`,
        targets: [targetHost],
        sources: distributeAcrossSources(selected),
        resultHosts: [...selected].sort(),
    };
};
