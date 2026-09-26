import { describe, expect, it } from "vitest";
import { route } from "../src/routes/router";
import { InMemoryKycJobQueue } from "../src/queues/kyc";

describe("KYC API", () => {
  it("returns a household for a valid ration card reference", async () => {
    const response = await route(new Request("https://api.test/v1/households/RC-123"));
    expect(response?.status).toBe(200);
    expect((await response?.json()).householdReference).toBe("demo-RC-123");
  });

  it("starts a KYC transaction with an idempotency key", async () => {
    const response = await route(new Request("https://api.test/v1/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": "idem-1234567890123456" },
      body: JSON.stringify({ householdReference:"demo-RC-123", memberReference:"member-01", consentReference:"consent-1" })
    }));
    expect(response?.status).toBe(202);
    const body=await response?.json() as {requestId:string;status:string};
    expect(body.requestId).toBeTruthy();
    expect(body.status).toBe("success");
    const status=await route(new Request("https://api.test/v1/kyc/"+body.requestId));
    expect(status?.status).toBe(200);
  });

  it("creates a queued transaction without running providers inline", async () => {
    const queue = new InMemoryKycJobQueue();
    const response = await route(new Request("https://api.test/v1/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": "idem-queued-12345678" },
      body: JSON.stringify({ householdReference:"demo-RC-123", memberReference:"member-01", consentReference:"consent-1" })
    }), { QUEUE: queue });
    expect(response?.status).toBe(202);
    const body=await response?.json() as {requestId:string;status:string};
    expect(body.status).toBe("validating");
    expect(queue.drain()).toHaveLength(1);
  });

  it("rejects missing idempotency keys", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-1"})}));
    expect(response?.status).toBe(400);
  });
});
