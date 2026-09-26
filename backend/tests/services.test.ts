import { describe, expect, it } from "vitest";
import { HouseholdService } from "../src/services/household";
import type { PdsProvider } from "../src/providers/pds/provider";

describe("HouseholdService", () => {
  it("loads a household through the provider boundary", async () => {
    const provider: PdsProvider = {
      lookupHousehold: async (ref) => ({ householdReference: ref, members: [] })
    };
    const service = new HouseholdService(provider);
    await expect(service.lookup("RC-123")).resolves.toEqual({ householdReference: "RC-123", members: [] });
  });

  it("preserves recent verification metadata from the provider", async () => {
    const service = new HouseholdService({
      lookupHousehold: async (ref) => ({
        householdReference: ref,
        members: [{ memberReference:"M-1", displayName:"Demo Citizen", kycRequired:false, lastVerifiedAt:"2026-09-22T10:30:00.000Z" }]
      })
    });
    await expect(service.lookup("RC-RECENT")).resolves.toMatchObject({
      members: [{ kycRequired:false, lastVerifiedAt:"2026-09-22T10:30:00.000Z" }]
    });
  });

  it("rejects an empty reference", async () => {
    const service = new HouseholdService({ lookupHousehold: async () => ({ householdReference: "x", members: [] }) });
    await expect(service.lookup(" ")).rejects.toThrow("Invalid ration card reference");
  });
});
