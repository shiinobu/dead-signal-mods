import type {
    AccessGrant,
} from "./access-grant.js";

export interface AccessState {
    readonly grants: Readonly<Record<string, AccessGrant>>;
}