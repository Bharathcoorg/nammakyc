# Integration boundaries

Namma KYC does not embed undocumented government endpoints.

The backend defines provider interfaces for:

1. Karnataka PDS household/member services.
2. Authorized Aadhaar authentication.
3. Authorized KYC transaction processing.

Mock providers are used for development and testing.

A production adapter must only be added when the relevant organization has provided an authorized interface, credentials, security requirements, and operational agreement.
