import type {
    AccessGrantId,
    CharacterId,
} from "../../core/index.js";

import type {
    Capability,
} from "./capability.js";

export interface AccessGrant {
    readonly id: AccessGrantId;
    readonly actorId: CharacterId;
    readonly capability: Capability;
}