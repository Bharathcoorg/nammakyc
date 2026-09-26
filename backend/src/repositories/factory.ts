import { D1TransactionRepository, type D1DatabaseLike } from "./d1";
import { InMemoryTransactionRepository, type TransactionRepository } from "./transaction";
export function createTransactionRepository(db?:D1DatabaseLike):TransactionRepository{return db?new D1TransactionRepository(db):new InMemoryTransactionRepository()}
