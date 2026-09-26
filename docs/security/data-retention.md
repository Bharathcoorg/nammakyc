# Data retention and cleanup

Namma KYC is designed to minimize retained citizen data. The reference implementation must not retain Aadhaar numbers, OTPs, biometric material, or raw upstream authentication payloads.

## Retention classes

| Data | Reference purpose | Production retention |
| --- | --- | --- |
| KYC transaction status | Citizen status and operational reconciliation | Set by adopting authority's approved retention schedule |
| Idempotency record | Safe replay/duplicate suppression | Short operational window, then purge |
| Consent artifact metadata | Demonstrate consent capture and policy version | Set by approved legal/records policy |
| Provider reference | Reconciliation with approved upstream system | Only as long as operationally required |
| Security events | Abuse detection and incident investigation | Set by security/legal policy |

The repository intentionally does not choose a legal retention period. Production operators must document the approved schedule before processing real citizen data.

## Cleanup requirements

Cleanup must be:

- automated rather than manual;
- scoped by record class;
- idempotent and restart-safe;
- observable through aggregate metrics;
- tested against concurrent transaction processing;
- designed so deletion of operational records does not silently break required audit evidence.

Before enabling automated deletion, document legal holds, incident investigations, and any government records requirements that override the normal schedule.

## Privacy rule

Retention should never become a reason to store raw Aadhaar/PID, biometric material, OTPs, or upstream payloads. Store opaque references and the minimum metadata needed for the approved purpose.
