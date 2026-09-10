import type { HackAttemptId } from "../../core/index.js";

export interface HackingState {
    readonly activeAttemptId: HackAttemptId | null;
    readonly completedAttemptIds: readonly HackAttemptId[];
}