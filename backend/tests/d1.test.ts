import { describe, expect, it } from "vitest";
import { D1TransactionRepository } from "../src/repositories/d1";
import type { KycTransaction } from "../src/domain/kyc/transaction";
import type { IdempotencyRecord } from "../src/domain/kyc/idempotency";
import type { ConsentArtifact } from "../src/domain/kyc/consent";

class FakeD1 {
  transactions = new Map<string, Record<string, unknown>>();
  idempotency = new Map<string, Record<string, unknown>>();

  prepare(query: string) {
    const self = this;
    let values: unknown[] = [];
    const statement = {
      query,
      get values() { return values; },
      bind(...next: unknown[]) {
        values = next;
        return statement;
      },
      async first() {
        if (query.includes("FROM kyc_transactions")) return self.transactions.get(String(values[0]));
        if (query.includes("FROM idempotency_keys")) return self.idempotency.get(String(values[0]));
        return undefined;
      },
      async run() {
        return { meta: { changes: 1 } };
      }
    };
    return statement;
  }

  async batch(statements: Array<{ query?: string; _values?: unknown[] }>) {
    // The repository passes bound D1 statements. This fake records their SQL
    // and values through the helper below so the atomic behavior is testable.
    const txSnapshot = new Map(this.transactions);
    const idemSnapshot = new Map(this.idempotency);
    try {
      for (const statement of statements) {
        const query = (statement as any).query ?? "";
        const values = (statement as any).values ?? [];
        if (query.includes("INSERT INTO kyc_transactions")) {
          const key = String(values[0]);
          if (this.transactions.has(key)) throw new Error("UNIQUE constraint failed");
          this.transactions.set(key, {
            request_id:key,
            household_reference:values[1],
            member_reference:values[2],
            status:values[3],
            created_at:values[4],
            updated_at:values[5],
            provider_reference:values[6]
          });
        } else if (query.includes("INSERT INTO idempotency_keys")) {
          const key = String(values[0]);
          if (this.idempotency.has(key)) throw new Error("UNIQUE constraint failed");
          this.idempotency.set(key, {
            idempotency_key:key,
            request_fingerprint:values[1],
            request_id:values[2],
            created_at:values[3]
          });
        }
      }
      return statements.map(() => ({ meta:{ changes:1 } }));
    } catch (error) {
      this.transactions = txSnapshot;
      this.idempotency = idemSnapshot;
      throw error;
    }
  }
}

function transaction(requestId = "request-0000000001"): KycTransaction {
  return {
    requestId,
    householdReference:"RC-1",
    memberReference:"M-1",
    status:"validating",
    createdAt:"2026-09-26T12:00:00.000Z",
    updatedAt:"2026-09-26T12:00:00.000Z"
  };
}

function consent(requestId: string, reference = "consent-1"): ConsentArtifact {
  return {
    consentReference:reference,
    purpose:"ration-card-e-kyc",
    policyVersion:"2026-09",
    language:"en",
    capturedAt:"2026-09-26T12:00:00.000Z",
    transactionReference:requestId
  };
}

function record(requestId: string, key = "idempotency-key-12345"): IdempotencyRecord {
  return {
    key,
    requestFingerprint:"fingerprint",
    requestId,
    createdAt:"2026-09-26T12:00:00.000Z"
  };
}

describe("D1TransactionRepository", () => {
  it("creates transaction and idempotency record together", async () => {
    const db = new FakeD1();
    const repository = new D1TransactionRepository(db);
    const tx = transaction();
    expect(await repository.createIfAbsent(tx, record(tx.requestId), consent(tx.requestId))).toBe(true);
    expect(await repository.get(tx.requestId)).toBeDefined();
    expect(await repository.getIdempotency("idempotency-key-12345")).toBeDefined();
  });

  it("does not leave a transaction behind when the idempotency insert conflicts", async () => {
    const db = new FakeD1();
    const repository = new D1TransactionRepository(db);
    const existing = transaction("request-existing");
    await repository.createIfAbsent(existing, record(existing.requestId), consent(existing.requestId));
    const conflicting = transaction("request-new");
    expect(await repository.createIfAbsent(conflicting, record(conflicting.requestId), consent(conflicting.requestId))).toBe(false);
    expect(await repository.get(conflicting.requestId)).toBeUndefined();
    expect((await repository.getIdempotency("idempotency-key-12345"))?.requestId).toBe("request-existing");
  });
});
