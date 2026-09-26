# Data boundary

The reference implementation follows data minimization.

## Never persist or emit

The repository, audit events, metrics, queue envelopes, errors, and client telemetry must never contain:

- Real Aadhaar numbers.
- Aadhaar PID blocks or raw authentication payloads.
- Face images, biometric templates, liveness payloads, or other biometric material.
- OTP values or OTP responses.
- Aadhaar/provider credentials, certificates, private keys, or authorization secrets.
- Citizen records outside the minimum provider references required to correlate an authorized transaction.

Provider references are intentionally separated into Aadhaar session/authentication references and PDS transaction references. They are identifiers, not substitutes for sensitive identity payloads.

The Android client is treated as untrusted. Backend authorization, validation, idempotency, and security controls are authoritative.

Any production identity integration must follow the applicable UIDAI, government, contractual, security, and data-protection requirements. The public reference implementation supplies interfaces and mock providers rather than production Aadhaar or PDS credentials.
