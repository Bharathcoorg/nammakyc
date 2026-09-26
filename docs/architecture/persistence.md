# Durable persistence boundary

The first production persistence target is Cloudflare D1, behind the existing `TransactionRepository` interface.

The schema deliberately separates transaction state from idempotency metadata. The idempotency key is unique and points to exactly one transaction. A production implementation must perform transaction creation and idempotency-key reservation atomically so concurrent retries cannot create two transactions.

## Security constraints

- Do not store Aadhaar numbers, biometric templates, FaceRD payloads, OTP values, or raw authentication payloads in these tables.
- Store only the minimum provider reference needed to correlate an authorized downstream transaction.
- Keep timestamps in UTC ISO-8601 form.
- Treat provider references as opaque identifiers.
- Apply retention/deletion rules appropriate to the final government integration and applicable law before production deployment.

The current Worker still uses the in-memory repository. This migration is a persistence design artifact until the D1 adapter and binding are implemented and tested.
