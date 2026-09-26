import type { D1Database } from "@cloudflare/workers-types";
import type { KycTransaction } from "../domain/kyc/transaction";
import type { IdempotencyRecord } from "../domain/kyc/idempotency";
import type { TransactionRepository } from "./transaction";

export class D1TransactionRepository implements TransactionRepository {
  constructor(private readonly db: D1Database) {}

  async getByRequestId(requestId: string): Promise<KycTransaction | undefined> {
    const row = await this.db.prepare("SELECT request_id, member_reference, status, provider_reference, created_at, updated_at FROM kyc_transactions WHERE request_id = ?1").bind(requestId).first<{
      request_id:string; member_reference:string; status: KycTransaction["status"]; provider_reference?:string; created_at:string; updated_at:string;
    }>();
    if (!row) return undefined;
    return { requestId: row.request_id, memberReference: row.member_reference, status: row.status, providerReference: row.provider_reference, createdAt: row.created_at, updatedAt: row.updated_at };
  }

  async getByIdempotencyKey(key: string): Promise<IdempotencyRecord | undefined> {
    const row = await this.db.prepare("SELECT idempotency_key, request_fingerprint, request_id, created_at FROM idempotency_keys WHERE idempotency_key = ?1").bind(key).first<{
      idempotency_key:string; request_fingerprint:string; request_id:string; created_at:string;
    }>();
    if (!row) return undefined;
    return { key: row.idempotency_key, requestFingerprint: row.request_fingerprint, requestId: row.request_id, createdAt: row.created_at };
  }

  async createIfAbsent(transaction: KycTransaction, idempotency: IdempotencyRecord): Promise<boolean> {
    const result = await this.db.batch([
      this.db.prepare("INSERT OR IGNORE INTO kyc_transactions (request_id, member_reference, status, provider_reference, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
        .bind(transaction.requestId, transaction.memberReference, transaction.status, transaction.providerReference ?? null, transaction.createdAt, transaction.updatedAt),
      this.db.prepare("INSERT OR IGNORE INTO idempotency_keys (idempotency_key, request_fingerprint, request_id, created_at) VALUES (?1, ?2, ?3, ?4)")
        .bind(idempotency.key, idempotency.requestFingerprint, idempotency.requestId, idempotency.createdAt)
    ]);
    return result[1]?.meta?.changes === 1 && result[0]?.meta?.changes === 1;
  }

  async update(transaction: KycTransaction): Promise<void> {
    const result = await this.db.prepare("UPDATE kyc_transactions SET status = ?1, provider_reference = ?2, updated_at = ?3 WHERE request_id = ?4")
      .bind(transaction.status, transaction.providerReference ?? null, transaction.updatedAt, transaction.requestId).run();
    if (result.meta.changes !== 1) throw new Error("Transaction does not exist");
  }
}
