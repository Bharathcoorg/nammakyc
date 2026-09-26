import { AppError } from "../domain/errors";
const MAX_BODY_BYTES = 16 * 1024;
const METHODS_WITH_BODY = new Set(["POST","PUT","PATCH"]);

export function validateRequest(request: Request): void {
  if (METHODS_WITH_BODY.has(request.method)) {
    const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (contentType !== "application/json") throw new AppError("INVALID_REQUEST", "application/json content type is required", 415);
    const length = request.headers.get("content-length");
    if (length && Number(length) > MAX_BODY_BYTES) throw new AppError("INVALID_REQUEST", "Request body is too large", 413);
  }
}
