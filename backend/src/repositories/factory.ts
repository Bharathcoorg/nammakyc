import type { D1Database } from "@cloudflare/workers-types";
import type { TransactionRepository } from "./transaction";
import { D1TransactionRepository } from "./d1";
import { InMemoryTransactionRepository } from "./transaction";

export function createTransactionRepository(db?: D1Database): TransactionRepository {
  return db ? new D1TransactionRepository(db) : new InMemoryTransactionRepository();
}
