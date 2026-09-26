export interface RetryPolicy { maxAttempts: number; baseDelayMs: number; maxDelayMs: number; }
export function retryDelay(attempt: number, policy: RetryPolicy): number {
  const exp = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** Math.max(0, attempt - 1));
  return Math.floor(Math.random() * (exp + 1));
}
export async function withRetry<T>(operation: (attempt: number) => Promise<T>, policy: RetryPolicy, shouldRetry: (error: unknown) => boolean): Promise<T> {
  let last: unknown;
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try { return await operation(attempt); } catch (error) {
      last = error;
      if (attempt === policy.maxAttempts || !shouldRetry(error)) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay(attempt, policy)));
    }
  }
  throw last;
}
