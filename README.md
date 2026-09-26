# Namma KYC

> Namma KYC — an open-source, citizen-first reference implementation for secure, scalable Karnataka ration-card e-KYC.

## About

**Namma KYC** is an independent, open-source reference implementation for a secure, scalable, accessible and citizen-first Karnataka ration-card e-KYC experience. It demonstrates a modern Android journey, provider-neutral backend architecture, security controls, and a no-data interactive browser demo. It is **not an official Government of Karnataka, NIC, or UIDAI application** and does not claim authorization to perform Aadhaar authentication. Production use would require the applicable government, PDS and Aadhaar ecosystem approvals and integrations.

The project is designed for public review, contribution, testing, reuse and adoption. The browser demo is simulation-only and never asks for real ration-card, Aadhaar, biometric, OTP, identity or other citizen information.


## What is included

- Android application built with React Native and Expo.
- Cloudflare Workers backend.
- Shared API schemas and OpenAPI contract.
- Explicit provider boundaries for PDS, Aadhaar authentication, and KYC processing.
- Mock providers for development and testing.
- Security, privacy, architecture, integration, and testing documentation.

## Interactive demo

A standalone browser simulation is available under `demo/`. It never requests or sends personal information and does not call the Namma KYC backend.

- Demo source: `demo/`
- Journey documentation: `docs/product/user-journey.md`
- Aadhaar provider boundary: `docs/architecture/aadhaar-provider-boundary.md`
- Interactive demo notes: `docs/product/interactive-demo.md`

GitHub Pages is published from the dedicated `gh-pages` branch. For repository consistency, `gh-pages` is currently synchronized with `main`; the root `index.html` redirects to the standalone `demo/` showcase. The expected project site is `https://bharathcoorg.github.io/nammakyc/`. The demo must always be presented as a simulation, not an official government service.

### GitHub Pages setup

In GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **`gh-pages`**, choose **`/ (root)`**, and save. GitHub will publish the static demo at the project URL above. Keep `main` as the development branch and keep `gh-pages` synchronized with the published repository state. Do not add CI/build automation to the Pages branch.

## Repository

- android/ — citizen Android application
- backend/ — Cloudflare Workers API
- contracts/ — shared API contracts
- infrastructure/ — Cloudflare deployment configuration
- tests/ — integration, security, load, and failure testing
- docs/ — technical documentation

## Canonical verification flow

`Splash/language → Welcome → Ration-card number → Household members → Consent → Aadhaar number + OTP → Face preparation/FaceRD handoff → Authentication result → PDS e-KYC → Completion → Temporary status/reference`

Face Authentication / Face RD and OTP are provider-controlled Aadhaar authentication methods. Namma KYC does not implement custom face recognition, custom liveness, or a Namma KYC OTP service. The public build uses mock providers; a production adapter requires the applicable authorized Aadhaar/PDS integrations and current technical/operational approvals.

## Integration model

Production government and identity integrations are intentionally separated from the public reference implementation. Undocumented or unauthorized endpoints are not used.

The backend exposes provider interfaces so an authorized integration can be introduced without changing the core citizen workflow.

## Privacy

The project follows data minimization. Real Aadhaar numbers, biometric data, OTP values, credentials, private keys, or citizen records must never be committed to this repository.

## Development

Install dependencies with pnpm, then run the Android application or Cloudflare Worker from its respective workspace.

See the workspace README files and docs/ for technical details.
