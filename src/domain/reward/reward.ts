import type { RewardId } from "../../core/index.js";

export type RewardKind =
    | "experience";

export interface Reward {
    readonly id: RewardId;
    readonly kind: RewardKind;
    readonly amount: number;
}