import { z } from "zod";

export const requestIdSchema = z.string().min(16).max(128);

export const kycStatusSchema = z.enum([
  "received",
  "processing",
  "success",
  "failed"
]);

export const kycStatusResponseSchema = z.object({
  requestId: requestIdSchema,
  status: kycStatusSchema
});

export type KycStatusResponse = z.infer<typeof kycStatusResponseSchema>;
