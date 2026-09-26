# Transaction lifecycle

A KYC request is represented as a stateful transaction with a distinct Aadhaar authentication boundary and a separate PDS e-KYC boundary.

`received -> validating -> aadhaar_pending -> aadhaar_authenticating -> aadhaar_authenticated -> pds_processing -> success`

Recoverable upstream failures enter `retrying`. A retry resumes the unfinished provider stage: an accepted Aadhaar authentication is represented by `aadhaarAuthenticationReference`, so a PDS retry does not silently repeat Aadhaar authentication. Permanent failures enter `failed`.

The transaction stores provider-specific references separately:

- `aadhaarSessionReference` — provider session/handoff reference.
- `aadhaarAuthenticationReference` — accepted Aadhaar authentication reference.
- `pdsTransactionReference` — PDS e-KYC transaction/reference.

The reference implementation never stores Aadhaar PID, biometric images/templates, OTP values, or raw authentication payloads.

State transitions are explicit and validated by the domain layer. Terminal states cannot be silently moved backwards.

Each externally initiated transaction carries an idempotency key. A repeated key with the same request fingerprint represents the same operation; the same key with a different fingerprint is rejected.

## Processing ownership

Before a worker invokes an external verification provider, the persistence layer atomically assigns a random processing claim identifier and a lease timestamp. A fresh claim prevents another delivery from entering the same transaction concurrently.

If a worker becomes stale, a later worker may take over with a new claim. All provider-result state changes from the previous worker are fenced by the previous claim identifier, so a stale worker cannot overwrite the newer owner's state. The claim is renewed between provider stages and cleared when the transaction reaches a terminal or retrying state.

This is database-level conditional concurrency control rather than an application-only read/modify/write check. D1 reports the number of rows changed by conditional updates, allowing the repository to detect when ownership was lost.
