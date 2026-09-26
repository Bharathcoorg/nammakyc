# Transaction lifecycle

A KYC request is represented as a stateful transaction.

`received -> validating -> authenticating -> processing -> success`

Recoverable upstream failures enter `retrying` and may return to authentication or processing. Permanent failures enter `failed`.

State transitions are explicit and validated by the domain layer. Terminal states cannot be silently moved backwards.

Each externally initiated transaction should carry an idempotency key. A repeated key with the same request fingerprint represents the same operation; the same key with a different fingerprint must be rejected.

The production persistence implementation must enforce uniqueness atomically. An in-memory implementation is not sufficient for production.

## Processing ownership

Before a worker invokes an external verification provider, the persistence layer atomically assigns a random processing claim identifier and a lease timestamp. A fresh claim prevents another delivery from entering the same transaction concurrently.

If a worker becomes stale, a later worker may take over with a new claim. All provider-result state changes from the previous worker are fenced by the previous claim identifier, so a stale worker cannot overwrite the newer owner's state. The claim is renewed between provider stages and cleared when the transaction reaches a terminal or retrying state.

This is database-level conditional concurrency control rather than an application-only read/modify/write check. D1 reports the number of rows changed by conditional updates, allowing the repository to detect when ownership was lost.
