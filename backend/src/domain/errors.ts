export type ErrorCode =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "DUPLICATE_REQUEST"
  | "UPSTREAM_UNAVAILABLE"
  | "AUTHENTICATION_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "AppError";
  }
}
