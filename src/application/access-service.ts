import type {
    AccessGrant,
    Capability,
} from "../domain/index.js";

import type {
    AccessGrantId,
    CharacterId,
} from "../core/index.js";

import type {
    DomainStateAccess,
} from "../state/index.js";

export class AccessService {
    constructor(
        private readonly domainState: DomainStateAccess,
    ) {}

    getGrants(): readonly AccessGrant[] {
        return Object.values(
            this.domainState.get().access.grants,
        );
    }

    grant(
        grant: AccessGrant,
    ): void {
        this.domainState.update((current) => {
            if (
                Object.prototype.hasOwnProperty.call(
                    current.access.grants,
                    grant.id,
                )
            ) {
                return current;
            }

            return {
                ...current,
                access: {
                    ...current.access,
                    grants: {
                        ...current.access.grants,
                        [grant.id]: grant,
                    },
                },
            };
        });
    }

    revoke(grantId: AccessGrantId): void {
        this.domainState.update((current) => {
            if (
                !Object.prototype.hasOwnProperty.call(
                    current.access.grants,
                    grantId,
                )
            ) {
                return current;
            }

            const grants = {
                ...current.access.grants,
            };

            delete grants[grantId];

            return {
                ...current,
                access: {
                    ...current.access,
                    grants,
                },
            };
        });
    }

    hasCapability(
        actorId: CharacterId,
        capability: Capability,
    ): boolean {
        return Object.values(
            this.domainState.get().access.grants,
        ).some(
            (grant) =>
                grant.actorId === actorId &&
                grant.capability === capability,
        );
    }

    getActorCapabilities(
        actorId: CharacterId,
    ): readonly Capability[] {
        return Object.values(
            this.domainState.get().access.grants,
        )
            .filter(
                (grant) => grant.actorId === actorId,
            )
            .map(
                (grant) => grant.capability,
            );
    }
}