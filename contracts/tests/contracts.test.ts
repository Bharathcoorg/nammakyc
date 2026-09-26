import { describe, expect, it } from "vitest";
import { errorResponseSchema, householdSchema, kycStatusResponseSchema, startKycRequestSchema } from "../src";

describe("API contracts", () => {
  it("accepts a household response", () => {
    expect(householdSchema.safeParse({
      householdReference: "demo-household",
      members: [{ memberReference: "member-01", displayName: "Demo Member", kycRequired: true }]
    }).success).toBe(true);
  });

  it("requires a sufficiently strong idempotency key", () => {
    expect(startKycRequestSchema.safeParse({
      memberReference: "member-01",
      consentReference: "consent-01",
      idempotencyKey: "short"
    }).success).toBe(false);
  });

  it("accepts a KYC status response", () => {
    expect(kycStatusResponseSchema.safeParse({
      requestId: "request-1234567890123456",
      status: "processing"
    }).success).toBe(true);
  });

  it("validates structured errors", () => {
    expect(errorResponseSchema.safeParse({
      error: { code: "NOT_FOUND", message: "Not found" }
    }).success).toBe(true);
  });
});
