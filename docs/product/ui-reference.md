# Namma KYC UI reference

The Android application and standalone browser demo use the supplied Namma KYC reference board as the primary visual direction.

## Reference hierarchy

The first citizen-facing screen is the Karnataka-branded splash:

- Karnataka state emblem
- Government of Karnataka
- Namma KYC wordmark
- Digital-identity / citizen-first positioning
- Karnataka/Vidhana Soudha visual treatment
- primary Get Started action

The following journey follows the reference board's major screens:

1. Home / citizen dashboard
2. Select Member
3. Aadhaar Authentication boundary
4. Processing e-KYC
5. e-KYC Completed Successfully
6. e-KYC Status
7. My Profile / support

English and Kannada are separate complete-language experiences. The visual composition remains consistent between them.

## Security-preserving differences

The reference board is a visual product concept. The implementation must not turn the concept into an unauthorized identity-verification system.

- The Aadhaar screen is a provider boundary, not a custom face-recognition implementation.
- Production biometric authentication must be supplied by an authorized Aadhaar integration.
- The public browser demo uses simulated verification and fixed fictional values.
- The Android reference build uses mock providers unless an authorized production integration is configured.
- No raw Aadhaar/PID, biometric image, OTP, or citizen record is used by the demo.

## Karnataka emblem

The UI uses the Karnataka state emblem as a government-identity visual reference. The emblem source and licensing/insignia restrictions must be reviewed before any authorized production branding is shipped.

Source: Wikimedia Commons, “Seal of Karnataka”, which identifies it as the state emblem of Karnataka and documents the source/licensing information:
https://commons.wikimedia.org/wiki/File:Seal_of_Karnataka.svg

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
- bottom navigation/profile layout
- English/Kannada text expansion
- accessibility touch targets

The generated reference is a design target, not evidence of an official Government of Karnataka service.
