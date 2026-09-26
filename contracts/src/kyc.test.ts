import { describe, expect, it } from "vitest";
import { startKycRequestSchema } from "./kyc";

describe("start KYC request", () => {
  it("defaults to Face Authentication", () => {
    const result = startKycRequestSchema.parse({
      householdReference: "demo-household",
      memberReference: "demo-member",
      consentReference: "demo-consent"
    });
    expect(result.authenticationMethod).toBe("face");
  });

  it("accepts OTP as a provider-controlled alternative", () => {
    const result = startKycRequestSchema.parse({
      householdReference: "demo-household",
      memberReference: "demo-member",
      consentReference: "demo-consent",
      authenticationMethod: "otp"
    });
    expect(result.authenticationMethod).toBe("otp");
  });
});


it("accepts the explicit provider lifecycle response",()=>{
  const { kycStatusResponseSchema } = require("./kyc");
  expect(kycStatusResponseSchema.parse({requestId:"request-1234567890123456",status:"aadhaar_authenticated",authenticationMethod:"face"}).status).toBe("aadhaar_authenticated");
});
