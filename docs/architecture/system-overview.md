# System architecture

Namma KYC is structured as an Android client, a Cloudflare Workers API, shared contracts, and explicit integration-provider boundaries.

The Android client is not a trust boundary. Security-sensitive decisions are enforced by the backend.

Government and identity-provider integrations are represented by provider interfaces and synthetic/mock implementations until an authorized integration is available.

## Components

- Android client — citizen-facing application.
- Workers API — request validation, orchestration, security controls, and transaction state.
- Shared contracts — API schemas and OpenAPI definitions.
- Provider adapters — PDS, Aadhaar authentication, and KYC integration boundaries.
- Persistence — application transaction state only where required.

The architecture deliberately minimizes sensitive data and does not require the public reference implementation to store biometric material.
