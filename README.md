# Namma KYC

> Independent open-source reference implementation for secure, citizen-first Karnataka ration-card e-KYC — designed for evaluation, testing, contribution, and potential authorized adoption.

## About

**Namma KYC** is an independent, open-source reference implementation for a secure, accessible and citizen-first Karnataka ration-card e-KYC experience. It demonstrates a modern Android journey, provider-neutral backend architecture, security controls, and a no-data interactive browser demo. It is **not an official Government of Karnataka, NIC, or UIDAI application** and does not claim authorization to perform Aadhaar authentication. Production use would require the applicable government, PDS and Aadhaar ecosystem approvals and integrations.

The project is designed for public review, contribution, testing, reuse and adoption. The browser demo is simulation-only and never asks for real ration-card, Aadhaar, biometric, OTP, identity or other citizen information.


**Namma KYC** is an independent open-source reference implementation for a citizen-first Karnataka ration-card e-KYC experience.

> This project is not an official Government of Karnataka, NIC, or UIDAI application unless formally authorized or adopted.

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
- Interactive demo notes: `docs/product/interactive-demo.md`

GitHub Pages is prepared on the dedicated `gh-pages` branch. The branch contains only the static showcase files and does not contain the application backend or Android source. The expected project site is `https://bharathcoorg.github.io/nammakyc/`. The demo must always be presented as a simulation, not an official government service.

### GitHub Pages setup

In GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **`gh-pages`**, choose **`/ (root)`**, and save. GitHub will publish the static demo at the project URL above. Keep `main` as the development branch and `gh-pages` only as the published static showcase branch.

## Repository

- android/ — citizen Android application
- backend/ — Cloudflare Workers API
- contracts/ — shared API contracts
- infrastructure/ — Cloudflare deployment configuration
- tests/ — integration, security, load, and failure testing
- docs/ — technical documentation

## Integration model

Production government and identity integrations are intentionally separated from the public reference implementation. Undocumented or unauthorized endpoints are not used.

The backend exposes provider interfaces so an authorized integration can be introduced without changing the core citizen workflow.

## Privacy

The project follows data minimization. Real Aadhaar numbers, biometric data, OTP values, credentials, private keys, or citizen records must never be committed to this repository.

## Development

Install dependencies with pnpm, then run the Android application or Cloudflare Worker from its respective workspace.

See the workspace README files and docs/ for technical details.
