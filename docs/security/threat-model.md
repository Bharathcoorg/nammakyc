# Threat model

Namma KYC is an independent open-source reference implementation for a Karnataka ration-card e-KYC journey. This model describes the reference architecture; production authorization, government integrations and deployment controls must be approved by the responsible authorities.

## Trust boundaries

1. **Citizen device** — untrusted client environment. User input, app state and client-generated identifiers can be modified.
2. **Public edge/API** — internet-facing boundary. Requests require validation, rate limiting and authorization before protected operations.
3. **Application services** — trusted orchestration layer. It validates workflow state and must not persist Aadhaar biometrics, OTPs or PID data.
4. **Queue** — untrusted-at-delivery, at-least-once transport. Messages can be duplicated, delayed or retried.
5. **D1 persistence** — authoritative transaction state. Conditional updates protect processing ownership.
6. **Government/PDS provider** — external trust boundary. Integration must use an approved interface and service credentials.
7. **Aadhaar authentication boundary** — external regulated boundary. Authentication is delegated to an authorized AUA/KUA/SUB-AUA path; this project does not implement UIDAI authentication itself.

## Primary threats and controls

| Threat | Example | Control |
| --- | --- | --- |
| Tampered request | Change household/member references | Server-side validation and authorization; never trust client state |
| IDOR/status disclosure | Read another request by changing request ID | Production authorization policy must bind the request to the authenticated subject |
| Duplicate submission | Retry POST after network timeout | Idempotency key + atomic persistence |
| Queue duplication | Same job delivered twice | Terminal-state duplicate suppression + transaction ownership claim |
| Stale worker write | Slow worker finishes after another worker takes over | Random processing claim + conditional writes + claim renewal |
| Replay | Reuse an old mutation | Authentication/authorization policy, idempotency and provider-side replay controls |
| Provider outage | PDS/Aadhaar/KYC timeout | Timeout, bounded retry, circuit breaker and asynchronous processing |
| Poison message | Malformed queue envelope | Strict envelope validation + bounded queue retries + dead-letter queue |
| Sensitive logging | Aadhaar/PID/OTP appears in logs | Provider-boundary design and redacted structured audit events |
| Supply-chain compromise | Malicious dependency or action | Dependency review, secret scanning, SBOM and protected CI/CD |
| Data retention failure | Records retained longer than approved | Explicit retention configuration and scheduled cleanup |
| Client compromise | Modified APK calls protected APIs directly | Server-side authorization; client is never the security boundary |

## Security invariants

- No biometric image, OTP or PID data is stored in Namma KYC persistence.
- Production requests cannot use mock providers.
- Production protected routes require an explicitly configured authorization policy.
- A stale worker cannot overwrite state after a newer processing claim is established.
- Queue delivery is treated as at-least-once.
- External irreversible operations require an idempotency/reference strategy at the provider boundary.

## Validation before production

Run threat-model review, abuse-case testing, authorization tests, dependency/SBOM review, static analysis, dynamic testing, load/failure testing and an independent penetration test. Production credentials and government integration details must be supplied through approved operational channels rather than committed to this repository.