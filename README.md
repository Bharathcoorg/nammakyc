# Namma KYC

Open-source citizen-first reference implementation for Karnataka ration-card e-KYC.

## Status

This repository contains an independent technical reference implementation. It is not an official Government of Karnataka, NIC, or UIDAI application unless formally authorized or adopted.

Production Aadhaar and Karnataka PDS integrations require the appropriate authorization, credentials, endpoints, and security controls. The public implementation uses explicit provider boundaries and mock providers where those integrations are not available.

## Project structure

- `android/` — React Native/Expo Android application
- `backend/` — Cloudflare Workers backend
- `contracts/` — shared API contracts and OpenAPI definitions
- `infrastructure/` — Cloudflare deployment configuration
- `tests/` — integration, security, load, and failure tests
- `docs/` — architecture, API, security, privacy, integration, testing, and operations documentation

## Development

The project is designed as a TypeScript-first monorepo. Android uses React Native with Expo. The backend uses Cloudflare Workers. Production integrations are isolated behind provider interfaces.

## Privacy and security

The project follows data minimization as a core design principle. Real Aadhaar numbers, biometrics, OTP values, credentials, private keys, or production citizen data must never be committed to this repository.

See `SECURITY.md` for reporting security issues.
