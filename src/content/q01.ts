import { asId } from "../core/index.js";
import { flagEquals } from "../domain/shared/index.js";
import type { Quest } from "../domain/quest/index.js";
import { ADRIAN_COLE } from "./characters.js";

export const Q01_CLIENT_NAME = "Skynet Logistics";
export const Q01_TARGET_IP = "203.0.113.42";
export const Q01_WEB_HOST = "skynet-logistics.idx";
export const Q01_WEB_AUDIT_PATH = "/security";
export const Q01_WEB_HOME_URL = `https://${Q01_WEB_HOST}/`;
export const Q01_WEB_AUDIT_URL = `https://${Q01_WEB_HOST}${Q01_WEB_AUDIT_PATH}`;

// Kept as the player-facing HTTPS surface constant for backwards-compatible imports.
export const Q01_WEB_HTTPS_URL = Q01_WEB_HOME_URL;

// The Q01 site exposes at most four non-root web surfaces.
// Only /security is the intended public audit target; the others are restricted.
export const Q01_WEB_SURFACE_PATHS = [
    Q01_WEB_AUDIT_PATH,
    "/admin",
    "/portal",
    "/api",
] as const;

export const Q01_WEB_FORBIDDEN_PATHS = Q01_WEB_SURFACE_PATHS.filter(
    (path) => path !== Q01_WEB_AUDIT_PATH,
);

export const Q01_ADRIAN_EMAIL = ADRIAN_COLE.email;
export const Q01_REPORT_RECIPIENT = Q01_ADRIAN_EMAIL;
export const Q01_REPORT_SUBJECT = "Security Audit — Jakarta";

// This is the template shown to the player. Quest validation uses the resolved
// canonical values separately so the player must discover and fill them in.
export const Q01_REPORT_BODY_TEMPLATE = [
    "Target: <COMPANY>",
    "Open Ports: <PORTS>",
    "",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
].join("\n");

// Canonical resolved submission body used only by the quest validator.
export const Q01_REPORT_BODY = [
    `Target: ${Q01_CLIENT_NAME}`,
    "Open Ports: 443",
    "",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
].join("\n");

export const Q01_FINAL_STATE_FLAG = "dead_signal.q01.completed";

export const Q01_OBJECTIVE_IDS = {
    reviewScope: "q01.objective.01",
    scanNetwork: "q01.objective.02",
    identifyServices: "q01.objective.03",
    basicVulnerabilityChecks: "q01.objective.04",
    submitAudit: "q01.objective.05",
} as const;

export const Q01_REWARDS = {
    externalAudit: 35,
    networkServiceEnumeration: 20,
    basicVulnerabilityAssessment: 10,
    submitCorrectReport: 15,
    money: 200,
} as const;

export const Q01_THE_CONTRACT: Quest = {
    id: asId<"Quest">("dead_signal.q01"),
    chapterId: "chapter-01-dead-signal",
    title: "THE CONTRACT",
    description: `Routine security audit for ${Q01_CLIENT_NAME} in Jakarta.`,
    objectives: [
        {
            id: "q01.runtime.completion",
            description: "Q01 canonical completion boundary.",
            condition: flagEquals(Q01_FINAL_STATE_FLAG, true),
        },
    ],
};
