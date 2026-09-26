# Interactive demo

The browser demo is a product demonstration, not a service endpoint.

## What it demonstrates

- Language switching between English and Kannada.
- App-like navigation through the citizen journey.
- Consent and preparation screens.
- Authorized Aadhaar provider boundary.
- Simulated processing, status, and completion.
- Responsive phone-shell UI for desktop and mobile browsers.

## What it does not demonstrate

- Aadhaar authentication.
- OTP delivery or validation.
- Real ration-card lookup.
- Government/PDS access.
- Biometric capture.
- Production authorization.
- Production data retention or audit infrastructure.

## Data safety

There are no input fields for personal information and no application API calls. The demo uses fictional values such as DEMO-NKYC-2026-0001.

The browser voice control speaks fixed instructional text; it does not record or transcribe the visitor.

## Source separation

The demo is deliberately under demo and does not import Android, backend, or contract packages. This prevents the public showcase from becoming an accidental integration path into the reference backend.


## GitHub Pages

The public showcase is intentionally static and is served from `docs/demo/` on the `main` branch. It is a simulation only: it does not collect, validate, transmit, or store citizen information and does not connect to the Namma KYC API, Karnataka PDS, UIDAI, or AadhaarFaceRD. GitHub Pages should be configured to publish the `main` branch using the `/docs` folder.
