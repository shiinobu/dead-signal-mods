import type { TerminalId } from "../../core/index.js";

export type TerminalKind =
    | "workstation"
    | "server"
    | "mobile"
    | "network";

export interface Terminal {
    readonly id: TerminalId;
    readonly kind: TerminalKind;
    readonly name: string;
    readonly description: string;
}