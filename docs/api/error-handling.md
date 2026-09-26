# API error handling

The API exposes stable machine-readable error codes and human-readable messages.

Clients must not depend on internal exception text.

Expected categories include invalid requests, missing resources, duplicate requests, unavailable upstream dependencies, authentication failure, and internal errors.

Internal provider details, credentials, Aadhaar data, biometric information, and stack traces must never be returned to the Android client.
