import type { KycTransaction } from "../domain/kyc/transaction";
import type { KycJob } from "./kyc";

export interface KycJobResult {
  acknowledged: boolean;
  retryable: boolean;
}

export interface KycJobConsumer {
  consume(job: KycJob): Promise<KycJobResult>;
}

export interface QueueEnvelope {
  version: 1;
  job: KycJob;
}

export function encodeKycJob(job: KycJob): QueueEnvelope {
  return { version: 1, job };
}

export function isDuplicateDelivery(current: KycTransaction | undefined, job: KycJob): boolean {
  if (!current) return false;
  return current.requestId === job.transactionId &&
    (current.status === "success" || current.status === "failed");
}
