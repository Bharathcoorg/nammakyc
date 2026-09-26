import type { PdsHousehold, PdsProvider } from "./provider";

export class MockPdsProvider implements PdsProvider {
  async lookupHousehold(rationCardReference: string): Promise<PdsHousehold> {
    return {
      householdReference: `demo-${rationCardReference}`,
      members: [
        { memberReference: "member-01", displayName: "Demo Member", kycRequired: true }
      ]
    };
  }
}
