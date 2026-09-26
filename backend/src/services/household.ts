import type { PdsProvider } from "../providers/pds/provider";

export class HouseholdService {
  constructor(private readonly pds: PdsProvider) {}

  async lookup(rationCardReference: string) {
    const reference = rationCardReference.trim();
    if (!reference || reference.length > 64) {
      throw new Error("Invalid ration card reference");
    }
    return this.pds.lookupHousehold(reference);
  }
}
