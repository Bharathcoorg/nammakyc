import type { KycTransaction } from "../domain/kyc/transaction";
import type { IdempotencyRecord } from "../domain/kyc/idempotency";

export interface TransactionRepository {
  getByRequestId(requestId: string): Promise<KycTransaction | undefined>;
  getByIdempotencyKey(key: string): Promise<IdempotencyRecord | undefined>;
  createIfAbsent(transaction: KycTransaction, idempotency: IdempotencyRecord): Promise<boolean>;
  update(transaction: KycTransaction): Promise<void>;
}

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, KycTransaction>();
  private readonly idempotency = new Map<string, IdempotencyRecord>();
  async getByRequestId(requestId: string) { return this.transactions.get(requestId); }
  async getByIdempotencyKey(key: string) { return this.idempotency.get(key); }
  async createIfAbsent(transaction: KycTransaction, record: IdempotencyRecord) {
    if (this.idempotency.has(record.key) || this.transactions.has(transaction.requestId)) return false;
    this.idempotency.set(record.key, record);
    this.transactions.set(transaction.requestId, transaction);
    return true;
  }
  async update(transaction: KycTransaction) {
    if (!this.transactions.has(transaction.requestId)) throw new Error("Transaction does not exist");
    this.transactions.set(transaction.requestId, transaction);
  }
}
