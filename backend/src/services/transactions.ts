import { createTransaction, transitionTransaction, type KycTransaction } from "../domain/kyc/transaction";
import { AppError } from "../domain/errors";
import { sameRequest, type IdempotencyRecord } from "../domain/kyc/idempotency";
import type { PdsProvider } from "../providers/pds/provider";
import type { AadhaarProvider } from "../providers/aadhaar/provider";
import type { KycProvider } from "../providers/kyc/provider";
import type { TransactionRepository } from "../repositories/transaction";
import { CircuitBreaker } from "../reliability/circuit-breaker";
import { withRetry } from "../reliability/retry";
import { TimeoutError, withTimeout } from "../reliability/timeout";
import type { ConsentArtifact } from "../domain/kyc/consent";

export interface StartKycInput {
  householdReference: string;
  memberReference: string;
  consentReference: string;
  consentPolicyVersion?: string;
  consentLanguage?: "en" | "kn";
  idempotencyKey: string;
}

function fingerprint(input: StartKycInput): string {
  return JSON.stringify([
    input.householdReference.trim(),
    input.memberReference.trim(),
    input.consentReference.trim(),
    input.consentPolicyVersion?.trim() ?? "",
    input.consentLanguage ?? ""
  ]);
}

const transient = (error: unknown) =>
  error instanceof AppError && (error.code === "UPSTREAM_UNAVAILABLE" || error.code === "AUTHENTICATION_FAILED");

const providerPolicy = { attempts: 3, baseDelayMs: 75, maxDelayMs: 500 };
const aadhaarBreaker = new CircuitBreaker(5, 30_000);
const kycBreaker = new CircuitBreaker(5, 30_000);

async function guarded<T>(breaker: CircuitBreaker, operation: (signal: AbortSignal) => Promise<T>): Promise<T> {
  if (!breaker.canExecute()) throw new AppError("UPSTREAM_UNAVAILABLE", "Verification service is temporarily unavailable", 503);
  try {
    const result = await withRetry(
      () => withTimeout(operation, 8_000),
      providerPolicy,
      transient
    );
    breaker.recordSuccess();
    return result;
  } catch (error) {
    breaker.recordFailure();
    throw error;
  }
}

export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly pds: PdsProvider,
    private readonly aadhaar: AadhaarProvider,
    private readonly kyc: KycProvider
  ) {}

  async start(input: StartKycInput): Promise<KycTransaction> {
    const key = input.idempotencyKey.trim();
    if (key.length < 16 || key.length > 128) throw new AppError("INVALID_REQUEST", "Invalid idempotency key", 400);
    const fp = fingerprint(input);
    const existing = await this.repository.getIdempotency(key);
    if (existing) {
      if (!sameRequest(existing, fp)) throw new AppError("DUPLICATE_REQUEST", "Idempotency key was already used for another request", 409);
      const replay = await this.repository.get(existing.requestId);
      if (!replay) throw new AppError("INTERNAL_ERROR", "Idempotency record is inconsistent", 500);
      return replay;
    }

    const household = await this.pds.lookupHousehold(input.householdReference);
    const member = household.members.find(m => m.memberReference === input.memberReference);
    if (!member) throw new AppError("INVALID_REQUEST", "Member does not belong to household", 400);

    let transaction = createTransaction(crypto.randomUUID(), input.householdReference.trim(), member.memberReference);
    transaction = transitionTransaction(transaction, "validating");
    const consent: ConsentArtifact = {
      consentReference: input.consentReference.trim(),
      purpose: "ration-card-e-kyc",
      policyVersion: input.consentPolicyVersion?.trim() || "unspecified",
      language: input.consentLanguage ?? "en",
      capturedAt: transaction.createdAt,
      transactionReference: transaction.requestId,
    };
    const record: IdempotencyRecord = { key, requestFingerprint: fp, requestId: transaction.requestId, createdAt: transaction.createdAt };
    if (!(await this.repository.createIfAbsent(transaction, record, consent))) {
      const replayRecord = await this.repository.getIdempotency(key);
      if (replayRecord && sameRequest(replayRecord, fp)) {
        const replay = await this.repository.get(replayRecord.requestId);
        if (replay) return replay;
      }
      throw new AppError("DUPLICATE_REQUEST", "Request could not be created", 409);
    }

    try {
      transaction = transitionTransaction(transaction, "authenticating");
      await this.repository.update(transaction);

      const auth = await guarded(aadhaarBreaker, (signal) =>
        this.aadhaar.startAuthentication({
          transactionId: transaction.requestId,
          memberReference: member.memberReference,
          consentReference: input.consentReference,
        }, signal)
      );
      if (!auth.accepted || !auth.providerReference) throw new AppError("AUTHENTICATION_FAILED", "Authentication was not accepted", 502);

      transaction = transitionTransaction(transaction, "processing");
      transaction.providerReference = auth.providerReference;
      await this.repository.update(transaction);

      const result = await guarded(kycBreaker, (signal) =>
        this.kyc.submit({
          transactionId: transaction.requestId,
          memberReference: member.memberReference,
          authenticationReference: auth.providerReference!,
        }, signal)
      );
      if (!result.success) throw new AppError("UPSTREAM_UNAVAILABLE", "KYC provider did not complete the request", 502);

      transaction = transitionTransaction(transaction, "success");
      transaction.providerReference = result.providerReference ?? auth.providerReference;
      await this.repository.update(transaction);
      return transaction;
    } catch (error) {
      const failed = transitionTransaction(transaction, "failed");
      await this.repository.update(failed);
      throw error;
    }
  }
}
