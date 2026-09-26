import { describe, expect, it } from "vitest";
import { InMemoryKycJobQueue, type KycJob } from "../src/queues/kyc";

const job: KycJob = {
  jobId:"job-0000000001",
  transactionId:"request-0000000001",
  input:{
    householdReference:"RC-1",
    memberReference:"M-1",
    consentReference:"consent-1",
    consentPolicyVersion:"2026-09",
    consentLanguage:"en",
    idempotencyKey:"idempotency-key-12345"
  },
  enqueuedAt:"2026-09-26T12:00:00.000Z",
  attempt:0
};

describe("KYC queue boundary", () => {
  it("preserves the complete job envelope and supports draining", async () => {
    const queue = new InMemoryKycJobQueue();
    await queue.enqueue(job);
    expect(queue.drain()).toEqual([job]);
    expect(queue.drain()).toEqual([]);
  });
});
