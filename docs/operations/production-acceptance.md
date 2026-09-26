# Production acceptance and government handover

Namma KYC is an independent reference implementation. This checklist becomes applicable only if an adopting authority evaluates or authorizes a deployment.

## Integration acceptance

- [ ] Karnataka PDS/e-POS integration specification approved.
- [ ] Aadhaar integration path approved by the authorized requesting entity.
- [ ] Provider credentials issued through an approved secret-management process.
- [ ] Consent wording and policy version approved.
- [ ] Error/status mappings agreed with the operating authority.
- [ ] Provider idempotency/reconciliation strategy documented.
- [ ] Network allowlists and service-to-service authentication approved.

## Security acceptance

- [ ] Threat model reviewed.
- [ ] Independent security assessment completed.
- [ ] Dependency and SBOM review completed.
- [ ] Secrets and key-management review completed.
- [ ] Authorization model reviewed.
- [ ] WAF and rate limits enabled and tested.
- [ ] Sensitive logging review completed.
- [ ] Vulnerability remediation process established.

## Reliability acceptance

- [ ] Queue retry and DLQ behaviour tested.
- [ ] Provider timeout and outage recovery tested.
- [ ] Database failure/recovery tested.
- [ ] Duplicate HTTP request behaviour tested.
- [ ] Duplicate queue delivery tested.
- [ ] Stale-worker fencing tested.
- [ ] Load tests executed in the target environment.
- [ ] RTO/RPO agreed and recovery exercise completed.

## Mobile acceptance

- [ ] Supported Android versions agreed.
- [ ] Device compatibility tested.
- [ ] Accessibility review completed.
- [ ] English copy approved.
- [ ] Kannada copy reviewed by a native Kannada reviewer.
- [ ] Offline/network failure states tested.
- [ ] App restart/background processing behaviour tested.
- [ ] Release signing and update process approved.

## Operations

- [ ] Production monitoring configured.
- [ ] Alerts and escalation paths documented.
- [ ] Incident response runbook approved.
- [ ] Backup/restore process tested.
- [ ] Data retention/deletion schedule approved.
- [ ] Legal hold/records requirements documented.
- [ ] Operator access reviewed.
- [ ] Rollback procedure tested.

No item above should be treated as completed merely because a corresponding source-code interface exists. Production acceptance requires evidence from the deployed environment and the authority's approved specifications.
