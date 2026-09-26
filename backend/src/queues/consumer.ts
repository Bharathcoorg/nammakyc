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

export function decodeKycJob(value: unknown): KycJob {
  if (!value || typeof value !== "object") throw new Error("Invalid KYC queue envelope");
  const envelope = value as Partial<QueueEnvelope>;
  if (envelope.version !== 1 || !envelope.job || typeof envelope.job !== "object") {
    throw new Error("Invalid KYC queue envelope");
  }
  const job = envelope.job as Partial<KycJob>;
  const input = job.input as Partial<KycJob["input"]> | undefined;
  if (
    typeof job.jobId !== "string" ||
    job.jobId.length < 1 ||
    job.jobId.length > 128 ||
    typeof job.transactionId !== "string" ||
    job.transactionId.length < 1 ||
    job.transactionId.length > 128 ||
    typeof job.enqueuedAt !== "string" ||
    !/^\\d{4}-\\d{2}-\\d{2}T/.test(job.enqueuedAt) ||
    typeof job.attempt !== "number" ||
    !Number.isInteger(job.attempt) ||
    job.attempt < 0 ||
    job.attempt > 100 ||
    !input ||
    typeof input !== "object" ||
    typeof input.householdReference !== "string" ||
    input.householdReference.length < 1 ||
    input.householdReference.length > 128 ||
    typeof input.memberReference !== "string" ||
    input.memberReference.length < 1 ||
    input.memberReference.length > 128 ||
    typeof input.consentReference !== "string" ||
    input.consentReference.length < 1 ||
    input.consentReference.length > 128 ||
    typeof input.idempotencyKey !== "string" ||
    input.idempotencyKey.length < 16 ||
    input.idempotencyKey.length > 128 ||
    (input.consentPolicyVersion !== undefined &&
      (typeof input.consentPolicyVersion !== "string" || input.consentPolicyVersion.length > 64)) ||
    (input.consentLanguage !== undefined && input.consentLanguage !== "en" && input.consentLanguage !== "kn"),
    input.authenticationMethod !== undefined && input.authenticationMethod !== "face" && input.authenticationMethod !== "otp" && input.authenticationMethod !== "otp_face"
  ) {
    throw new Error("Invalid KYC queue envelope");
  }
  return job as KycJob;
}

export function isDuplicateDelivery(current: KycTransaction | undefined, job: KycJob): boolean {
  if (!current) return false;
  return current.requestId === job.transactionId &&
    (current.status === "success" || current.status === "failed");
}
