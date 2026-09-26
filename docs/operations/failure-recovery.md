# Failure and recovery runbook

This runbook describes reference recovery behavior. Production recovery targets, retention periods and escalation contacts must be set by the operating authority.

## Queue failure

- Inspect queue age, retry count and dead-letter volume.
- Confirm the upstream provider's availability before increasing retry volume.
- Do not manually replay a dead-letter message without checking the transaction state and provider idempotency/reference semantics.
- A duplicate delivery must remain safe because transaction state and processing claims are authoritative.

## Stale processing worker

A transaction can remain in `authenticating` or `processing` when a worker crashes after claiming it. After the lease becomes stale, a later delivery may establish a new processing claim. The old claim identifier is retained only by the stale worker and conditional updates reject its late writes.

Do not edit transaction rows manually to force progress unless the incident procedure explicitly authorizes it. First establish whether the downstream provider accepted the operation and whether a provider reference exists.

## Provider outage

1. Confirm the provider error class is transient.
2. Allow bounded retries and circuit-breaker behavior to reduce pressure.
3. Keep the transaction in `retrying` when another attempt is safe.
4. If retries are exhausted, mark the transaction `failed` and surface the reference to the citizen.
5. Do not bypass the authorized provider boundary as an emergency workaround.

## Database incident

D1 migrations are versioned and applied sequentially. Validate the migration against a non-production database before production application. Cloudflare D1 provides Time Travel point-in-time recovery on supported databases; recovery procedures must be tested and the operating authority must define the acceptable recovery point and recovery time.

## Evidence to preserve

For an incident, preserve request ID, event timestamps, status transitions, provider reference where permitted, queue attempt metadata, deployment version and relevant redacted audit events. Do not copy Aadhaar numbers, PID data, OTPs, face images or other sensitive authentication payloads into incident notes.

## Queue poison-message handling

The Cloudflare Queue consumer is configured with bounded retries and a dedicated dead-letter queue (`namma-kyc-processing-dlq`). A malformed versioned envelope is rejected rather than executed. After the configured delivery limit is exhausted, Cloudflare moves the message to the dead-letter queue according to the deployment configuration.

Operational handling should:

- alert on dead-letter queue depth greater than zero;
- preserve the original message for incident analysis under the organization's approved retention controls;
- never replay a message directly into production without validating its envelope and transaction state;
- investigate whether the failure is a producer/schema regression, corruption, or an attempted malformed submission;
- avoid logging raw citizen identifiers or authentication material while diagnosing the message;
- use the transaction reference and audit correlation data to reconcile any already-completed work before replay.

The public reference implementation does not define an automatic DLQ replay policy. Production replay authorization, retention, and access controls must be approved by the operating authority.
