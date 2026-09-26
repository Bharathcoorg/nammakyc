import { describe, expect, it } from "vitest";
import { transitionTransaction } from "../src/domain/kyc/transaction";
import { sameRequest } from "../src/domain/kyc/idempotency";

describe("KYC domain", () => {
  it("allows valid transaction transitions", () => {
    const transaction = {
      requestId: "request-1234567890123456",
      memberReference: "member-01",
      status: "received" as const,
      createdAt: "2026-09-26T00:00:00.000Z",
      updatedAt: "2026-09-26T00:00:00.000Z"
    };

    expect(transitionTransaction(transaction, "validating").status).toBe("validating");\n    expect(transitionTransaction(transitionTransaction(transaction, "validating"), "aadhaar_pending").status).toBe("aadhaar_pending");
  });

  it("rejects invalid terminal transitions", () => {
    const transaction = {
      requestId: "request-1234567890123456",
      memberReference: "member-01",
      status: "success" as const,
      createdAt: "2026-09-26T00:00:00.000Z",
      updatedAt: "2026-09-26T00:00:00.000Z"
    };

    expect(() => transitionTransaction(transaction, "processing")).toThrow();
  });

  it("detects idempotency request mismatches", () => {
    const record = {
      key: "idem-1234567890123456",
      requestFingerprint: "fingerprint-a",
      requestId: "request-1234567890123456",
      createdAt: "2026-09-26T00:00:00.000Z"
    };

    expect(sameRequest(record, "fingerprint-a")).toBe(true);
    expect(sameRequest(record, "fingerprint-b")).toBe(false);
  });
});
