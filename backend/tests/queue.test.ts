import { describe, expect, it } from "vitest";
import { CloudflareKycQueue, InMemoryKycJobQueue, type KycJob } from "../src/queues/kyc";
import { decodeKycJob } from "../src/queues/consumer";

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

describe("Cloudflare queue adapter", () => {
  it("sends and decodes the versioned job envelope", async () => {
    let sent: unknown;
    const queue = new CloudflareKycQueue({ send: async body => { sent = body; } });
    await queue.enqueue(job);
    expect(decodeKycJob(sent)).toEqual(job);
  });

  it("rejects malformed queue payloads", () => {
    expect(() => decodeKycJob({ version:2, job })).toThrow("Invalid KYC queue envelope");
    expect(() => decodeKycJob({ version:1, job:{...job, attempt:-1} })).toThrow("Invalid KYC queue envelope");
    expect(() => decodeKycJob({ version:1, job:{...job, input:{...job.input, idempotencyKey:"short"}} })).toThrow("Invalid KYC queue envelope");
  });
});
