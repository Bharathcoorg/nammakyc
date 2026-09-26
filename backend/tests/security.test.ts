import { describe, expect, it } from "vitest";
import { requestId } from "../src/security/headers";
import { canonicalFingerprint } from "../src/security/idempotency";
describe("security primitives", () => {
  it("does not accept arbitrary request ids", () => {
    const r = requestId(new Request("https://example.test", { headers: { "X-Request-Id": "<script>" } }));
    expect(r).not.toBe("<script>");
  });
  it("canonicalizes fingerprint field order", () => {
    expect(canonicalFingerprint({ b: "two", a: "one" })).toBe(canonicalFingerprint({ a: "one", b: "two" }));
  });
});
