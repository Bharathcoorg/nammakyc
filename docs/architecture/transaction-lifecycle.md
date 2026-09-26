# Transaction lifecycle

A KYC request is represented as a stateful transaction.

`received -> validating -> authenticating -> processing -> success`

Recoverable upstream failures enter `retrying` and may return to authentication or processing. Permanent failures enter `failed`.

State transitions are explicit and validated by the domain layer. Terminal states cannot be silently moved backwards.

Each externally initiated transaction should carry an idempotency key. A repeated key with the same request fingerprint represents the same operation; the same key with a different fingerprint must be rejected.

The production persistence implementation must enforce uniqueness atomically. An in-memory implementation is not sufficient for production.
