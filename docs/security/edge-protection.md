# Edge protection

Namma KYC should enforce abuse controls at the Cloudflare edge before requests reach the Worker.

## Required controls

- WAF managed rules enabled for the production hostname.
- Rate limiting applied separately to POST /v1/kyc, GET /v1/households/*, and GET /v1/kyc/*.
- Prefer authenticated or otherwise attributable clients for operator/internal APIs; citizen endpoints must not rely on a client-supplied identity header.
- Keep Idempotency-Key mandatory for KYC mutation requests.
- Reject oversized request bodies before application parsing.
- Apply bot/challenge controls only where they do not block accessibility or legitimate citizen traffic.
- Alert on sustained 4xx/5xx spikes, unusual request bursts, and repeated idempotency conflicts.

## Rate-limit design

Limits are deployment policy rather than application constants. The production operator should set separate thresholds for normal citizen traffic, automated abuse, and trusted internal traffic after load testing.

The key should normally combine the deployment's strongest available signal (for example, authenticated client identity where applicable, otherwise a privacy-reviewed edge signal) with the route. Do not key solely on ration-card number, member reference, or any other citizen identifier.

A rate-limit response should be an ordinary 429 Too Many Requests response with a short, non-sensitive message. The client must not receive internal WAF rule identifiers or upstream details.

## Cloudflare deployment note

Cloudflare WAF and rate-limiting rules are configured at the zone/hostname layer rather than by pretending that a local Worker counter is globally authoritative. A Worker-local counter is not a substitute for distributed edge enforcement.

The exact thresholds, bypasses, managed-rule set, and retention of security-event data must be reviewed by the production operator before activation.