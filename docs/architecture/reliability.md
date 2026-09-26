# Reliability controls

External provider calls must be bounded and protected from retry storms.

The reference implementation defines:
- exponential backoff with full jitter;
- a maximum attempt count;
- a circuit breaker with closed/open/half-open states;
- explicit retry classification supplied by the caller.

Only transient failures should be retried. Authentication rejection and validation errors are terminal and must not be retried.

For production, retry state must be observable and bounded. Queue consumers must remain idempotent because delivery is at-least-once.
