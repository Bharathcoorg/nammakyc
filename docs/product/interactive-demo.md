# Interactive demo

The browser demo is a standalone product demonstration, not a service endpoint.

## What it demonstrates

- Complete English and Kannada experiences as separate language experiences.
- A responsive phone-shell UI that follows the canonical citizen journey.
- Fictional household/member values with no personal-data entry.
- Consent and fixed voice-preparation guidance.
- An explicit authorized Aadhaar provider boundary, simulated authentication result, and separate PDS e-KYC stage.
- Status and completion screens with a fictional reference identifier.

## What it does not demonstrate

- Aadhaar authentication, Face RD, OTP delivery, or biometric capture.
- Real ration-card lookup or Karnataka PDS access.
- Government/NIC/UIDAI connectivity or production authorization.
- Production data retention, audit, authorization, or provider credentials.

## Data safety

The demo contains no personal-information input fields and makes no application API calls. It uses fictional values such as `DEMO-NKYC-2026-0001`.

Voice guidance, when supported by the browser, speaks only fixed instructional text. It does not record, upload, or transcribe the visitor.

## Source separation

The demo lives under `demo/` and does not import Android, backend, or contract packages. It is intentionally isolated from the reference backend.

## GitHub Pages

The repository root `index.html` redirects to `demo/index.html`. The intended public Pages deployment is the `gh-pages` branch containing the static showcase. The demo must remain a simulation and must never be described as an official Karnataka government, UIDAI, or PDS application.
