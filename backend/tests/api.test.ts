import { describe, expect, it } from "vitest";
import { route } from "../src/routes/router";

describe("HTTP API", () => {
  it("serves health", async () => {
    const response = await route(new Request("https://example.test/health"));
    expect(response?.status).toBe(200);
  });

  it("looks up a synthetic household", async () => {
    const response = await route(new Request("https://example.test/v1/households/RC-001"));
    expect(response?.status).toBe(200);
    expect(await response?.json()).toMatchObject({ householdReference: "demo-RC-001" });
  });

  it("starts a KYC transaction", async () => {
    const response = await route(new Request("https://example.test/v1/kyc", {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": "idem-12345678901234" },
      body: JSON.stringify({ memberReference: "member-01", consentReference: "consent-01" })
    }));
    expect(response?.status).toBe(202);
    const body = await response?.json() as { requestId: string; status: string };
    expect(body.requestId).toBeTruthy();
    expect(body.status).toBe("success");
  });

  it("requires an idempotency key", async () => {
    const response = await route(new Request("https://example.test/v1/kyc", {
      method: "POST", body: JSON.stringify({ memberReference: "member-01", consentReference: "consent-01" })
    }));
    expect(response?.status).toBe(400);
  });

  it("rejects reuse of an idempotency key for different data", async () => {
    const key = "idem-conflict-123456";
    const first = await route(new Request("https://example.test/v1/kyc", {
      method: "POST", headers: { "Idempotency-Key": key },
      body: JSON.stringify({ memberReference: "member-01", consentReference: "consent-a" })
    }));
    expect(first?.status).toBe(202);
    const second = await route(new Request("https://example.test/v1/kyc", {
      method: "POST", headers: { "Idempotency-Key": key },
      body: JSON.stringify({ memberReference: "member-01", consentReference: "consent-b" })
    }));
    expect(second?.status).toBe(409);
  });

  it("returns transaction status", async () => {
    const created = await route(new Request("https://example.test/v1/kyc", {
      method: "POST", headers: { "Idempotency-Key": "idem-status-123456" },
      body: JSON.stringify({ memberReference: "member-01", consentReference: "consent-status" })
    }));
    const body = await created?.json() as { requestId: string };
    const status = await route(new Request("https://example.test/v1/kyc/" + body.requestId));
    expect(status?.status).toBe(200);
    expect(await status?.json()).toMatchObject({ requestId: body.requestId, status: "success" });
  });
});
