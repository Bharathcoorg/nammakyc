# Load and failure testing plan

These are test targets, not capacity claims.

## Scenarios

Run controlled tests at progressively larger synthetic populations: 100, 10,000, 100,000, 1,000,000 and 10,000,000 users.

The test harness must use synthetic references and mock/sandbox providers. No real Aadhaar, biometric or production citizen data belongs in load tests.

## Measure

Capture request rate, p50/p95/p99 latency, HTTP error rate, validation failures, idempotency replay/conflict rate, queue depth and oldest message age, upstream timeout/retry counts, circuit-breaker openings, D1 latency/error rate, resource pressure, and recovery time after an upstream outage.

## Failure cases

Exercise PDS timeout, Aadhaar provider timeout, KYC provider timeout, provider 5xx bursts, duplicate queue delivery, duplicate HTTP requests, conflicting idempotency key reuse, database transient failure, worker restart during processing, queue backlog, dead-letter growth, and partial service degradation.

Acceptance thresholds must be agreed with the eventual operating authority and measured in the deployed environment. The repository must not claim that a user count is supported until the corresponding test evidence exists.