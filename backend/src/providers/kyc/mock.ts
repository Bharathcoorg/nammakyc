import type { KycProvider, KycResult, KycSubmission } from "./provider";

export class MockKycProvider implements KycProvider {
  async submit(_request: KycSubmission): Promise<KycResult> {
    return { success: true, providerReference: "demo-kyc-reference" };
  }
}
