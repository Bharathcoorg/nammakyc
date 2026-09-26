import type { AadhaarProvider, AuthenticationRequest, AuthenticationResult } from "./provider";

export class MockAadhaarProvider implements AadhaarProvider {
  async startAuthentication(_request: AuthenticationRequest): Promise<AuthenticationResult> {
    return { accepted: true, providerReference: "demo-auth-reference" };
  }
}
