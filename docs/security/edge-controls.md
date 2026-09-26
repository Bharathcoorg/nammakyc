# Edge request controls

The Worker rejects body-bearing requests without JSON content type and applies a 16 KiB application request-body limit.

This is an application-layer defense-in-depth control. Cloudflare WAF, rate limiting, DDoS protection, TLS, and deployment-level access controls remain required at the edge and must be configured per environment.

Request correlation IDs are constrained to a safe diagnostic character set and are never generated from citizen identifiers.
