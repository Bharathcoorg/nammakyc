# Aadhaar provider boundary

## Purpose

Namma KYC is an independent open-source reference implementation. It does not contain a production Aadhaar authentication integration, UIDAI credentials, certificates, production keys, or biometric-processing implementation.

The application owns the citizen journey up to an explicit provider hand-off. An authorized Aadhaar integration owns the actual authentication transaction.

## Reference flow

1. Namma KYC resolves the household through an authorized PDS boundary.
2. The citizen selects the household member.
3. The citizen reviews consent and privacy information.
4. Namma KYC provides fixed preparation guidance. Voice is optional; it does not capture biometric data.
5. Namma KYC creates an authentication transaction/session reference through the authorized provider boundary.
6. On Android, the authorized AUA/SUB-AUA integration may invoke Aadhaar Face RD when Face Authentication is the selected authorized method.
7. Face RD performs its own capture/liveness flow and returns the provider-controlled encrypted authentication payload/result to the authorized integration.
8. The authorized server submits the Aadhaar authentication/e-KYC request through the permitted Aadhaar ecosystem.
9. The authentication result returns to the authorized integration and then to the Namma KYC orchestration boundary.
10. Only after an accepted authentication result does the PDS e-KYC operation begin.
11. Namma KYC reports asynchronous PDS processing and a final reference.

UIDAI's current public FAQ describes Face Authentication as consent-based 1:1 verification against the Aadhaar holder's enrolled face. It also states that Face Authentication uses an entity application plus Aadhaar Face RD. UIDAI's Face Authentication playbook describes the AUA app creating a transaction key, invoking Face RD, receiving an encrypted PID block, submitting the authentication request through the AUA server, and completing pre-production testing before production approval.

## What Namma KYC must not do

- Do not implement custom face recognition.
- Do not implement custom liveness detection.
- Do not collect or permanently store face images.
- Do not collect or permanently store Aadhaar authentication PID blocks.
- Do not store Aadhaar biometric or OTP data in D1/KV/logs.
- Do not hard-code UIDAI production endpoints, certificates, license keys, secrets, or credentials.
- Do not claim that the public demo performs UIDAI verification.
- Do not treat a mock-provider success as a real identity verification.
- Do not start PDS e-KYC before an authentication result is explicitly accepted.

## Provider interface

The application should remain provider-neutral. The production adapter should be injected through the backend environment and fail closed when required production dependencies are missing.

The public reference implementation uses a mock Aadhaar provider. The mock provider may simulate:

- session creation;
- external-provider hand-off;
- accepted authentication;
- authentication failure;
- provider timeout/retry.

The mock must never accept real Aadhaar numbers, biometric material, OTPs, or citizen records.

## Face RD hand-off

The Android UI should describe the hand-off rather than reproduce Face RD. A production integration may launch the authorized Face RD application according to the current UIDAI integration specification. The Namma KYC UI should then show a return/result state.

The correct conceptual boundary is:

Citizen → Namma KYC → authorized Aadhaar integration → Face RD → authorized Aadhaar server path → Aadhaar ecosystem → authentication result → Namma KYC → PDS e-KYC.

The browser demo stops at the simulated external-provider boundary and never invokes Face RD.

## OTP

OTP is a provider-controlled Aadhaar authentication method. It is not a Namma KYC OTP service. If an authorized production integration enables OTP, the provider owns the OTP request, capture and response handling.

## Production readiness gate

A production adapter must not be enabled merely by changing a feature flag. Before deployment, the responsible authorized entity must have the required contractual/operational authorization, current UIDAI technical specifications, credentials/certificates, security controls, pre-production test results, and any required approval.

Sources:

- UIDAI Authentication FAQ: https://uidai.gov.in/hi/authentication
- UIDAI Face Authentication playbook: https://uidai.gov.in/images/240826_UIDAI_Unlocking_face_authentication_playbook_Digital_version.pdf
