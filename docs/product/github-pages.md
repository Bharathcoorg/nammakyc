# GitHub Pages demo setup

The interactive Namma KYC demo is intentionally hosted as a static showcase.

## Recommended configuration

Use **`main`** as the development/source branch and publish the static showcase from the dedicated **`gh-pages`** branch:

- Source: **Deploy from a branch**
- Branch: **`gh-pages`**
- Folder: **`/(root)`**

The `gh-pages` branch contains only the static showcase files. The application source remains on `main`, while `demo/` is the canonical demo source directory.

## Expected URL

https://bharathcoorg.github.io/nammakyc/

GitHub Pages may take several minutes to publish after the setting is saved.

## Safety

The demo:
- does not request personal information
- does not call the Namma KYC backend
- does not contact Aadhaar, UIDAI, Karnataka PDS, or government systems
- uses fictional references only
- simulates the authorized Aadhaar provider boundary

## Repository About text

Recommended description:

> Open-source, citizen-first reference implementation for secure Karnataka ration-card e-KYC — with a privacy-first Android app and interactive demo.

Recommended website:

> https://bharathcoorg.github.io/nammakyc/

Recommended topics:

`karnataka`, `ekyc`, `ration-card`, `aadhaar`, `digital-governance`, `open-source`, `india`, `react-native`, `cloudflare`

Do not describe the repository or demo as an official Government of Karnataka, NIC, UIDAI, or PDS service.
