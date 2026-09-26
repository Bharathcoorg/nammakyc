import type { AadhaarProvider, AuthenticationRequest, AuthenticationResult } from "./provider";

export class MockAadhaarProvider implements AadhaarProvider {
  async startAuthentication(request: AuthenticationRequest): Promise<AuthenticationResult> {
    return { accepted: true, providerReference: request.method === "face" ? "demo-face-auth-reference" : "demo-otp-auth-reference" };
  }
}
