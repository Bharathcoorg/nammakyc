import { z } from "zod";

export const errorCodeSchema = z.enum([
  "INVALID_REQUEST",
  "NOT_FOUND",
  "DUPLICATE_REQUEST",
  "UPSTREAM_UNAVAILABLE",
  "AUTHENTICATION_FAILED",
  "INTERNAL_ERROR"
]);

export const errorResponseSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string()
  })
});
