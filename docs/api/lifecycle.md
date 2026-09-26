# API lifecycle

The reference API exposes the synthetic transaction path:

1. Look up a ration-card household.
2. Start KYC with an `Idempotency-Key` header.
3. Validate the selected member.
4. Move through the explicit transaction lifecycle.
5. Invoke provider adapters.
6. Store the resulting synthetic status.
7. Query by request ID.

The current repository uses an in-memory repository and mock providers. Production integration must replace these with authorized government integrations and durable persistence.

## Idempotency

The idempotency key is transport metadata and is supplied through the `Idempotency-Key` header only. Reusing a key with the same request fingerprint returns the original transaction. Reusing it with a different fingerprint returns HTTP 409.

Production persistence must enforce key uniqueness atomically; the in-memory implementation exists only for reference/testing.
