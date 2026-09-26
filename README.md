# Namma KYC

**Namma KYC** is an independent open-source reference implementation for a citizen-first Karnataka ration-card e-KYC experience.

> This project is not an official Government of Karnataka, NIC, or UIDAI application unless formally authorized or adopted.

## What is included

- Android application built with React Native and Expo.
- Cloudflare Workers backend.
- Shared API schemas and OpenAPI contract.
- Explicit provider boundaries for PDS, Aadhaar authentication, and KYC processing.
- Mock providers for development and testing.
- Security, privacy, architecture, integration, and testing documentation.

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
