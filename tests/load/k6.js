import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    kyc_create: {
      executor: "constant-arrival-rate",
      rate: Number(__ENV.RPS || 5),
      timeUnit: "1s",
      duration: __ENV.DURATION || "30s",
      preAllocatedVUs: Number(__ENV.VUS || 10),
      maxVUs: Number(__ENV.MAX_VUS || 100)
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<2000"]
  }
};

export default function () {
  const base = __ENV.BASE_URL;
  if (!base) throw new Error("BASE_URL is required");
  const id = `load-${__VU}-${__ITER}-${Date.now()}`;
  const response = http.post(
    `${base}/v1/kyc`,
    JSON.stringify({
      householdReference: __ENV.HOUSEHOLD_REFERENCE || "demo-RC-123",
      memberReference: __ENV.MEMBER_REFERENCE || "member-01",
      consentReference: `consent-${id}`,
      consentPolicyVersion: "load-test",
      consentLanguage: "en"
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": id
      },
      tags: { scenario: "kyc-create" }
    }
  );

  check(response, {
    "accepted": r => r.status === 202,
    "has request id": r => {
      try { return Boolean(r.json("requestId")); } catch { return false; }
    }
  });

  sleep(1);
}
