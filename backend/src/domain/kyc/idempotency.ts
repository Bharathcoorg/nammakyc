export interface IdempotencyRecord {
  key: string;
  requestFingerprint: string;
  requestId: string;
  createdAt: string;
}

export function sameRequest(
  existing: IdempotencyRecord,
  requestFingerprint: string
): boolean {
  return existing.requestFingerprint === requestFingerprint;
}
