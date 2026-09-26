# Asynchronous processing boundary

Namma KYC is designed so a production deployment can move slow or state-changing downstream work behind a queue without changing the citizen-facing contract.

## Request path

1. Validate the request and consent reference.
2. Resolve the household and selected member.
3. Create the transaction and idempotency record atomically.
4. Return a request reference to the mobile client.
5. Perform authorized downstream work asynchronously where the integration requires it.
6. Persist state transitions and expose status through `GET /v1/kyc/:requestId`.

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

## Cloudflare boundary

Cloudflare Queues can be one deployment implementation, but the domain/service layer should remain provider-neutral. The public reference implementation must not require a Cloudflare-specific queue API to understand transaction state.

## Implementation boundary

The backend now exposes a provider-neutral `KycJobQueue` contract with an in-memory implementation for local tests. The production adapter can map this contract to Cloudflare Queues or another approved queue without coupling domain code to a vendor API.

The transaction idempotency record remains the source of truth for duplicate suppression. Queue delivery is therefore allowed to be at-least-once; a repeated job must not create a second KYC transaction.
