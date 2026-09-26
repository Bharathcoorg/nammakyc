import { describe, expect, it } from "vitest";
import { requestId, applySecurityHeaders } from "../src/security/headers";
import { validateRequest } from "../src/security/request";

describe("request security", () => {
  it("rejects non-json mutation bodies", () => {
    expect(() => validateRequest(new Request("https://x", { method: "POST", headers: { "content-type": "text/plain" } }))).toThrow();
  });
  it("accepts json mutation bodies", async () => {
    await expect(validateRequest(new Request("https://x", { method: "POST", headers: { "content-type": "application/json" } }))).resolves.toBeUndefined();
  });
  it("rejects streamed bodies above the limit", async () => {
    const body = "x".repeat(16 * 1024 + 1);
    await expect(validateRequest(new Request("https://x", { method: "POST", headers: { "content-type": "application/json" }, body }))).rejects.toThrow("Request body too large");
  });
  it("normalizes unsafe correlation ids", () => {
    expect(requestId(new Request("https://x", { headers: { "X-Request-Id": "bad value" } }))).not.toBe("bad value");
  });
  it("adds security headers", () => {
    const response = applySecurityHeaders(new Response("ok"), "req-1");
    expect(response.headers.get("X-Request-Id")).toBe("req-1");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
