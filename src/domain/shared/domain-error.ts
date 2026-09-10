export type DomainErrorCode =
    | "INVALID_ID"
    | "INVALID_STATE"
    | "INVALID_TRANSITION"
    | "PRECONDITION_FAILED"
    | "NOT_FOUND"
    | "ALREADY_EXISTS";

export class DomainError extends Error {
    readonly code: DomainErrorCode;

    constructor(code: DomainErrorCode, message: string) {
        super(message);
        this.name = "DomainError";
        this.code = code;
    }
}
