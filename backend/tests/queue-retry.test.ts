import { describe, expect, it } from "vitest";
import { queueRetryDelaySeconds } from "../src/queues/retry";

describe("queue retry delay", () => {
  it("keeps retry delays bounded and positive", () => {
    for(let attempt=0;attempt<20;attempt++){
      expect(queueRetryDelaySeconds(attempt,0)).toBeGreaterThanOrEqual(1);
      expect(queueRetryDelaySeconds(attempt,1)).toBeLessThanOrEqual(60);
    }
  });

  it("increases the jittered window as attempts grow", () => {
    expect(queueRetryDelaySeconds(0,0)).toBe(1);
    expect(queueRetryDelaySeconds(1,1)).toBe(3);
    expect(queueRetryDelaySeconds(5,1)).toBe(48);
  });
});
