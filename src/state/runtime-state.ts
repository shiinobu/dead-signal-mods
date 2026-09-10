import type { FlagRecord } from "../domain/shared/index.js";

export interface RuntimeState {
    readonly flags: FlagRecord;
}