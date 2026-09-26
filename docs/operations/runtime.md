# Runtime operations

## Transaction lifecycle

received -> validating -> authenticating -> processing -> success

Failure transitions are recorded as failed. The API exposes the transaction reference so a client can retrieve status without resubmitting the mutation.

## Reliability

Provider calls use bounded retries, an 8-second operation timeout and a circuit breaker. Retries are restricted to transient upstream failures.

The transaction repository uses D1 when the DB binding is supplied. Local/reference execution uses a process-local repository so a status request can observe a transaction created by the same Worker instance.

## Production readiness

1. Replace mock providers with authorized adapters.
2. Configure D1 and verify migrations in a non-production environment.
3. Add distributed rate limiting/WAF rules.
4. Configure authenticated operator/service access.
5. Add centralized logs, metrics and alerts without sensitive citizen data.
6. Execute load, failure-injection, recovery and disaster-recovery tests.
7. Complete security assessment and government integration approval before handling real citizen data.
