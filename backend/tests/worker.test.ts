import { AppError } from "../src/domain/errors";
import { describe, expect, it } from "vitest";
import { KycWorker } from "../src/queues/worker";
import type { TransactionService } from "../src/services/transactions";
import type { KycJob } from "../src/queues/kyc";

const job: KycJob = {
  jobId:"job-1",
  transactionId:"request-1",
  input:{
    householdReference:"RC-1",
    memberReference:"M-1",
    consentReference:"consent-1",
    idempotencyKey:"idempotency-key-12345"
  },
  enqueuedAt:"2026-09-26T12:00:00.000Z",
  attempt:0
};

describe("KycWorker", () => {
  it("acknowledges an already completed transaction", async () => {
    const service = {
      get: async () => ({ requestId:"request-1", householdReference:"RC-1", memberReference:"M-1", status:"success", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:01.000Z" }),
      process: async () => { throw new Error("must not process"); },
      markFailed: async () => { throw new Error("must not fail"); }
    } as unknown as TransactionService;
    const result = await new KycWorker(service).consume(job);
    expect(result).toEqual({ acknowledged:true, retryable:false });
  });

  it("requests a retry for transient processing failure", async () => {
    const service = {
      get: async () => ({ requestId:"request-1", householdReference:"RC-1", memberReference:"M-1", status:"retrying", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:01.000Z" }),
      process: async () => { throw new AppError("UPSTREAM_UNAVAILABLE","temporary",503); },
      markFailed: async () => { throw new Error("must not fail yet"); }
    } as unknown as TransactionService;
    const result = await new KycWorker(service).consume(job);
    expect(result).toEqual({ acknowledged:false, retryable:true });
  });

  it("does not retry a non-transient failure", async () => {
    const service = {
      get: async () => ({ requestId:"request-1", householdReference:"RC-1", memberReference:"M-1", status:"retrying", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:01.000Z" }),
      process: async () => { throw new AppError("AUTHENTICATION_FAILED","rejected",502); },
      markFailed: async () => { throw new Error("must not fail"); }
    } as unknown as TransactionService;
    const result = await new KycWorker(service).consume(job);
    expect(result).toEqual({ acknowledged:true, retryable:false });
  });
});


describe("KycWorker retry exhaustion", () => {
  it("acknowledges and marks the transaction failed on the final retry", async () => {
    const calls: string[] = [];
    const service = {
      get: async () => ({ requestId:"request-1", householdReference:"RC-1", memberReference:"M-1", status:"retrying", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:01.000Z" }),
      process: async () => { throw new AppError("UPSTREAM_UNAVAILABLE","temporary",503); },
      markFailed: async () => { calls.push("failed"); return undefined; }
    } as unknown as TransactionService;
    const finalAttempt = {...job, attempt:2};
    const result = await new KycWorker(service,3).consume(finalAttempt);
    expect(result).toEqual({ acknowledged:true, retryable:false });
    expect(calls).toEqual(["failed"]);
  });

  it("does not retry when the configured attempt limit is already exhausted", async () => {
    const calls: string[] = [];
    const service = {
      get: async () => ({ requestId:"request-1", householdReference:"RC-1", memberReference:"M-1", status:"retrying", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:01.000Z" }),
      process: async () => { throw new AppError("UPSTREAM_UNAVAILABLE","temporary",503); },
      markFailed: async () => { calls.push("failed"); return undefined; }
    } as unknown as TransactionService;
    const result = await new KycWorker(service,2).consume({...job,attempt:1});
    expect(result).toEqual({ acknowledged:true, retryable:false });
    expect(calls).toEqual(["failed"]);
  });
});
