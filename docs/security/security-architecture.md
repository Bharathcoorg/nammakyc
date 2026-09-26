# Security architecture

Namma KYC is an independent open-source reference implementation. It is not an authorized UIDAI or Government of Karnataka integration.

## Data boundaries

The client submits only the minimum references required by the reference API. Aadhaar biometrics, OTP values and PID data must remain inside the authorized authentication boundary and must not be persisted by Namma KYC.

Provider interfaces isolate PDS, Aadhaar authentication and KYC submission. Production adapters must use documented, authorized APIs and credentials.

## Request protections

- JSON-only mutation bodies.
- Bounded request body size.
- Correlation IDs are normalized before being returned.
- Responses are marked no-store.
- Idempotency keys prevent accidental duplicate mutation.
- Household membership is checked before transaction creation.
- Provider calls have timeout, retry and circuit-breaker controls.
- Retries are limited to transient upstream failures.

## Production controls still required

Before production deployment, configure distributed WAF/rate limiting, authenticated service-to-service access, managed secrets and keys, audit logging, alerting, dependency/SBOM scanning, penetration testing, disaster recovery and authorized government integration controls.

Do not treat the mock providers as production security controls.
