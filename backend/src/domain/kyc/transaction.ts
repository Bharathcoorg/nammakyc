import type { KycStatus } from "./status";
import { canTransition } from "./transition";

export interface KycTransaction {
  requestId: string;
  memberReference: string;
  status: KycStatus;
  createdAt: string;
  updatedAt: string;
  providerReference?: string;
}

export function createTransaction(requestId: string, memberReference: string, now = new Date().toISOString()): KycTransaction {
  return { requestId, memberReference, status: "received", createdAt: now, updatedAt: now };
}

export function transitionTransaction(transaction: KycTransaction, nextStatus: KycStatus, now = new Date().toISOString()): KycTransaction {
  if (!canTransition(transaction.status, nextStatus)) throw new Error("Invalid KYC transition: " + transaction.status + " -> " + nextStatus);
  return { ...transaction, status: nextStatus, updatedAt: now };
}
