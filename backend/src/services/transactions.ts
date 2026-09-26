import { AppError } from "../domain/errors";
import { createTransaction, transitionTransaction } from "../domain/kyc/transaction";
import { sameRequest } from "../domain/kyc/idempotency";
import type { TransactionRepository } from "../repositories/transaction";
import { getHousehold } from "./household";
import type { PdsProvider } from "../providers/pds/provider";
import type { AadhaarProvider } from "../providers/aadhaar/provider";
import type { KycProvider } from "../providers/kyc/provider";
import { submitAuthenticatedKyc } from "./kyc";

export interface StartKycInput {
  memberReference: string;
  consentReference: string;
  idempotencyKey: string;
}

export async function startKyc(repository: TransactionRepository, pds: PdsProvider, aadhaar: AadhaarProvider, kyc: KycProvider, input: StartKycInput) {
  if (!input.idempotencyKey || input.idempotencyKey.length < 16 || input.idempotencyKey.length > 128)
    throw new AppError("INVALID_REQUEST", "Invalid Idempotency-Key", 400);

  const fingerprint = JSON.stringify({ memberReference: input.memberReference.trim(), consentReference: input.consentReference.trim() });
  const existing = await repository.getByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    if (!sameRequest(existing, fingerprint))
      throw new AppError("DUPLICATE_REQUEST", "Idempotency key was already used for another request", 409);
    const transaction = await repository.getByRequestId(existing.requestId);
    if (!transaction) throw new AppError("INTERNAL_ERROR", "Transaction record is inconsistent", 500);
    return { transaction, replayed: true };
  }

  const household = await getHousehold(pds, input.memberReference);
  const member = household.members.find(item => item.memberReference === input.memberReference);
  if (!member) throw new AppError("NOT_FOUND", "Household member not found", 404);

  const now = new Date().toISOString();
  let transaction = createTransaction(crypto.randomUUID(), input.memberReference, now);
  const record = { key: input.idempotencyKey, requestFingerprint: fingerprint, requestId: transaction.requestId, createdAt: now };

  if (!(await repository.createIfAbsent(transaction, record))) {
    const concurrent = await repository.getByIdempotencyKey(input.idempotencyKey);
    if (!concurrent) throw new AppError("INTERNAL_ERROR", "Unable to establish transaction", 500);
    if (!sameRequest(concurrent, fingerprint))
      throw new AppError("DUPLICATE_REQUEST", "Idempotency key was already used for another request", 409);
    const replay = await repository.getByRequestId(concurrent.requestId);
    if (!replay) throw new AppError("INTERNAL_ERROR", "Transaction record is inconsistent", 500);
    return { transaction: replay, replayed: true };
  }

  transaction = transitionTransaction(transaction, "validating");
  await repository.update(transaction);
  try {
    transaction = transitionTransaction(transaction, "authenticating");
    await repository.update(transaction);
    const reference = await submitAuthenticatedKyc(aadhaar, kyc, transaction.requestId, input.memberReference, input.consentReference);
    transaction = transitionTransaction(transaction, "processing");
    transaction = { ...transaction, providerReference: reference, updatedAt: new Date().toISOString() };
    await repository.update(transaction);
    transaction = transitionTransaction(transaction, "success");
    await repository.update(transaction);
  } catch (error) {
    transaction = transitionTransaction(transaction, "failed");
    await repository.update(transaction);
    throw error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "KYC transaction failed", 500);
  }
  return { transaction, replayed: false };
}
