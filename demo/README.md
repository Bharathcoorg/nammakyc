# Namma KYC interactive demo

This directory is a standalone, static simulation of the Namma KYC citizen journey.

## Safety boundary

- No backend API is called.
- No Aadhaar number, OTP, ration-card number, biometric data, name, phone number, or other personal information is requested.
- Household and reference values are fictional and hard-coded.
- The Aadhaar step is only a visual provider-boundary simulation.
- Browser voice playback reads fixed instructional text only.
- The demo is not an official Government of Karnataka, NIC, UIDAI, or PDS service.

## Running locally

Open index.html in a browser or serve the demo directory with any static file server.

## GitHub Pages

GitHub Pages can publish a branch root or docs folder directly, or the repository can use a Pages deployment workflow. The demo remains isolated under demo in the main source tree so it cannot accidentally share the application API.

If the demo is later published from a dedicated Pages branch, keep the same files and safety notice intact.
