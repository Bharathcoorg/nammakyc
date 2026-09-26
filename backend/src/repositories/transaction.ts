import type { IdempotencyRecord } from "../domain/kyc/idempotency";
import type { KycTransaction } from "../domain/kyc/transaction";
import type { ConsentArtifact } from "../domain/kyc/consent";

export interface TransactionRepository {
  get(requestId: string): Promise<KycTransaction | undefined>;
  getIdempotency(key: string): Promise<IdempotencyRecord | undefined>;
  getConsent(transactionReference: string): Promise<ConsentArtifact | undefined>;
  createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord, consent: ConsentArtifact): Promise<boolean>;
  claimForProcessing(requestId: string, claimId: string, nowIso: string, staleBeforeIso: string): Promise<boolean>;
  renewProcessingClaim(requestId: string, claimId: string, nowIso: string): Promise<boolean>;
  update(transaction: KycTransaction, processingClaimId?: string): Promise<boolean>;
  purgeIdempotencyBefore(cutoffIso: string): Promise<number>;
}

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, KycTransaction>();
  private readonly idempotency = new Map<string, IdempotencyRecord>();
  private readonly consent = new Map<string, ConsentArtifact>();

  async get(requestId: string) { return this.transactions.get(requestId); }
  async getIdempotency(key: string) { return this.idempotency.get(key); }
  async getConsent(transactionReference: string) { for (const artifact of this.consent.values()) if (artifact.transactionReference === transactionReference) return artifact; return undefined; }

  async createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord, consent: ConsentArtifact) {
    if (this.transactions.has(transaction.requestId) || this.idempotency.has(record.key) || this.consent.has(consent.consentReference)) return false;
    this.transactions.set(transaction.requestId, transaction);
    this.idempotency.set(record.key, record);
    this.consent.set(consent.consentReference, consent);
    return true;
  }

  async claimForProcessing(requestId: string, claimId: string, nowIso: string, staleBeforeIso: string) {
    const current = this.transactions.get(requestId);
    if (!current) return false;
    const claimable =
      current.status === "validating" ||
      current.status === "retrying" ||
      ((current.status === "aadhaar_pending" || current.status === "aadhaar_authenticating" || current.status === "aadhaar_authenticated" || current.status === "pds_processing") && current.updatedAt < staleBeforeIso);
    if (!claimable) return false;
    this.transactions.set(requestId, { ...current, updatedAt: nowIso, processingClaimId: claimId });
    return true;
  }

  async renewProcessingClaim(requestId: string, claimId: string, nowIso: string) {
    const current = this.transactions.get(requestId);
    if (!current || current.processingClaimId !== claimId) return false;
    this.transactions.set(requestId, { ...current, updatedAt: nowIso });
    return true;
  }

  async update(transaction: KycTransaction, processingClaimId?: string) {
    const current = this.transactions.get(transaction.requestId);
    if (!current) return false;
    if (processingClaimId !== undefined && current.processingClaimId !== processingClaimId) return false;
    if (processingClaimId === undefined && current.processingClaimId !== undefined) return false;
    this.transactions.set(transaction.requestId, transaction);
    return true;
  }

  async purgeIdempotencyBefore(cutoffIso: string) {
    let removed = 0;
    for (const [key, record] of this.idempotency) {
      if (record.createdAt < cutoffIso) { this.idempotency.delete(key); removed++; }
    }
    return removed;
  }
}
