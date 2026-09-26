# Asynchronous processing boundary

Namma KYC is designed so a production deployment can move slow or state-changing downstream work behind a queue without changing the citizen-facing contract.

## Request path

1. Validate the request and consent reference.
2. Resolve the household and selected member.
3. Resolve upstream household data with bounded timeout/retry protection.
4. Create the transaction and idempotency record atomically.
5. Return a request reference to the mobile client.
6. Perform authorized downstream work asynchronously where the integration requires it.
7. Persist state transitions and expose status through `GET /v1/kyc/:requestId`.

Interactive biometric capture is **not** a background job. The client must complete an authorized Aadhaar verification handoff before downstream KYC submission that depends on authentication.

## Queue requirements

Production queue consumers must provide:
- at-least-once delivery tolerance
- idempotent processing keyed by transaction/request ID
- bounded retries with exponential backoff and jitter
- transient/permanent failure classification
- dead-letter handling after retry exhaustion
- visibility/lease timeout longer than the expected processing window
- metrics for queue depth, age, retries and dead letters
- correlation using request ID without logging Aadhaar numbers, PID, biometrics or OTPs

A duplicate delivery must never create a second KYC transaction or repeat an irreversible operation when the provider supports an idempotency/reference key.

## State model

`received → validating → authenticating → processing → success`

Recoverable failures may use `retrying`. Terminal failures use `failed`.

The mobile client should poll the status endpoint rather than holding an HTTP connection while an upstream provider is slow.

## Queue envelope and worker

Queue messages use a versioned envelope:

```text
{ version: 1, job: KycJob }
```

The consumer validates the envelope and bounded job fields before processing. The `KycWorker` checks the current transaction before invoking downstream providers and acknowledges terminal duplicate deliveries without re-running the transaction.

Cloudflare delivery attempt counts are mapped into the worker's bounded retry decision. Malformed envelopes fail the batch rather than being interpreted as application work.

The transaction state remains the source of truth. Queue delivery is at-least-once, so duplicate messages are expected and must be safe.

## Cloudflare boundary

Cloudflare Queues can be one deployment implementation, but the domain/service layer remains provider-neutral. The public reference implementation does not require a Cloudflare-specific queue API to understand transaction state.

The backend exposes a provider-neutral `KycJobQueue` contract with an in-memory implementation for local tests. The Cloudflare adapter serializes the same versioned envelope used by the consumer.

Production queue workers must use approved PDS, Aadhaar and KYC provider adapters. Mock providers are restricted to non-production/reference execution.
