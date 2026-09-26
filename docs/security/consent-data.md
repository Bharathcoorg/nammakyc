# Consent and data minimization

Namma KYC records only the minimum consent metadata needed to bind a verification transaction to the consent policy and language used at capture time.

## Stored metadata

- opaque consent reference
- purpose: `ration-card-e-kyc`
- policy version
- language (`en` or `kn`)
- capture timestamp
- transaction reference

The reference implementation does **not** store Aadhaar numbers, biometric templates, OTP values, raw authentication payloads, or the full consent document.

## Integrity boundaries

Consent metadata is created together with the KYC transaction and idempotency record. The storage adapter uses one database batch so a conflict cannot leave only one side persisted.

The idempotency fingerprint includes the consent reference, policy version, and language. Reusing an idempotency key with different consent metadata is therefore rejected.

## Production requirements

Before any government deployment, retention periods, lawful basis, access controls, audit requirements, key management, deletion/archival procedures, and the exact authorized Aadhaar/PDS integration must be reviewed against the applicable government requirements and law.

This repository remains an independent open-source reference implementation until an authorized deployment exists.
