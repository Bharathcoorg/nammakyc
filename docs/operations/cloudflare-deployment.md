# Cloudflare deployment boundary

The Worker is configured for:

- D1 database binding: `DB`
- queue producer: `KYC_QUEUE`
- queue consumer: `namma-kyc-processing`
- dead-letter queue: `namma-kyc-processing-dlq`

The HTTP endpoint creates and persists the transaction before enqueueing a processing job. The client receives the transaction reference and polls its status.

The queue consumer executes the downstream Aadhaar/PDS/KYC provider workflow. Delivery is treated as at-least-once. Transaction idempotency and terminal-state checks prevent a duplicate delivery from creating a second transaction.

## Required production configuration

Before deployment:

1. Replace the placeholder D1 database ID.
2. Apply all migrations.
3. Configure the queue and dead-letter queue in the target Cloudflare account.
4. Configure secrets/service credentials through the approved secret-management path.
5. Replace all mock providers with authorized government integration adapters.
6. Configure WAF/rate limiting and authenticated service boundaries.
7. Configure centralized observability with sensitive-data redaction.
8. Run failure, load, recovery, security and disaster-recovery validation.

The repository's queue configuration is an implementation reference; it does not mean a production queue or government integration is currently active.


## Data location and database integrity

D1 enforces declared foreign-key constraints by default. The schema intentionally links idempotency and consent records to their transaction rows. Production deployment should run a database integrity check as part of release validation.

Cloudflare D1 supports jurisdiction controls for some regions, but the repository does not assume that a particular jurisdiction provides India-only storage. Data-location requirements must therefore be resolved against the actual deployment configuration, legal requirements, and the operating authority before production use.


## Queue poison-message handling

The production queue consumer is configured with a maximum of three delivery attempts and a dedicated dead-letter queue (`namma-kyc-processing-dlq`).

Operational handling should follow these rules:

- A malformed envelope is rejected rather than processed as a citizen transaction.
- Retryable downstream failures are retried with bounded exponential delay and jitter.
- After the configured delivery limit, the message is acknowledged and Cloudflare Queues moves it to the configured dead-letter queue.
- Operators must investigate the dead-letter message using its opaque transaction/job reference and correlated audit/metric events.
- Operators must not replay a dead-letter message blindly. First establish whether the downstream provider operation was already accepted, whether the transaction is terminal, and whether replay is safe and idempotent.
- Dead-letter payload access must be restricted to authorized operations personnel and must follow the same sensitive-data handling rules as production queue data.
- The dead-letter queue must have retention, alerting, access-control, and replay procedures documented before production activation.

The reference implementation intentionally does not provide an operator-facing automatic replay endpoint. Any replay mechanism should be introduced only after the adopting authority approves the operational and authorization model.
