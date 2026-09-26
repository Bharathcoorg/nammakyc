import { describe, expect, it } from "vitest";
import { getHousehold } from "../src/services/household";
import { MockPdsProvider } from "../src/providers/pds/mock";

describe("services", () => {
  it("validates and retrieves a synthetic household", async () => {
    const result = await getHousehold(new MockPdsProvider(), "demo-card");
    expect(result.members).toHaveLength(1);
    expect(result.members[0].kycRequired).toBe(true);
  });

  it("rejects an invalid household reference", async () => {
    await expect(getHousehold(new MockPdsProvider(), " ")).rejects.toMatchObject({
      code: "INVALID_REQUEST",
      status: 400
    });
  });
});
