import { describe, expect, it } from "vitest";
import { AppError } from "../src/domain/errors";
import { route } from "../src/routes/router";
import { InMemoryKycJobQueue } from "../src/queues/kyc";
import type { MetricName, MetricsSink } from "../src/observability/metrics";

class RecordingMetrics implements MetricsSink { events:MetricName[]=[]; increment(name:MetricName):void{this.events.push(name);} }

describe("KYC API", () => {
  it("returns authorization failures from the production policy", async () => {
    const response=await route(new Request("https://api.test/v1/kyc/request-1"), {
      ENVIRONMENT:"production",
      AUTHORIZATION:{authorize:async()=>{throw new AppError("AUTHENTICATION_FAILED","Unauthorized",401)}}
    });
    expect(response?.status).toBe(401);
  });

  it("checks authorization before production database access", async () => {
    let called=false;
    const response=await route(new Request("https://api.test/v1/kyc/request-1"), {
      ENVIRONMENT:"production",
      AUTHORIZATION:{authorize:async()=>{called=true; throw new AppError("AUTHENTICATION_FAILED","Forbidden",403)}}
    });
    expect(called).toBe(true);
    expect(response?.status).toBe(403);
  });

  it("returns a household for a valid ration card reference", async () => {
    const response=await route(new Request("https://api.test/v1/households/RC-123"));
    expect(response?.status).toBe(200);
    expect((await response?.json()).householdReference).toBe("demo-RC-123");
  });

  it("starts a KYC transaction with an idempotency key", async () => {
    const response=await route(new Request("https://api.test/v1/kyc", {
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-1234567890123456"},
      body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-1"})
    }));
    expect(response?.status).toBe(202);
    const body=await response?.json() as {requestId:string;status:string};
    expect(body.requestId).toBeTruthy();
    expect(body.status).toBe("success");
    const status=await route(new Request("https://api.test/v1/kyc/"+body.requestId));
    expect(status?.status).toBe(200);
  });

  it("creates a queued transaction without running providers inline", async () => {
    const queue=new InMemoryKycJobQueue();
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-queued-12345678"},
      body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-1"})
    }),{QUEUE:queue});
    expect(response?.status).toBe(202);
    const body=await response?.json() as {requestId:string;status:string};
    expect(body.status).toBe("aadhaar_pending");
    expect(queue.drain()).toHaveLength(1);
  });


  it("accepts the combined OTP and Face authentication method", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-otp-face-123456"},
      body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-otp-face",authenticationMethod:"otp_face"})
    }));
    expect(response?.status).toBe(202);
    const body=await response?.json() as {requestId:string;status:string};
    expect(body.status).toBe("success");
  });

  it("does not expose an Aadhaar provider reference as the public KYC reference", async () => {
    const queue=new InMemoryKycJobQueue();
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-public-ref-123456"},
      body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-public-ref"})
    }),{QUEUE:queue});
    const body=await response?.json() as {requestId:string;reference?:string};
    expect(response?.status).toBe(202);
    expect(body.reference).toBeUndefined();
  });
  it("rejects missing idempotency keys", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-1"})}));
    expect(response?.status).toBe(400);
  });

  it("fails closed for production household integration without an approved provider", async () => {
    const response=await route(new Request("https://api.test/v1/households/RC-123"),{ENVIRONMENT:"production"});
    expect(response?.status).toBe(500);
  });

  it("fails closed for production KYC integration without approved providers", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-production-12345"},
      body:JSON.stringify({householdReference:"RC-123",memberReference:"M-1",consentReference:"C-1"})
    }),{ENVIRONMENT:"production"});
    expect(response?.status).toBe(500);
  });

  it("allows production status reads only with a configured database", async () => {
    const response=await route(new Request("https://api.test/v1/kyc/request-1"),{ENVIRONMENT:"production"});
    expect(response?.status).toBe(500);
  });

  it("returns 400 for malformed JSON", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-malformed-12345"},
      body:"{not-json"
    }));
    expect(response?.status).toBe(400);
    expect((await response?.json()).error.code).toBe("INVALID_REQUEST");
  });

  it("rejects empty consent policy versions when supplied", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-policy-123456"},
      body:JSON.stringify({householdReference:"demo-RC-123",memberReference:"member-01",consentReference:"consent-policy",consentPolicyVersion:""})
    }));
    expect(response?.status).toBe(400);
  });

  it("rejects non-object JSON request bodies", async () => {
    const response=await route(new Request("https://api.test/v1/kyc",{
      method:"POST",
      headers:{"Content-Type":"application/json","Idempotency-Key":"idem-array-123456"},
      body:JSON.stringify([])
    }));
    expect(response?.status).toBe(400);
  });
  it("records request and error metrics for rejected API calls", async () => {
    const metrics=new RecordingMetrics();
    const response=await route(new Request("https://api.test/v1/kyc",{method:"POST",headers:{"Content-Type":"application/json","Idempotency-Key":"short"},body:"{}"}),{METRICS:metrics});
    expect(response?.status).toBe(400);
    expect(metrics.events).toEqual(["http.requests","http.errors"]);
  });

  it("records request metrics for successful health checks", async () => {
    const metrics=new RecordingMetrics();
    const response=await route(new Request("https://api.test/health"),{METRICS:metrics});
    expect(response?.status).toBe(200);
    expect(metrics.events).toEqual(["http.requests"]);
  });

});
