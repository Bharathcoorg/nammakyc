export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message = "Upstream request timed out"): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error(message)), timeoutMs); })
    ]);
  } finally { if (timer) clearTimeout(timer); }
}
