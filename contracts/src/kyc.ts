import { z } from "zod";
export const requestIdSchema=z.string().min(16).max(128);
export const kycStatusSchema=z.enum(["received","validating","aadhaar_pending","aadhaar_authenticating","aadhaar_authenticated","pds_processing","success","retrying","failed"]);
export const consentReferenceSchema=z.string().trim().min(1).max(128);
export const startKycRequestSchema=z.object({
  householdReference:z.string().trim().min(1).max(128),
  memberReference:z.string().trim().min(1).max(128),
  consentReference:consentReferenceSchema,
  consentPolicyVersion:z.string().trim().min(1).max(64).optional(),
  consentLanguage:z.enum(["en","kn"]).optional(),
  authenticationMethod:z.enum(["face","otp","otp_face"]).default("otp_face")
});
export const kycStatusResponseSchema=z.object({requestId:requestIdSchema,status:kycStatusSchema,authenticationMethod:z.enum(["face","otp","otp_face"]),reference:z.string().min(1).max(128).optional()});
export type StartKycRequest=z.infer<typeof startKycRequestSchema>;
export type KycStatusResponse=z.infer<typeof kycStatusResponseSchema>;


export const consentArtifactSchema=z.object({
  consentReference:consentReferenceSchema,
  purpose:z.literal("ration-card-e-kyc"),
  policyVersion:z.string().trim().min(1).max(64),
  language:z.enum(["en","kn"]),
  capturedAt:z.string().datetime(),
  transactionReference:requestIdSchema.optional()
});
export type ConsentArtifact=z.infer<typeof consentArtifactSchema>;
