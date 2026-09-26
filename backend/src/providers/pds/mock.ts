import type { PdsHousehold, PdsProvider } from "./provider";

export class MockPdsProvider implements PdsProvider {
  async lookupHousehold(rationCardReference: string): Promise<PdsHousehold> {
    return {
      householdReference: `demo-${rationCardReference}`,
      members: [
        { memberReference: "member-01", displayName: "Anitha Rao", kycRequired: true },
        { memberReference: "member-02", displayName: "Ravi Kumar", kycRequired: false, lastVerifiedAt: "2026-09-22T10:30:00.000Z" }
      ]
    };
  }
}
