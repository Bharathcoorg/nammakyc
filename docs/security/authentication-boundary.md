# Authentication and authorization boundary

This public repository deliberately does not invent a government authentication protocol.

## Public citizen API

The reference API accepts only the minimum request data needed to demonstrate the workflow. It must not trust client-supplied headers as proof of identity or government authorization.

Production deployment must place the API behind the identity, authorization, and network controls required by the adopting authority. Those controls should be selected from the authority's approved integration specification rather than copied from this reference build.

## Internal and operator access

Any future operator or internal endpoint must have:

- explicit authentication;
- role-based authorization;
- least-privilege credentials;
- short-lived credentials where supported;
- secret storage in a managed secret system;
- audit events containing actor, action, outcome, request identifier, and timestamp;
- no Aadhaar number, OTP, biometric payload, or raw upstream response in ordinary application logs.

Do not add a shared static bearer token to citizen endpoints as a shortcut.

## Provider credentials

Aadhaar and PDS credentials belong at the provider adapter boundary. They must be injected through managed secrets/configuration and never committed to source control.

The public mock providers are intentionally credential-free. Replacing them with a real provider requires an approved AUA/KUA/SUB-AUA and Karnataka PDS integration path plus the corresponding security and compliance review.

## Failure behavior

Authentication failures must not reveal whether a sensitive identifier exists in an upstream system. Internal authorization failures should be logged with a structured reason, while public responses remain generic.