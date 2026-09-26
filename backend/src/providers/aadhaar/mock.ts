import type { AadhaarProvider, AuthenticationRequest, AuthenticationResult } from "./provider";

export class MockAadhaarProvider implements AadhaarProvider {
  async startAuthentication(request: AuthenticationRequest): Promise<AuthenticationResult> {
    return {
      accepted: true,
      providerReference: request.method === "otp_face" ? "demo-otp-face-auth-reference" : request.method === "face" ? "demo-face-auth-reference" : "demo-otp-auth-reference",
      sessionReference: request.method === "otp_face" ? "demo-otp-face-session" : request.method === "face" ? "demo-face-session" : "demo-otp-session"
    };
  }
}
