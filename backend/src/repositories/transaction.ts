import type { IdempotencyRecord } from "../domain/kyc/idempotency";
import type { KycTransaction } from "../domain/kyc/transaction";

export interface TransactionRepository {
  get(requestId: string): Promise<KycTransaction | undefined>;
  getIdempotency(key: string): Promise<IdempotencyRecord | undefined>;
  createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord): Promise<boolean>;
  update(transaction: KycTransaction): Promise<void>;
}

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, KycTransaction>();
  private readonly idempotency = new Map<string, IdempotencyRecord>();

  async get(requestId: string) { return this.transactions.get(requestId); }
  async getIdempotency(key: string) { return this.idempotency.get(key); }

  async createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord) {
    if (this.transactions.has(transaction.requestId) || this.idempotency.has(record.key)) return false;
    this.transactions.set(transaction.requestId, transaction);
    this.idempotency.set(record.key, record);
    return true;
  }

  async update(transaction: KycTransaction) { this.transactions.set(transaction.requestId, transaction); }
}
