# GitHub Pages demo setup

The interactive Namma KYC demo is intentionally hosted as a static showcase.

## Recommended configuration

Use the **main** branch as the only source of truth and publish from:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

The repository root contains a small `index.html` entry point that redirects to the isolated `demo/` application. This keeps the demo source separate while allowing GitHub Pages to use the supported root publishing source.

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
