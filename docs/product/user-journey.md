# Namma KYC citizen journey

Namma KYC is an independent open-source reference implementation. The screens below describe the intended citizen journey and the boundary between Namma KYC and authorized identity infrastructure.

> **Status:** design/reference documentation. This project is not an official Government of Karnataka, NIC, UIDAI, or PDS application unless formally authorized or adopted.

## Journey

1. **Language selection** — English and Kannada are complete, separate language experiences.
2. **Welcome and trust** — explains the purpose, privacy model, and reference nature of the service.
3. **Ration-card / household context** — the reference app resolves a household through an authorized PDS integration.
4. **Member selection** — the citizen selects the household member whose e-KYC is being completed.
5. **Consent and information** — required acknowledgements are explicit and independently selectable.
6. **Voice preparation** — optional fixed instructions help the citizen prepare before identity verification.
7. **Aadhaar verification boundary** — production must hand off through an authorized Aadhaar integration. The public reference build does not implement custom biometric capture.
8. **Processing and status** — asynchronous processing is represented with explicit states and a reference identifier.
9. **Success / completion** — the citizen receives a clear completion state and reference.

## UI reference board

The design was developed from the high-resolution Namma KYC UI reference used during product design. The repository also contains an implementation of the same visual language in the Android app and the standalone browser demo.

![Namma KYC journey reference board](../assets/journey-reference.svg)

The reference design uses a warm Karnataka-inspired cream/green system, clear cards, large touch targets, progress indicators, explicit consent, and strong provider-boundary messaging.

## Interactive demonstration

The standalone demo is in the demo directory and is intentionally disconnected from the Namma KYC API. It uses only fictional, preconfigured values.

When published with GitHub Pages, the expected project-site URL is:

https://bharathcoorg.github.io/nammakyc/

Do not present the demo URL as an official government service.

## Screenshot policy

Promotional or concept screenshots must be labeled as **reference/design** material. Any screen depicting a face scan must not imply that Namma KYC itself performs biometric recognition. Production biometric authentication belongs behind the authorized Aadhaar integration boundary.
