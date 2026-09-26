import { describe, expect, it } from "vitest";
import { InMemoryTransactionRepository } from "../src/repositories/transaction";
import { TransactionService } from "../src/services/transactions";
import type { PdsProvider } from "../src/providers/pds/provider";
import type { AadhaarProvider } from "../src/providers/aadhaar/provider";
import type { KycProvider } from "../src/providers/kyc/provider";

const pds: PdsProvider = {
  lookupHousehold: async (ref) => ({ householdReference: ref, members: [{ memberReference: "M-1", displayName: "Demo Citizen", kycRequired: true }] }),
};

describe("TransactionService", () => {
  it("replays the same idempotent request", async () => {
    const aadhaar: AadhaarProvider = { startAuthentication: async () => ({ accepted: true, providerReference: "auth-1" }) };
    const kyc: KycProvider = { submit: async () => ({ success: true, providerReference: "kyc-1" }) };
    const service = new TransactionService(new InMemoryTransactionRepository(), pds, aadhaar, kyc);
    const input = { householdReference: "RC-1", memberReference: "M-1", consentReference: "consent-1", idempotencyKey: "idempotency-key-12345" };
    const first = await service.start(input);
    const second = await service.start(input);
    expect(second.requestId).toBe(first.requestId);
    expect(second.status).toBe("success");
  });

  it("rejects reusing an idempotency key for different input", async () => {
    const service = new TransactionService(new InMemoryTransactionRepository(), pds,
      { startAuthentication: async () => ({ accepted: true, providerReference: "auth-1" }) },
      { submit: async () => ({ success: true, providerReference: "kyc-1" }) });
    const key = "idempotency-key-12345";
    await service.start({ householdReference: "RC-1", memberReference: "M-1", consentReference: "consent-1", idempotencyKey: key });
    await expect(service.start({ householdReference: "RC-1", memberReference: "M-1", consentReference: "consent-2", idempotencyKey: key }))
      .rejects.toMatchObject({ code: "DUPLICATE_REQUEST", status: 409 });
  });
});
