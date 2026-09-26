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
