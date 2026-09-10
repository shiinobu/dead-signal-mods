import type { RuntimeState } from "./domain-state.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is readonly string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

const isNullableString = (value: unknown): value is string | null =>
    value === null || typeof value === "string";

const hasKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean =>
    keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));

const isFlagValue = (value: unknown): boolean =>
    typeof value === "string" || typeof value === "number" || typeof value === "boolean";

export class StateValidator {
    validate(state: unknown): state is RuntimeState {
        if (!isRecord(state)) {
            return false;
        }

        return (
            isRecord(state.flags) &&
            Object.values(state.flags).every(isFlagValue) &&
            isRecord(state.domain) &&
            this.validateDomain(state.domain)
        );
    }

    assertValid(state: unknown): asserts state is RuntimeState {
        if (!this.validate(state)) {
            throw new Error("Invalid runtime state payload.");
        }
    }

    private validateDomain(domain: Record<string, unknown>): boolean {
        return (
            hasKeys(domain, [
                "quests", "investigation", "evidence", "entity", "character",
                "relationships", "dialogue", "terminal", "database", "hacking",
                "access", "economy", "progression", "narrative", "reward", "ending",
            ]) &&
            this.validateQuest(domain.quests) &&
            this.validateInvestigation(domain.investigation) &&
            this.validateSingleIdState(domain.evidence, "discoveredEvidenceIds") &&
            this.validateSingleIdState(domain.entity, "discoveredEntityIds") &&
            this.validateSingleIdState(domain.character, "discoveredCharacterIds") &&
            this.validateSingleIdState(domain.relationships, "discoveredRelationshipIds") &&
            this.validateDialogue(domain.dialogue) &&
            this.validateSingleIdState(domain.terminal, "discoveredTerminalIds") &&
            this.validateSingleIdState(domain.database, "discoveredDatabaseIds") &&
            this.validateHacking(domain.hacking) &&
            this.validateAccess(domain.access) &&
            this.validateEconomy(domain.economy) &&
            this.validateProgression(domain.progression) &&
            this.validateNarrative(domain.narrative) &&
            this.validateSingleIdState(domain.reward, "claimedRewardIds") &&
            this.validateEnding(domain.ending)
        );
    }

    private validateQuest(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["activeQuestId", "completedQuestIds", "failedQuestIds"])) {
            return false;
        }

        return (
            isNullableString(value.activeQuestId) &&
            isStringArray(value.completedQuestIds) &&
            isStringArray(value.failedQuestIds)
        );
    }

    private validateInvestigation(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["activeInvestigationId", "discoveredLeadIds", "completedInvestigationIds"])) {
            return false;
        }

        return (
            isNullableString(value.activeInvestigationId) &&
            isStringArray(value.discoveredLeadIds) &&
            isStringArray(value.completedInvestigationIds)
        );
    }

    private validateSingleIdState(value: unknown, key: string): boolean {
        return isRecord(value) && hasKeys(value, [key]) && isStringArray(value[key]);
    }

    private validateDialogue(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["activeDialogueId", "activeNodeId", "history"])) {
            return false;
        }

        if (!isNullableString(value.activeDialogueId) || !isNullableString(value.activeNodeId) || !Array.isArray(value.history)) {
            return false;
        }

        return value.history.every((entry) =>
            isRecord(entry) &&
            hasKeys(entry, ["dialogueId", "nodeId"]) &&
            typeof entry.dialogueId === "string" &&
            typeof entry.nodeId === "string",
        );
    }

    private validateHacking(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["activeAttemptId", "completedAttemptIds"])) {
            return false;
        }

        return isNullableString(value.activeAttemptId) && isStringArray(value.completedAttemptIds);
    }

    private validateAccess(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["grants"]) || !isRecord(value.grants)) {
            return false;
        }

        return Object.values(value.grants).every((grant) =>
            isRecord(grant) &&
            hasKeys(grant, ["id", "actorId", "capability"]) &&
            typeof grant.id === "string" &&
            typeof grant.actorId === "string" &&
            grant.capability === "OVERRIDE_OPERATOR",
        );
    }

    private validateEconomy(value: unknown): boolean {
        if (!isRecord(value) || !hasKeys(value, ["balance", "transactions", "appliedMissionRewardKeys"])) {
            return false;
        }

        if (
            typeof value.balance !== "number" ||
            !Number.isInteger(value.balance) ||
            value.balance < 0 ||
            !Array.isArray(value.transactions) ||
            !isStringArray(value.appliedMissionRewardKeys)
        ) {
            return false;
        }

        return value.transactions.every((transaction) => {
            if (!isRecord(transaction) || !hasKeys(transaction, [
                "id", "type", "amount", "source", "reference", "timestamp",
            ])) {
                return false;
            }

            return (
                typeof transaction.id === "string" &&
                (transaction.type === "CREDIT" || transaction.type === "DEBIT") &&
                typeof transaction.amount === "number" &&
                Number.isInteger(transaction.amount) &&
                transaction.amount > 0 &&
                ["QUEST_REWARD", "BONUS", "PURCHASE", "PENALTY", "SYSTEM"].includes(
                    transaction.source as string,
                ) &&
                isNullableString(transaction.reference) &&
                typeof transaction.timestamp === "string"
            );
        });
    }

    private validateProgression(value: unknown): boolean {
        return (
            isRecord(value) &&
            hasKeys(value, ["level", "experience"]) &&
            typeof value.level === "number" &&
            Number.isInteger(value.level) &&
            value.level >= 1 &&
            typeof value.experience === "number" &&
            Number.isInteger(value.experience) &&
            value.experience >= 0
        );
    }

    private validateNarrative(value: unknown): boolean {
        return (
            isRecord(value) &&
            hasKeys(value, ["chapterId", "sceneId", "completedChapterIds"]) &&
            isNullableString(value.chapterId) &&
            isNullableString(value.sceneId) &&
            isStringArray(value.completedChapterIds)
        );
    }

    private validateEnding(value: unknown): boolean {
        return (
            isRecord(value) &&
            hasKeys(value, ["endingId", "resolved"]) &&
            isNullableString(value.endingId) &&
            typeof value.resolved === "boolean" &&
            (!value.resolved || value.endingId !== null)
        );
    }
}
