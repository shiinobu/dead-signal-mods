import type {
    DatabaseId,
    HackAttemptId,
    TerminalId,
} from "../../core/index.js";

export type HackTarget =
    | {
        readonly kind: "terminal";
        readonly id: TerminalId;
    }
    | {
        readonly kind: "database";
        readonly id: DatabaseId;
    };

export type HackAttemptStatus =
    | "success"
    | "failure";

export interface HackAttempt {
    readonly id: HackAttemptId;
    readonly target: HackTarget;
    readonly status: HackAttemptStatus;
}