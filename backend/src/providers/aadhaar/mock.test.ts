import { describe, expect, it } from "vitest";
import { MockAadhaarProvider } from "./mock";

describe("MockAadhaarProvider", () => {
  it("returns a Face Authentication reference", async () => {
    const result = await new MockAadhaarProvider().startAuthentication({
      method: "face",
      transactionId: "demo-transaction",
      memberReference: "demo-member",
      consentReference: "demo-consent"
    });
    expect(result.accepted).toBe(true);
    expect(result.providerReference).toBe("demo-face-auth-reference");
  });

  it("returns an OTP reference without implementing OTP itself", async () => {
    const result = await new MockAadhaarProvider().startAuthentication({
      method: "otp",
      transactionId: "demo-transaction",
      memberReference: "demo-member",
      consentReference: "demo-consent"
    });
    expect(result.accepted).toBe(true);
    expect(result.providerReference).toBe("demo-otp-auth-reference");
  });
});
