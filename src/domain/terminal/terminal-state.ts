import type { TerminalId } from "../../core/index.js";

export interface TerminalState {
    readonly discoveredTerminalIds: readonly TerminalId[];
}