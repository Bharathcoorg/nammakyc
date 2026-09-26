# Namma KYC UI reference

The Android application and standalone browser demo use the supplied Namma KYC reference board as the primary visual direction.

## Reference hierarchy

The first citizen-facing screen is the Karnataka-branded splash:

- Karnataka state emblem
- Karnataka-inspired reference styling (not an official government service)
- Namma KYC wordmark
- Digital-identity / citizen-first positioning
- Karnataka/Vidhana Soudha visual treatment
- primary Get Started action

The following journey follows the reference board while preserving the real integration boundaries:

1. Branded splash / language
2. Welcome / service entry
3. Ration-card number
4. Household members and current KYC state
5. Consent & information
6. Aadhaar number + OTP authentication
7. Face preparation / FaceRD handoff
8. Authentication result
9. PDS e-KYC processing
10. e-KYC completion
11. Temporary status / reference

English and Kannada are separate complete-language experiences. The visual composition remains consistent between them.

## Security-preserving differences

The reference board is a visual product concept. The implementation must not turn the concept into an unauthorized identity-verification system.

- The Aadhaar screen is a provider boundary, not a custom face-recognition implementation.
- Production biometric authentication must be supplied by an authorized Aadhaar integration.
- The public browser demo uses simulated verification and fixed fictional values.
- The Android reference build uses mock providers unless an authorized production integration is configured.
- No raw Aadhaar/PID, biometric image, OTP, or citizen record is used by the demo.

## Karnataka emblem

The UI follows the supplied Karnataka visual direction, including the Karnataka emblem treatment, Vidhana Soudha photo, Namma KYC mark, and family artwork. The current app artwork is a product/reference treatment and must not imply government ownership, endorsement, or authorization until the project has formal authorization. Official insignia use must follow applicable restrictions.

Source: Wikimedia Commons, “Seal of Karnataka”, which identifies it as the state emblem of Karnataka and documents the source/licensing information:
The current splash uses the referenced state emblem asset and a Vidhana Soudha photo as visual references; use approved official assets and follow applicable insignia restrictions before any government-facing deployment.

## Pixel validation

Pixel-perfect validation is performed against the supplied reference board at the target Android viewport. Validation should cover:

- typography hierarchy and line wrapping
- emblem scale and alignment
- card radius and borders
- button height and placement
- dashboard tile grid
- member-row density
- four-step verification indicator
- provider-boundary information hierarchy
- processing timeline
- success/reference card
- status timeline
- temporary status/reference layout
- no permanent profile or account navigation
- English/Kannada text expansion
- accessibility touch targets

The generated reference is a design target, not evidence of an official Government of Karnataka service.

## Temporary journey

Namma KYC is a transaction-based service rather than a citizen account. The app does not maintain a permanent profile, saved ration-card dashboard, family history, biometric profile, or reusable Aadhaar/OTP store. After the transaction ends, the local journey state is cleared; operational backend references exist only as required to complete and reconcile that transaction.
