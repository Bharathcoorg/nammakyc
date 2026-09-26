import { describe, expect, it } from "vitest";
import { D1TransactionRepository } from "../src/repositories/d1";
import type { KycTransaction } from "../src/domain/kyc/transaction";
import type { IdempotencyRecord } from "../src/domain/kyc/idempotency";
import type { ConsentArtifact } from "../src/domain/kyc/consent";

class FakeD1 {
  transactions = new Map<string, Record<string, unknown>>();
  idempotency = new Map<string, Record<string, unknown>>();
  consent = new Map<string, Record<string, unknown>>();

  prepare(query: string) {
    const self = this;
    let values: unknown[] = [];
    const statement = {
      query,
      get values() { return values; },
      bind(...next: unknown[]) { values = next; return statement; },
      async first() {
        if (query.includes("FROM kyc_transactions")) return self.transactions.get(String(values[0]));
        if (query.includes("FROM idempotency_keys")) return self.idempotency.get(String(values[0]));
        return undefined;
      },
      async run() {
        if (query.includes("UPDATE kyc_transactions SET status='authenticating'")) {
          const key = String(values[1]);
          const row = self.transactions.get(key);
          const staleBefore = String(values[2]);
          const claimable = row && (
            row.status === "validating" ||
            row.status === "retrying" ||
            ((row.status === "authenticating" || row.status === "processing") && String(row.updated_at) < staleBefore)
          );
          if (!claimable) return { meta: { changes: 0 } };
          row.status = "authenticating";
          row.updated_at = values[0];
          return { meta: { changes: 1 } };
        }
        if (query.includes("DELETE FROM idempotency_keys")) {
          const cutoff = String(values[0]);
          let changes = 0;
          for (const [key, row] of self.idempotency) {
            if (String(row.created_at) < cutoff) { self.idempotency.delete(key); changes++; }
          }
          return { meta: { changes } };
        }
        return { meta: { changes: 1 } };
      }
    };
    return statement;
  }

  async batch(statements: Array<{ query?: string; values?: unknown[] }>) {
    const txSnapshot = new Map(this.transactions);
    const idemSnapshot = new Map(this.idempotency);
    const consentSnapshot = new Map(this.consent);
    try {
      for (const statement of statements) {
        const query = (statement as any).query ?? "";
        const values = (statement as any).values ?? [];
        if (query.includes("INSERT INTO kyc_transactions")) {
          const key = String(values[0]);
          if (this.transactions.has(key)) throw new Error("UNIQUE constraint failed");
          this.transactions.set(key, { request_id:key, household_reference:values[1], member_reference:values[2], status:values[3], created_at:values[4], updated_at:values[5], provider_reference:values[6] });
        } else if (query.includes("INSERT INTO idempotency_keys")) {
          const key = String(values[0]);
          if (this.idempotency.has(key)) throw new Error("UNIQUE constraint failed");
          this.idempotency.set(key, { idempotency_key:key, request_fingerprint:values[1], request_id:values[2], created_at:values[3] });
        } else if (query.includes("INSERT INTO consent_artifacts")) {
          const key = String(values[0]);
          if (this.consent.has(key)) throw new Error("UNIQUE constraint failed");
          this.consent.set(key, { consent_reference:key, purpose:values[1], policy_version:values[2], language:values[3], captured_at:values[4], transaction_reference:values[5] });
        }
      }
      return statements.map(() => ({ meta:{ changes:1 } }));
    } catch (error) {
      this.transactions = txSnapshot;
      this.idempotency = idemSnapshot;
      this.consent = consentSnapshot;
      throw error;
    }
  }
}

