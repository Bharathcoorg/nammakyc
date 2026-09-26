# Observability and alerting

Namma KYC keeps operational telemetry separate from citizen data. Metrics and audit events must use opaque request/job references and must never contain Aadhaar numbers, OTPs, biometrics, raw provider payloads, access tokens, or ration-card/member identifiers.

## Metric groups

The reference metrics boundary covers:

- HTTP request volume and errors
- KYC creation, success and failure
- queue retries and invalid messages
- provider timeouts and failures

A deployment may map these events to Cloudflare analytics, an external metrics backend, or another approved telemetry platform without changing the application workflow.

## Correlation

Use the request identifier to correlate an HTTP request with its KYC transaction. Queue processing additionally exposes an opaque job identifier. Correlation values are operational identifiers, not citizen identity attributes.

## Recommended production alerts

Operators should define thresholds after load testing for:

- sustained HTTP 5xx increase;
- unusual 4xx or rate-limit bursts;
- queue backlog or increasing oldest-message age;
- dead-letter queue growth;
- provider timeout/error spikes;
- circuit-breaker openings;
- D1 failures or latency degradation;
- unexpected cleanup volume.

Thresholds are deployment-specific and must be tuned using observed baseline traffic.

## Logging rules

Structured logs may contain event name, timestamp, status, safe error code, opaque request/job reference, provider category, and duration. Do not log request bodies, Aadhaar/PID data, OTPs, biometric payloads, authentication secrets, access tokens, or raw upstream responses.

## Availability and recovery

Telemetry should remain available during provider outages and queue backlog incidents. Alerting must not depend on the same failing downstream provider whose health is being diagnosed.
