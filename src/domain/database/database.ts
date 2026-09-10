import type { DatabaseId } from "../../core/index.js";

export type DatabaseKind =
    | "user"
    | "transaction"
    | "communication"
    | "system"
    | "archive";

export interface Database {
    readonly id: DatabaseId;
    readonly kind: DatabaseKind;
    readonly name: string;
    readonly description: string;
}