import type {
    EconomyState,
    MissionReward,
    Penalty,
    Reward,
    Transaction,
    TransactionSource,
} from "../domain/economy/index.js";
import { asId } from "../core/index.js";
import { DomainError } from "../domain/shared/index.js";
import type { DomainStateAccess } from "../state/index.js";

export class EconomyService {
    constructor(
        private readonly domainState: DomainStateAccess,
    ) {}

    getBalance(): number {
        return this.domainState.get().economy.balance;
    }

    getTransactions(): readonly Transaction[] {
        return this.domainState.get().economy.transactions;
    }

    credit(
        amount: number,
        source: TransactionSource,
        reference: string | null = null,
        timestamp: string = new Date().toISOString(),
    ): void {
        this.validateAmount(amount);

        this.updateBalance(
            amount,
            "CREDIT",
            source,
            reference,
            timestamp,
        );
    }

    debit(
        amount: number,
        source: TransactionSource,
        reference: string | null = null,
        timestamp: string = new Date().toISOString(),
    ): void {
        this.validateAmount(amount);

        const state = this.domainState.get().economy;
        if (state.balance < amount) {
            throw new DomainError(
                "PRECONDITION_FAILED",
                `Insufficient balance for debit of ${amount}.`,
            );
        }

        this.updateBalance(
            -amount,
            "DEBIT",
            source,
            reference,
            timestamp,
        );
    }

    reward(
        reward: Reward,
        reference: string | null = null,
        timestamp?: string,
    ): void {
        this.credit(
            reward.amount,
            reward.source,
            reference,
            timestamp,
        );
    }

    penalize(
        penalty: Penalty,
        reference: string | null = null,
        timestamp?: string,
    ): void {
        this.debit(
            penalty.amount,
            penalty.source,
            reference,
            timestamp,
        );
    }

    applyMissionReward(
        reward: MissionReward,
        completionId: string,
        timestamp: string = new Date().toISOString(),
    ): boolean {
        this.validateAmount(reward.amount);

        if (completionId.trim().length === 0) {
            throw new DomainError(
                "INVALID_STATE",
                "Mission reward completion ID must not be empty.",
            );
        }

        if (!Number.isInteger(reward.rewardIndex) || reward.rewardIndex < 0) {
            throw new DomainError(
                "INVALID_STATE",
                "Mission reward index must be a non-negative integer.",
            );
        }

        const key = `${reward.questId}:${completionId}:${reward.rewardIndex}`;
        const state = this.domainState.get().economy;

        if (state.appliedMissionRewardKeys.includes(key)) {
            return false;
        }

        const transaction = this.createTransaction(
            "CREDIT",
            reward.amount,
            "QUEST_REWARD",
            key,
            timestamp,
        );

        this.domainState.update((domain) => ({
            ...domain,
            economy: {
                ...domain.economy,
                balance: domain.economy.balance + reward.amount,
                transactions: [
                    ...domain.economy.transactions,
                    transaction,
                ],
                appliedMissionRewardKeys: [
                    ...domain.economy.appliedMissionRewardKeys,
                    key,
                ],
            },
        }));

        return true;
    }

    hasAppliedMissionReward(
        reward: MissionReward,
        completionId: string,
    ): boolean {
        const key = `${reward.questId}:${completionId}:${reward.rewardIndex}`;
        return this.domainState
            .get()
            .economy
            .appliedMissionRewardKeys
            .includes(key);
    }

    private updateBalance(
        delta: number,
        type: Transaction["type"],
        source: TransactionSource,
        reference: string | null,
        timestamp: string,
    ): void {
        const transaction = this.createTransaction(
            type,
            Math.abs(delta),
            source,
            reference,
            timestamp,
        );

        this.domainState.update((domain) => ({
            ...domain,
            economy: {
                ...domain.economy,
                balance: domain.economy.balance + delta,
                transactions: [
                    ...domain.economy.transactions,
                    transaction,
                ],
            },
        }));
    }

    private createTransaction(
        type: Transaction["type"],
        amount: number,
        source: TransactionSource,
        reference: string | null,
        timestamp: string,
    ): Transaction {
        return {
            id: asId<"Transaction">(globalThis.crypto.randomUUID()),
            type,
            amount,
            source,
            reference,
            timestamp,
        };
    }

    private validateAmount(amount: number): void {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new DomainError(
                "INVALID_STATE",
                "Economy amount must be a positive integer.",
            );
        }
    }
}
