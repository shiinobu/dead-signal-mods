import type { FlagStore } from "../../state/flag-store.js";
import type { ConditionNode } from "./condition.js";

export class ConditionEvaluator {
    constructor(
        private readonly flagStore: FlagStore,
    ) {}

    evaluate(condition: ConditionNode): boolean {
        switch (condition.kind) {
            case "always":
                return true;

            case "never":
                return false;

            case "flag":
                return this.evaluateFlag(
                    condition.key,
                    condition.equals,
                );

            case "flag-exists":
                return this.flagStore.has(condition.key);

            case "all":
                return condition.conditions.every((child) =>
                    this.evaluate(child),
                );

            case "any":
                return condition.conditions.some((child) =>
                    this.evaluate(child),
                );

            case "not":
                return !this.evaluate(condition.condition);

            default:
                return assertNever(condition);
        }
    }

    private evaluateFlag(
        key: string,
        expected: string | number | boolean,
    ): boolean {
        const actual = this.flagStore.get(key);

        return actual === expected;
    }
}

const assertNever = (value: never): never => {
    throw new Error(
        `Unsupported condition node: ${JSON.stringify(value)}`,
    );
};