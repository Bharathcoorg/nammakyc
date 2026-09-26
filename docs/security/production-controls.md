# Production security controls

This repository is an independent open-source reference implementation. The controls below are a production handover checklist, not a statement that every control is currently deployed.

## Edge

- WAF rules for public API traffic
- rate limits for sensitive operations
- request size limits
- abuse controls appropriate to the citizen journey
- TLS with modern protocol configuration
- no caching of citizen responses

## Application

- strict schema validation and bounded strings
- production authorization policy
- authenticated service-to-service provider calls
- least-privilege credentials
- idempotency and replay protection
- timeout, retry and circuit-breaker policies
- explicit upstream failure classification
- generic external errors; detailed diagnostics only in protected telemetry

The reference runtime fails closed in production when the authorization policy, D1 database, or approved downstream provider adapters are absent.

The authorization boundary is provider-neutral. The adopting authority must supply the approved citizen/API identity, delegation, network, and access-control mechanism. Namma KYC does not invent government credentials or use Aadhaar authentication as a generic API authorization mechanism.

## Sensitive-data boundary

The reference app does not store Aadhaar biometrics or OTPs. Production integrations must follow the requirements of the authorized Aadhaar and Karnataka PDS integration, including consent, credential handling, retention and audit obligations.

Never log Aadhaar numbers, biometric/PID data, OTP values, authentication secrets, access tokens, or raw government payloads containing sensitive citizen data. Use opaque transaction/request references in logs.

## Operations

Before production handover: independent security assessment, dependency and SBOM scanning, secret scanning, threat-model review, load/failure testing, disaster-recovery exercise, incident-response exercise, operational access review, audit-log review, and a documented data-retention/deletion policy.

Any production control must be verified against the actual deployment rather than inferred from repository configuration.
