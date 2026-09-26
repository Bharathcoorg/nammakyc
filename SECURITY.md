# Security Policy

## Scope

Namma KYC is an independent open-source reference implementation. Security reports are welcome for the code and documentation in this repository.

Do not include Aadhaar numbers, biometric information, OTPs, credentials, private keys, or other sensitive personal data in an issue or pull request.

## Reporting

Please use GitHub's private security reporting mechanism when available. If it is unavailable, open a minimal issue requesting a private reporting channel without including vulnerability details.

## Security principles

- Minimize sensitive data.
- Never commit secrets or production credentials.
- Keep government and identity-provider integrations behind explicit interfaces.
- Treat the mobile client as untrusted and enforce security decisions on the backend.
