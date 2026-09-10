import type { MissionRewardId, TransactionId } from "../../core/index.js";

export type TransactionType = "CREDIT" | "DEBIT";

export type TransactionSource =
    | "QUEST_REWARD"
    | "BONUS"
    | "PURCHASE"
    | "PENALTY"
    | "SYSTEM";

export interface Transaction {
    readonly id: TransactionId;
    readonly type: TransactionType;
    readonly amount: number;
    readonly source: TransactionSource;
    readonly reference: string | null;
    readonly timestamp: string;
}

export interface MissionReward {
    readonly id: MissionRewardId;
    readonly questId: string;
    readonly amount: number;
    readonly rewardIndex: number;
}

export interface Reward {
    readonly amount: number;
    readonly source: Extract<TransactionSource, "QUEST_REWARD" | "BONUS">;
}

export interface Penalty {
    readonly amount: number;
    readonly source: Extract<TransactionSource, "PENALTY" | "PURCHASE">;
}
