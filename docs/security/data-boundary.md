# Data boundary

The reference implementation follows data minimization.

The repository must never contain real Aadhaar numbers, biometrics, OTP values, government credentials, private keys, or citizen records.

The Android client is treated as untrusted. Backend authorization, validation, idempotency, and security controls are authoritative.

Any production identity integration must follow the applicable UIDAI, government, contractual, and data-protection requirements.
