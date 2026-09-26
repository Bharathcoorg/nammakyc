# Authorization boundary

Namma KYC does not invent a citizen identity or government authentication mechanism.

The reference implementation exposes a provider-neutral `AuthorizationPolicy` boundary. In development, the policy is intentionally bypassed so the public reference application can run with mock providers. In production, the API fails closed unless an adopting authority supplies an approved policy.

The production policy must be selected and implemented by the adopting authority based on its approved identity, network, application, and delegation model. The reference repository must not ship hard-coded government credentials, bearer tokens, Aadhaar credentials, or undocumented upstream authentication behavior.

Authorization actions are separated by resource:
- `household.read`
- `kyc.create`
- `kyc.status.read`

The status-read context includes the opaque transaction reference so the production policy can enforce ownership or delegated access without the reference implementation exposing citizen identity data.

The policy boundary is intentionally independent from Aadhaar authentication. Aadhaar authentication is a downstream identity-verification integration and is not used as a generic API authorization mechanism.
