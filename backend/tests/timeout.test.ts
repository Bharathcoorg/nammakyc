import { describe, expect, it } from "vitest";
import { TimeoutError, withTimeout } from "../src/reliability/timeout";

describe("withTimeout", () => {
  it("aborts the provider operation when the deadline expires", async () => {
    let aborted = false;
    await expect(withTimeout(
      signal => new Promise<never>((_, reject) => {
        signal.addEventListener("abort", () => {
          aborted = true;
          reject(new Error("aborted"));
        });
      }),
      5
    )).rejects.toBeInstanceOf(TimeoutError);
    expect(aborted).toBe(true);
  });
});
