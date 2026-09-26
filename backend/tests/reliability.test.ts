import { describe, expect, it } from "vitest";
import { CircuitBreaker } from "../src/reliability/circuit-breaker";
import { retryDelay } from "../src/reliability/retry";
describe("reliability primitives", () => {
  it("opens a circuit after repeated failures", () => {
    const c = new CircuitBreaker(2, 1000);
    c.recordFailure(100); c.recordFailure(200);
    expect(c.getState()).toBe("open");
    expect(c.canExecute(500)).toBe(false);
    expect(c.canExecute(1201)).toBe(true);
  });
  it("bounds exponential retry delay", () => {
    const d = retryDelay(20, { maxAttempts: 5, baseDelayMs: 100, maxDelayMs: 1000 });
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThanOrEqual(1000);
  });
});
