import type { IdempotencyRecord } from "../domain/kyc/idempotency";
import type { KycTransaction } from "../domain/kyc/transaction";
import type { ConsentArtifact } from "../domain/kyc/consent";

export interface TransactionRepository {
  get(requestId: string): Promise<KycTransaction | undefined>;
  getIdempotency(key: string): Promise<IdempotencyRecord | undefined>;
  createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord, consent: ConsentArtifact): Promise<boolean>;
  update(transaction: KycTransaction): Promise<void>;
}

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, KycTransaction>();
  private readonly idempotency = new Map<string, IdempotencyRecord>();
  private readonly consent = new Map<string, ConsentArtifact>();

  async get(requestId: string) { return this.transactions.get(requestId); }
  async getIdempotency(key: string) { return this.idempotency.get(key); }

  async createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord, consent: ConsentArtifact) {
    if (this.transactions.has(transaction.requestId) || this.idempotency.has(record.key) || this.consent.has(consent.consentReference)) return false;
    this.transactions.set(transaction.requestId, transaction);
    this.idempotency.set(record.key, record);
    this.consent.set(consent.consentReference, consent);
    return true;
  }

  async update(transaction: KycTransaction) { this.transactions.set(transaction.requestId, transaction); }
}
