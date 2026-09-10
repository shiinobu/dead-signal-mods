import type { Id } from "./brand.js";

export interface DomainEvent<TType extends string = string, TPayload = unknown> {
    readonly eventId: Id<"DomainEvent">;
    readonly type: TType;
    readonly occurredAt: number;
    readonly payload: TPayload;
}

export type DomainEventType = DomainEvent["type"];
