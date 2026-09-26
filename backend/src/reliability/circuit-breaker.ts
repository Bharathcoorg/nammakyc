export type CircuitState = "closed" | "open" | "half-open";
export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failures = 0;
  private openedAt = 0;
  constructor(private readonly failureThreshold = 5, private readonly resetTimeoutMs = 30_000) {}
  getState(): CircuitState { return this.state; }
  canExecute(now = Date.now()): boolean {
    if (this.state === "closed") return true;
    if (this.state === "open" && now - this.openedAt >= this.resetTimeoutMs) { this.state = "half-open"; return true; }
    return this.state === "half-open" ? true : false;
  }
  recordSuccess(): void { this.failures = 0; this.state = "closed"; }
  recordFailure(now = Date.now()): void {
    this.failures++;
    if (this.failures >= this.failureThreshold) { this.state = "open"; this.openedAt = now; }
  }
}
