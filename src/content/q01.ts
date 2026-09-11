import { asId } from "../core/index.js";
import { flagEquals } from "../domain/shared/index.js";
import type { Quest } from "../domain/quest/index.js";

export const Q01_TARGET_IP = "203.0.113.42";
export const Q01_SSH_USERNAME = "audit";
export const Q01_SSH_PASSWORD = "meridian-audit";
export const Q01_SSH_PORT = 22;
export const Q01_SSH_COMMAND = `ssh -h ${Q01_SSH_USERNAME}@${Q01_TARGET_IP} -p ${Q01_SSH_PORT}`;

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
    description: "Routine security audit for Meridian Logistics in Jakarta.",
    objectives: [
        {
            id: "q01.runtime.completion",
            description: "Q01 canonical completion boundary.",
            condition: flagEquals(Q01_FINAL_STATE_FLAG, true),
        },
    ],
};
