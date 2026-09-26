# Durable persistence boundary

D1 is the production persistence target behind the `TransactionRepository` abstraction.

The adapter keeps citizen data minimal: transaction state, opaque provider reference, timestamps, and idempotency metadata. Aadhaar numbers, biometric templates, FaceRD payloads, OTP values, credentials, and raw authentication payloads are not persisted.

Idempotency reservation must be treated as a uniqueness boundary. The repository therefore uses database uniqueness constraints and performs transaction/idempotency inserts as one D1 batch.

The Worker currently selects D1 when the `DB` binding is present and falls back to an in-memory repository for local/reference execution.
