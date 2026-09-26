import { describe, expect, it } from "vitest";
import { CloudflareKycQueue, InMemoryKycJobQueue, type KycJob } from "../src/queues/kyc";
import { decodeKycJob } from "../src/queues/consumer";
import { KycWorker } from "../src/queues/worker";
import type { MetricName, MetricsSink } from "../src/observability/metrics";

const job: KycJob = {
  jobId:"job-0000000001",
  transactionId:"request-0000000001",
  input:{
    householdReference:"RC-1",
    memberReference:"M-1",
    consentReference:"consent-1",
    consentPolicyVersion:"2026-09",
    consentLanguage:"en",
    idempotencyKey:"0000000000000000",
    authenticationMethod:"otp_face"
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
    expect(() => decodeKycJob({ version:1, job:{...job, input:{...job.input, authenticationMethod:"unsupported"}} })).toThrow("Invalid KYC queue envelope");
  });
});


class RecordingMetrics implements MetricsSink { events: MetricName[] = []; increment(name: MetricName): void { this.events.push(name); } }

describe("KYC worker retry policy", () => {
  it("acknowledges a terminal delivery after the retry budget is exhausted", async () => {
    let failed = 0;
    const metrics = new RecordingMetrics();
    const service = {
      get: async () => undefined,
      process: async () => { throw new Error("not reached"); },
      markFailed: async () => { failed++; return {} as never; }
    };
    const worker = new KycWorker(service as never, 3, metrics);
    const result = await worker.consume({ ...job, attempt: 2 });
    expect(result).toEqual({ acknowledged: true, retryable: false });
    expect(failed).toBe(1);
    expect(metrics.events).toEqual(["queue.failed"]);
  });
});
