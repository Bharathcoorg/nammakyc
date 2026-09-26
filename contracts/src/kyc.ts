import { z } from "zod";
export const requestIdSchema = z.string().min(16).max(128);
export const kycStatusSchema = z.enum(["received","validating","authenticating","processing","success","retrying","failed"]);
export const startKycRequestSchema = z.object({
  memberReference: z.string().min(1).max(128),
  consentReference: z.string().min(1).max(128)
});
export const kycStatusResponseSchema = z.object({
  requestId: requestIdSchema, status: kycStatusSchema, reference: z.string().min(1).max(128).optional()
});
export type StartKycRequest = z.infer<typeof startKycRequestSchema>;
export type KycStatusResponse = z.infer<typeof kycStatusResponseSchema>;
