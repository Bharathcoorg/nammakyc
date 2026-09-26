# Request security boundary

Every HTTP response receives a generated or caller-supplied correlation identifier and conservative browser security headers.

The correlation identifier is for diagnostics only. It must not contain Aadhaar numbers, ration-card numbers, biometric data, access tokens, or other citizen identifiers.

Production logging should record the correlation identifier, route class, outcome, latency, and coarse error code while avoiding request bodies and sensitive authentication material.
