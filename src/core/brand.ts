export type Brand<T, B extends string> = T & { readonly __brand: B };

export type Id<T extends string> = Brand<string, `${T}Id`>;

export type EntityId = Id<"Entity">;
export type QuestId = Id<"Quest">;
export type InvestigationId = Id<"Investigation">;
export type CharacterId = Id<"Character">;
export type RelationshipId = Id<"Relationship">;
export type EvidenceId = Id<"Evidence">;
export type DialogueId = Id<"Dialogue">;
export type TerminalId = Id<"Terminal">;
export type DatabaseId = Id<"Database">;
export type AccessGrantId = Id<"AccessGrant">;
export type RewardId = Id<"Reward">;

export const asId = <T extends string>(value: string): Id<T> => value as Id<T>;

export const assertNonEmptyId = <T extends string>(value: Id<T>): Id<T> => {
    if (value.trim().length === 0) {
        throw new Error("ID must not be empty.");
    }

    return value;
};
