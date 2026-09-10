import type { Transaction } from "./economy.js";

export interface EconomyState {
    readonly balance: number;
    readonly transactions: readonly Transaction[];
    readonly appliedMissionRewardKeys: readonly string[];
}
