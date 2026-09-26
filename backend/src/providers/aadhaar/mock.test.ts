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

  it("returns an OTP and Face reference for the required multi-factor path", async () => {\n    const result = await new MockAadhaarProvider().startAuthentication({ method: "otp_face", transactionId: "demo-transaction", memberReference: "demo-member", consentReference: "demo-consent" });\n    expect(result.accepted).toBe(true);\n    expect(result.providerReference).toBe("demo-otp-face-auth-reference");\n  });\n\n  it("returns an OTP reference without implementing OTP itself", async () => {
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
