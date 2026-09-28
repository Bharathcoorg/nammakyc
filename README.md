# Namma KYC (ನಮ್ಮ KYC)
### Karnataka Ration Card Citizen Biometric e-KYC Reference Implementation

[![Live Interactive Demo](https://img.shields.io/badge/Live%20Demo-Interactive%20Simulation-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://bharathcoorg.github.io/nammakyc/)
[![Android Application](https://img.shields.io/badge/Android%20App-v0.1.0%20(Debug)-0284C7?style=for-the-badge&logo=android&logoColor=white)](https://github.com/bharathcoorg/nammakyc/raw/main/nammakyc-debug.apk)
[![Target Jurisdiction](https://img.shields.io/badge/Government-Karnataka%20PDS%20e--KYC-124733?style=for-the-badge)](https://ahara.kar.nic.in/)
[![Aadhaar Biometric](https://img.shields.io/badge/Biometric%20Auth-Aadhaar%20FaceRD%20(UIDAI)-C8942E?style=for-the-badge)](https://uidai.gov.in/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-Bharathcoorg-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Bharathcoorg)

---

## 🌟 Live Interactive Demo

Experience the complete end-to-end Karnataka ration card citizen verification workflow directly in your web browser — fully responsive for desktop and mobile, with instant bilingual support (Kannada & English), zero installation, and no personal data collection.

> ### 🚀 [**👉 Launch Namma KYC Interactive Browser Demo**](https://bharathcoorg.github.io/nammakyc/)
> **URL:** `https://bharathcoorg.github.io/nammakyc/`  
> *Note: The interactive demo is simulation-only. It never collects or transmits real Aadhaar numbers, biometric templates, or OTPs.*

---

## 📱 Android Native Application

Namma KYC includes a production-grade native Android client built with **React Native** and **Expo SDK 54**:

- **Official Identity & Heritage Branding:** Centered Government of Karnataka emblem, official "N" application launcher icon, and landmark Vidhana Soudha heritage visual.
- **Zero-Latency Audio Guidance:** Instant, responsive voice guidance in authentic Kannada (`kn-IN`) and Indian English (`en-IN`) guiding citizens through lighting, posture, and camera alignment.
- **Household Entitlement Verification:** Full ration-card lookup simulation (`KA-PDS-2026-8492`) displaying household members (Head, Spouse, Son, Daughter) with individual e-KYC requirement flags.
- **UIDAI FaceRD Integration Specification:** Aadhaar Face Authentication viewfinder simulation with face boundary guidelines, liveness verification indicator, and automated status polling.
- **Fair Price Shop (FPS) Advisory:** Guidance for citizens who prefer offline biometric verification (fingerprint / iris) at nearby ration shops via e-POS terminals.
- **Offline-First Resilience:** Seamless failover to high-fidelity offline verification simulation if network or backend edge nodes are unreachable.

### 📥 Download Android APK
The compiled debug APK is available directly in the repository root:
- **File:** [`nammakyc-debug.apk`](./nammakyc-debug.apk)
- **Install via ADB:**
  ```bash
  adb install -r nammakyc-debug.apk
  ```

---

## ☁️ Architecture & Cloudflare Stack Integration

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Citizen Client Channels                         │
│   ┌───────────────────────────────┐  ┌──────────────────────────────┐  │
│   │    Native Android Mobile App   │  │  Browser Interactive Demo    │  │
│   │    (React Native / Expo APK)  │  │  (Cloudflare Pages / GitHub) │  │
│   └───────────────┬───────────────┘  └──────────────┬───────────────┘  │
└───────────────────┼─────────────────────────────────┼──────────────────┘
                    │                                 │
                    ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Cloudflare Edge Backend Stack (Zero Cold-Start)            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Cloudflare Worker API Gateway (Node/TS Edge Runtime)             │  │
│  │   • GET  /v1/households/:id       — Ration card lookup           │  │
│  │   • POST /v1/kyc                  — Idempotent session initiate  │  │
│  │   • GET  /v1/kyc/:id/status       — Polling verification state   │  │
│  └──────────────────┬───────────────────────────────────────────────┘  │
│                     │                                                  │
│  ┌──────────────────┴─────────────┐  ┌──────────────────────────────┐  │
│  │ Cloudflare Workers KV Cache    │  │ Aadhaar Provider Boundary    │  │
│  │   • Idempotency-Key validation │  │   • Zero biometric storage   │  │
│  │   • Rate limiting & TTL state  │  │   • UIDAI FaceRD orchestrator│  │
│  └────────────────────────────────┘  └──────────────┬───────────────┘  │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Karnataka PDS Core Services  │
                                       │ (Ahara / Food & Civil Dept)  │
                                       └──────────────────────────────┘
```

### Is Testing Cloudflare Stack Integration Necessary?
- **For Citizen App & Demo Testing (Current State):** **Not required.** The Android application and the web demo both feature an offline-resilient architecture with embedded authentic Karnataka PDS fixtures. They function 100% reliably standalone on physical mobile devices and web browsers.
- **When Cloudflare Stack Testing IS Recommended:** If you want to benchmark edge latency, verify Cloudflare KV idempotency keys under concurrent requests, or test the live REST proxy endpoints (`/v1/households/*`, `/v1/kyc/*`) deployed on Cloudflare Workers edge nodes.

---

## 🔄 Canonical Verification Journey

| Step | Screen | Kannada Title | English Title | Purpose |
|:---:|:---|:---|:---|:---|
| **1** | Splash | **ನಮ್ಮ KYC** | **Namma KYC** | Language selection, official state branding, and mission statement |
| **2** | Welcome | **ಸ್ವಾಗತ** | **Welcome** | Program overview, family entitlement highlights, and security trust badges |
| **3** | Ration Card | **ಪಡಿತರ ಚೀಟಿ ನಮೂದಿಸಿ** | **Enter Ration Card** | Household number entry (e.g. `KA-PDS-2026-8492`) |
| **4** | Member Selection | **ಫಲಾನುಭವಿ ಆಯ್ಕೆಮಾಡಿ** | **Select Beneficiary** | Lists family members; identifies who has completed e-KYC and who is pending |
| **5** | Informed Consent | **ಆಧಾರ್ ಸಮ್ಮತಿ ಪತ್ರ** | **Informed Consent** | DPDP Act 2023 & Aadhaar Act compliant explicit dual consent checkboxes |
| **6** | Method Selection | **ಪರಿಶೀಲನಾ ವಿಧಾನ** | **Verification Method** | Aadhaar FaceRD (recommended) vs Fair Price Shop (e-POS offline info) |
| **7** | Face Preparation | **ಮುಖ ಸಿದ್ಧತೆ** | **Face Ready** | Lighting/position guidance with instant Kannada voice playback & demo alignment |
| **8** | Face Capture | **ಆಧಾರ್ FaceRD** | **Aadhaar FaceRD** | High-fidelity face scanner overlay and UIDAI biometric handoff |
| **9** | Processing | **ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ** | **Processing** | Multi-stage timeline: UIDAI auth → PDS state ledger sync |
| **10** | Success | **e-KYC ಪೂರ್ಣಗೊಂಡಿದೆ** | **e-KYC Completed** | Downloadable reference code, timestamp, and entitlement protection notice |

---

## 📁 Repository Structure

```
nammakyc/
├── android/                   # Native Android application (Expo / React Native)
│   ├── app/                   # Expo router screens (Splash, Journey, Results)
│   ├── src/
│   │   ├── audioGuidance.ts   # Instant Kannada/English voice guidance engine
│   │   ├── brand.tsx          # Official government brand components
│   │   ├── i18n/              # Standardized bilingual localization strings
│   │   └── api/               # Resilient edge API client with simulation fallback
│   └── android/               # Native Gradle Android project & drawables
├── backend/                   # Cloudflare Workers API backend
│   ├── src/
│   │   ├── index.ts           # Worker routing and edge handler
│   │   ├── storage/           # Cloudflare KV state and idempotency manager
│   │   └── providers/         # Aadhaar and PDS provider boundaries
│   └── wrangler.toml          # Cloudflare deployment manifest
├── contracts/                 # Shared TypeScript contracts and OpenAPI schemas
├── demo/                      # Standalone interactive browser simulation
│   ├── index.html             # Responsive phone viewport showcase
│   ├── app.js                 # Complete client-side journey engine
│   └── styles.css             # Karnataka government aesthetic design system
├── docs/                      # Architectural, legal, and operational specifications
│   ├── architecture/          # Aadhaar provider boundaries and edge workflows
│   ├── product/               # User journeys and UX accessibility specs
│   └── security/              # Data minimization and DPDP compliance notes
└── nammakyc-debug.apk         # Compiled, standalone Android debug APK
```

---

## 🛠️ Local Development & Quickstart

### 1. Prerequisites
- **Node.js** 20+
- **pnpm** 9+
- **Android SDK** (optional, only needed for local Android native compilation)

### 2. Run the Interactive Web Demo
```bash
# Clone the repository
git clone https://github.com/bharathcoorg/nammakyc.git
cd nammakyc

# Start demo locally (or open demo/index.html in any browser)
pnpm dev:demo
# Or using Python:
python -m http.server 3456 -d demo
```
Open [http://localhost:3456](http://localhost:3456) in your browser.

### 3. Run the Android App (Expo)
```bash
cd android
pnpm install
pnpm start
```
Press `a` in the terminal to launch on a connected Android phone or emulator.

### 4. Build Android Debug APK
```bash
cd android/android
./gradlew assembleDebug
```
The APK will be generated at `android/android/app/build/outputs/apk/debug/app-debug.apk`.

### 5. Run the Cloudflare Worker Backend
```bash
cd backend
pnpm install
pnpm dev
```

---

## 🔒 Privacy, Security & Data Minimization

- **Zero Biometric Retention:** Biometric face captures and templates are processed solely through UIDAI-certified FaceRD client handoffs. Namma KYC stores **zero** facial vectors or biometric data.
- **Informed Consent (DPDP Act 2023):** Citizens must explicitly consent to Aadhaar verification with a full explanation of purpose (PDS ration card identity maintenance).
- **No Aadhaar Number Storage:** Only masked references and encrypted transaction identifiers (`KYC-...`) are exchanged.
- **Fair Price Shop Alternative:** Digital verification is voluntary. Citizens may complete e-KYC offline at any Fair Price Shop using biometric e-POS machines.

---

## 💖 Sponsor & Support

If you find **Namma KYC** impactful and support open-source digital public infrastructure (DPI) for citizens, consider sponsoring the project on GitHub:

<p align="left">
  <a href="https://github.com/sponsors/Bharathcoorg">
    <img src="https://img.shields.io/badge/Sponsor%20on%20GitHub-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="Sponsor on GitHub" />
  </a>
</p>

Your sponsorship directly supports ongoing maintenance, accessibility improvements, Kannada voice localization, and civic tech innovation.

---

## ⚖️ Legal & Ecosystem Disclaimer

*Namma KYC is an independent open-source reference implementation designed to evaluate and demonstrate modern, accessible e-KYC UX and zero-trust cloud architecture. It is **not an official application of the Government of Karnataka, the Department of Food, Civil Supplies & Consumer Affairs, NIC, or UIDAI**. Production deployment requires formal authorization, security audits, and approved integrations with the official Karnataka PDS portal and UIDAI ecosystem.*

---

<p align="center">
  <b>Made for Karnataka's Citizens · ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ</b><br/>
  <sub>Licensed under the Apache License 2.0</sub>
</p>
