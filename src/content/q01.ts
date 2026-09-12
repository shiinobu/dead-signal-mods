import { asId } from "../core/index.js";
import { flagEquals } from "../domain/shared/index.js";
import type { Quest } from "../domain/quest/index.js";
import { ADRIAN_COLE } from "./characters.js";

export const Q01_CLIENT_NAME = "Skynet Logistics";
export const Q01_TARGET_IP = "203.0.113.42";
export const Q01_WEB_HOST = "skynet-logistics.idx";
export const Q01_WEB_HOME_HOST = `www.${Q01_WEB_HOST}`;
export const Q01_WEB_AUDIT_HOST = `security.${Q01_WEB_HOST}`;
export const Q01_WEB_FORBIDDEN_HOSTS = [
    `portal.${Q01_WEB_HOST}`,
    `status.${Q01_WEB_HOST}`,
] as const;

export const Q01_WEB_SUBDOMAINS = [
    Q01_WEB_HOME_HOST,
    ...Q01_WEB_FORBIDDEN_HOSTS,
    Q01_WEB_AUDIT_HOST,
] as const;

export const Q01_WEB_HOME_URL = `https://${Q01_WEB_HOME_HOST}/`;
export const Q01_WEB_AUDIT_URL = `https://${Q01_WEB_AUDIT_HOST}/`;

// Backwards-compatible alias for callers that treat the public HTTPS surface as the home URL.
export const Q01_WEB_HTTPS_URL = Q01_WEB_HOME_URL;

export const Q01_LYNX_INPUT_IP = Q01_TARGET_IP;
export const Q01_LYNX_INPUT_URL = `https://${Q01_TARGET_IP}/`;

// The player may provide the same web target in normal subfinder value forms.
// Formatting (scheme, www prefix, trailing slash) is not a gameplay constraint.
export const Q01_SUBFINDER_INPUT = `-d ${Q01_WEB_HOME_URL}`;
export const Q01_SUBFINDER_INPUT_VARIANTS = [
    Q01_SUBFINDER_INPUT,
    `-d ${Q01_WEB_HOST}`,
    `-d ${Q01_WEB_HOME_HOST}`,
    `-d https://${Q01_WEB_HOST}`,
    `-d https://${Q01_WEB_HOST}/`,
    `-d https://${Q01_WEB_HOME_HOST}`,
    Q01_WEB_HOST,
    Q01_WEB_HOME_HOST,
    `https://${Q01_WEB_HOST}`,
    `https://${Q01_WEB_WEB_HOST}`,
    `https://${Q01_WEB_HOST}/`,
    Q01_WEB_HOME_URL,
] as const;
export const Q01_SUBFINDER_RESULT = [
    "portal.skynet-logistics.idx",
    "security.skynet-logistics.idx",
    "status.skynet-logistics.idx",
    "www.skynet-logistics.idx",
].join("\n");

export const Q01_ADRIAN_EMAIL = ADRIAN_COLE.email;
export const Q01_REPORT_RECIPIENT = Q01_ADRIAN_EMAIL;
export const Q01_REPORT_SUBJECT = "Security Audit — Jakarta";

export const Q01_REPORT_BODY_TEMPLATE = [
    "Target: <COMPANY>",
    "Open Ports: <PORTS>",
    "",
    "No critical vulnerabilities identified.",
    "Further internal assessment is recommended.",
].join("\n");

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
