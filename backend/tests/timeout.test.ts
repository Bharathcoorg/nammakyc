import { describe, expect, it } from "vitest";
import { CircuitBreaker } from "../src/reliability/circuit-breaker";
import { TimeoutError, withTimeout } from "../src/reliability/timeout";

describe("withTimeout", () => {
  it("aborts a pending operation when the deadline expires", async () => {
    let aborted=false;
    await expect(withTimeout(async signal => {
      signal.addEventListener("abort",()=>{aborted=true});
      await new Promise(resolve=>setTimeout(resolve,50));
      return "late";
    },5)).rejects.toBeInstanceOf(TimeoutError);
    expect(aborted).toBe(true);
  });
});

describe("CircuitBreaker", () => {
  it("allows only one probe when an open circuit enters half-open state", () => {
    const breaker=new CircuitBreaker(1,100);
    breaker.recordFailure(1000);
    expect(breaker.canExecute(1000)).toBe(false);
    expect(breaker.canExecute(1101)).toBe(true);
    expect(breaker.canExecute(1101)).toBe(false);
    breaker.recordSuccess();
    expect(breaker.canExecute(1101)).toBe(true);
  });

  it("reopens after a failed half-open probe", () => {
    const breaker=new CircuitBreaker(1,100);
    breaker.recordFailure(1000);
    expect(breaker.canExecute(1101)).toBe(true);
    breaker.recordFailure(1101);
    expect(breaker.canExecute(1101)).toBe(false);
    expect(breaker.canExecute(1201)).toBe(true);
  });
});