function transaction(requestId = "request-0000000001"): KycTransaction {
  return { requestId, householdReference:"RC-1", memberReference:"M-1", status:"validating", createdAt:"2026-09-26T12:00:00.000Z", updatedAt:"2026-09-26T12:00:00.000Z" };
}
function consent(requestId: string, reference = "consent-1"): ConsentArtifact {
  return { consentReference:reference, purpose:"ration-card-e-kyc", policyVersion:"2026-09", language:"en", capturedAt:"2026-09-26T12:00:00.000Z", transactionReference:requestId };
}
function record(requestId: string, key = "idempotency-key-12345"): IdempotencyRecord {
  return { key, requestFingerprint:"fingerprint", requestId, createdAt:"2026-09-26T12:00:00.000Z" };
}

describe("D1TransactionRepository", () => {
  it("creates transaction, idempotency, and consent atomically", async () => {
    const db = new FakeD1(); const repository = new D1TransactionRepository(db); const tx = transaction();
    expect(await repository.createIfAbsent(tx, record(tx.requestId), consent(tx.requestId))).toBe(true);
    expect(await repository.get(tx.requestId)).toBeDefined();
    expect(await repository.getIdempotency("idempotency-key-12345")).toBeDefined();
    expect(db.consent.get("consent-1")?.transaction_reference).toBe(tx.requestId);
  });

  it("does not leave a transaction behind when the idempotency insert conflicts", async () => {
    const db = new FakeD1(); const repository = new D1TransactionRepository(db); const existing = transaction("request-existing");
    await repository.createIfAbsent(existing, record(existing.requestId), consent(existing.requestId));
    const conflicting = transaction("request-new");
    expect(await repository.createIfAbsent(conflicting, record(conflicting.requestId), consent(conflicting.requestId))).toBe(false);
    expect(await repository.get(conflicting.requestId)).toBeUndefined();
    expect((await repository.getIdempotency("idempotency-key-12345"))?.requestId).toBe("request-existing");
  });

  it("purges only idempotency records older than the supplied cutoff", async () => {
    const db = new FakeD1(); const repository = new D1TransactionRepository(db);
    const oldTx = transaction("request-old"); const oldRecord = record(oldTx.requestId, "idempotency-old-12345"); oldRecord.createdAt = "2026-09-01T00:00:00.000Z";
    await repository.createIfAbsent(oldTx, oldRecord, consent(oldTx.requestId, "consent-old"));
    const newTx = transaction("request-new"); const newRecord = record(newTx.requestId, "idempotency-new-12345"); newRecord.createdAt = "2026-09-25T00:00:00.000Z";
    await repository.createIfAbsent(newTx, newRecord, consent(newTx.requestId, "consent-new"));
    expect(await repository.purgeIdempotencyBefore("2026-09-20T00:00:00.000Z")).toBe(1);
    expect(await repository.getIdempotency("idempotency-old-12345")).toBeUndefined();
    expect(await repository.getIdempotency("idempotency-new-12345")).toBeDefined();
  });

  it("rolls back all writes when the consent reference conflicts", async () => {
    const db = new FakeD1(); const repository = new D1TransactionRepository(db); const existing = transaction("request-existing");
    await repository.createIfAbsent(existing, record(existing.requestId), consent(existing.requestId, "consent-shared"));
    const conflicting = transaction("request-new");
    expect(await repository.createIfAbsent(conflicting, record(conflicting.requestId, "idempotency-new-12345"), consent(conflicting.requestId, "consent-shared"))).toBe(false);
    expect(await repository.get(conflicting.requestId)).toBeUndefined();
    expect(await repository.getIdempotency("idempotency-new-12345")).toBeUndefined();
  });

  it("atomically rejects a second processing claim while the first claim is fresh", async () => {
    const db = new FakeD1(); const repository = new D1TransactionRepository(db); const tx = transaction();
    await repository.createIfAbsent(tx, record(tx.requestId), consent(tx.requestId));
    expect(await repository.claimForProcessing(tx.requestId, "2026-09-26T12:00:01.000Z", "2026-09-26T11:59:31.000Z")).toBe(true);
    expect(await repository.claimForProcessing(tx.requestId, "2026-09-26T12:00:02.000Z", "2026-09-26T11:59:32.000Z")).toBe(false);
    expect((await repository.get(tx.requestId))?.status).toBe("authenticating");
  });
});
