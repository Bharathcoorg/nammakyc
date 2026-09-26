# Runtime architecture

The Android client is React Native + Expo and communicates with the Cloudflare Worker API through a provider-neutral HTTP client.

The Worker owns request validation, correlation, routing and transaction orchestration. Government integrations are isolated behind provider interfaces:
- PDS provider: household/member lookup.
- Aadhaar provider: authorized authentication boundary.
- KYC provider: government e-KYC submission.

The repository uses an in-memory implementation for local/reference execution and a D1 implementation when the Worker environment supplies the DB binding.

KYC requests use an idempotency key. The service validates household membership before creating a transaction, then advances it through validation, authentication, processing and success.

Production integration must replace mock providers with authorized government adapters and must not store Aadhaar biometrics, OTPs or PID data in the application database.
