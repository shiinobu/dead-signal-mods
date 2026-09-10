import type { FlagKey, FlagValue } from "./flags.js";

export type ConditionNode =
    | { readonly kind: "all"; readonly conditions: readonly ConditionNode[] }
    | { readonly kind: "any"; readonly conditions: readonly ConditionNode[] }
    | { readonly kind: "not"; readonly condition: ConditionNode }
    | { readonly kind: "flag"; readonly key: FlagKey; readonly equals: FlagValue }
    | { readonly kind: "flag-exists"; readonly key: FlagKey }
    | { readonly kind: "always" }
    | { readonly kind: "never" };

export const always = (): ConditionNode => ({ kind: "always" });

export const never = (): ConditionNode => ({ kind: "never" });

export const all = (...conditions: readonly ConditionNode[]): ConditionNode => ({
    kind: "all",
    conditions,
});

export const any = (...conditions: readonly ConditionNode[]): ConditionNode => ({
    kind: "any",
    conditions,
});

export const not = (condition: ConditionNode): ConditionNode => ({
    kind: "not",
    condition,
});

export const flagEquals = (key: FlagKey, equals: FlagValue): ConditionNode => ({
    kind: "flag",
    key,
    equals,
});

export const flagExists = (key: FlagKey): ConditionNode => ({
    kind: "flag-exists",
    key,
});
