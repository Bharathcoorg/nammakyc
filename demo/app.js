/**
 * Namma KYC — Interactive Citizen Reference Demonstration
 * Native, culturally authentic bilingual citizen journey.
 * Independent reference implementation aligned to publicly documented Karnataka PDS and UIDAI integration concepts.
 */

const ASSETS = {
  emblem: "./assets/karnataka-emblem.png",
  soudha: "./assets/vidhana-soudha.jpg",
  family: "./assets/family-transparent.png",
  mark: "./assets/namma-kyc-mark.svg",
  face: "./assets/citizen-face.jpg",
  audioKn: "./assets/audio-guide-kn.mp3",
  audioEn: "./assets/audio-guide-en.mp3"
};

const I18N = {
  en: {
    pageTitle: "Namma KYC — Karnataka Ration Card Citizen e-KYC Service",
    bannerBadge: "DEMO",
    bannerText: "Citizen Simulation Experience · No Personal Data Collected",
    bannerSub: "Karnataka PDS & UIDAI reference flow",
    app: "Namma KYC",
    gov: "Government of Karnataka",
    dept: "Department of Food, Civil Supplies & Consumer Affairs",
    tagline: "Secure Identity · Uninterrupted Ration · A Stronger Karnataka",
    langBtn: "ಕನ್ನಡ",
    langCode: "EN",
    getStarted: "Get Started",
    continue: "Continue",
    reset: "Start Again",
    back: "Back",
    officialBadge: "Independent open-source citizen reference build",
    peopleFirst: "Citizens First",
    simpleAccess: "Simple Digital Access",
    digitalKarnataka: "Digital Karnataka",

    welcome: "Welcome to Namma KYC",
    welcomeSub: "Complete your Karnataka ration-card e-KYC from home securely in a few simple minutes.",
    feat1Title: "Ration Card e-KYC",
    feat1Text: "Instant verification for all family members on your card",
    feat2Title: "Authorized Provider Flow",
    feat2Text: "Models the authorized provider boundary without real authentication",
    feat3Title: "Total Privacy Protection",
    feat3Text: "Zero biometric storage; strictly minimal data access",
    feat4Title: "Fast & Contactless",
    feat4Text: "Done in just 2 minutes without visiting any office",

    rationTitle: "Ration Card & Family Members",
    rationSub: "Check the e-KYC status of family members registered on your ration card.",
    cardNumberLabel: "Ration Card Number",
    demoCardNumber: "KA-PDS-2026-8492",
    cardType: "Card Type: Priority Household (BPL)",
    familyMembersList: "Family Members & e-KYC Status",
    kycRequiredBadge: "e-KYC Pending",
    kycCompletedBadge: "✓ e-KYC Done",
    tapToViewStatus: "Tap to view KYC Done details",
    tapToProceed: "Tap to complete Face e-KYC",
    selectMemberPrompt: "Select a family member with pending e-KYC to proceed with Aadhaar FaceRD verification.",

    // Modal / View for KYC Done
    kycDoneTitle: "e-KYC Verification Details",
    kycDoneBadge: "✓ e-KYC Verified & Completed",
    memberHead: "Head of Household",
    memberWife: "Wife",
    memberSon: "Son",
    memberDaughter: "Daughter",
    resetMembersBtn: "Reset Demo",
    aadhaarNumberMasked: "Aadhaar Number",
    verificationMode: "Verification Method",
    verificationModeVal: "Aadhaar FaceRD (Live Face Authentication)",
    verificationDate: "Verification Date",
    verificationDateVal: "12 August 2024, 11:20 AM",

    kycDoneNote: "This member's e-KYC has already been successfully verified with UIDAI. No re-verification is required.",
    closeModal: "Close (Back to List)",

    stepper: ["Consent", "Method", "Face Scan", "Complete"],

    consentTitle: "Citizen Consent & Important Information",
    consent1: "This application exclusively uses UIDAI's authorized AadhaarFaceRD system for identity authentication.",
    consent2: "Your live face image is transmitted directly and securely to UIDAI servers for verification.",
    consent3: "No face photographs or biometric data are stored in this application or on your mobile device.",
    consent4: "Only the strictly minimal information necessary for PDS verification is linked to Karnataka Food Dept records.",
    consent5: "This reference flow models consent for a future authorized service integration; it is not a government service.",
    consentCheck1: "I have read, understood, and accept all the terms and notices listed above.",
    consentCheck2: "I give my voluntary consent to verify my identity using AadhaarFaceRD.",
    agreeContinue: "Agree & Continue",

    methodTitle: "Select Verification Method",
    methodSub: "Choose how you wish to complete your mandatory ration-card biometric e-KYC:",
    methodFaceTitle: "Aadhaar Face Authentication (FaceRD)",
    methodFaceBadge: "Recommended",
    methodFaceProvider: "(Instant from home on your mobile camera)",
    methodFaceDesc: "Reference flow for authorized Face Authentication; this demo does not perform real authentication.",
    methodFpsTitle: "Fair Price Shop Visit (FPS / Ration Shop)",
    methodFpsBadge: "Offline Alternative",
    methodFpsProvider: "(Biometric Fingerprint or Iris Scan on e-POS)",
    methodFpsDesc: "Visit any nearby fair price shop if you prefer in-person biometric authentication.",
    methodFpsNearbyTitle: "Complete at Any Nearby Ration Shop",
    methodFpsNearbyText: "You can complete your mandatory biometric e-KYC at any nearby Fair Price Shop (Ration Shop) using the biometric e-POS machine with fingerprint or iris scan. This mobile application exclusively performs instant Aadhaar FaceRD.",
    continueFace: "Continue with Face e-KYC",
    methodNotice: "Important Note: Under PDS guidelines, Aadhaar OTP alone is not sufficient for ration-card e-KYC. Mandatory proof-of-life biometric authentication (FaceRD or FPS biometric) is required to ensure genuine beneficiary entitlement.",

    readyTitle: "Face Scan Instructions (Do's & Don'ts)",
    readySub: "Stand in good lighting and follow these visual rules for a successful scan:",
    audioGuideLabel: "Voice Guidance",
    playGuide: "Listen to Voice",
    stopGuide: "Stop Audio",
    tabAll: "All Instructions",
    tabDo: "✓ What to Do (DO)",
    tabDont: "✕ What NOT to Do (DON'T)",
    badgeDo: "DO",
    badgeDont: "DON'T",
    do1Title: "Good Natural Light",
    do1Desc: "Keep face evenly lit without dark shadows or harsh glare",
    do2Title: "Camera at Eye Level",
    do2Desc: "Hold smartphone straight in front of your eyes and look ahead",
    do3Title: "Single Person Only",
    do3Desc: "Only one beneficiary face must be present inside the frame",
    do4Title: "Blink Naturally",
    do4Desc: "Keep a calm, neutral expression and blink when prompted",
    dont1Title: "No Face Coverings",
    dont1Desc: "Remove caps, masks, dark sunglasses, or face-covering cloths",
    dont2Title: "No Background People",
    dont2Desc: "No family members, bystanders, or photos behind you",
    dont3Title: "No Harsh Backlight",
    dont3Desc: "Do not stand in front of bright windows or glaring bulbs",
    dont4Title: "Do Not Shake Phone",
    dont4Desc: "Keep hands steady during capture; avoid moving or tilting",
    imReady: "I'm Ready, Start Face Scan",

    keepInside: "Keep face inside the green frame",
    capturing: "Scanning face... Please hold still and blink",

    verifyingTitle: "Authenticating with UIDAI",
    verifyingSub: "Please wait a moment while your identity is verified...",
    vStep1: "Face image captured successfully",
    vStep2: "Encrypted and securely transmitted to UIDAI",
    vStep3: "Biometric proof-of-life match in progress...",
    vStep4: "UIDAI authentication response received",
    vStep5: "Karnataka PDS ration records updated",
    verifyingNote: "This process takes only a few seconds. Please do not close or navigate away.",

    successTitle: "e-KYC Completed Successfully!",
    successSub: "Identity successfully authenticated with UIDAI and ration-card records updated in Karnataka Food Department.",
    refId: "Reference ID",
    refVal: "NKYC-KA-2026-9284F",
    dateTime: "Date & Time",
    dateTimeVal: "27 Sep 2026, 11:45 AM",
    service: "Service",
    serviceVal: "Ration Card Aadhaar FaceRD e-KYC",
    status: "Status",
    statusVal: "✓ Verified & Active",
    viewDetails: "View Family Details",
    goHome: "Return to Home",

    stageEyebrow: "NAMMA KYC",
    stageTitle: "Ration-card e-KYC, from start to completion.",
    stageLede: "A clean, citizen-first reference journey for Karnataka services, designed around privacy, accessibility, and documented integration boundaries.",
    journeyHeading: "Citizen Journey Steps",
    stepsList: ["Home", "Welcome", "Ration Card", "Consent", "Method", "Face Guide", "Capture", "Verify", "Complete"],

    footerTitle: "Namma KYC",
    footerSub: "An independent open-source citizen reference project for Karnataka.",
    badgeGov: "Karnataka Government Reference",
    badgeGovSub: "Food & Civil Supplies Dept",
    badgeUidai: "UIDAI Integration Boundary",
    badgeUidaiSub: "AadhaarFaceRD Service",
    badgePrivacy: "Privacy by Design",
    badgePrivacySub: "Zero Biometric Storage",
    badgeCitizen: "Citizen Centric",
    badgeCitizenSub: "For a Stronger Karnataka"
  },
  kn: {
    pageTitle: "Namma KYC — ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿ ನಾಗರಿಕ e-KYC ಸೇವೆ",
    bannerBadge: "ಡೆಮೊ",
    bannerText: "ನಾಗರಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಅನುಭವ · ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ",
    bannerSub: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಆಹಾರ ಇಲಾಖೆ ಹಾಗೂ UIDAI ಸೇವಾ ಮಾದರಿ",
    app: "Namma KYC",
    gov: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    dept: "ಆಹಾರ, ನಾಗರಿಕ ಸರಬರಾಜು ಮತ್ತು ಗ್ರಾಹಕರ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ",
    tagline: "ಸುರಕ್ಷಿತ ಗುರುತು · ನಿರಂತರ ಪಡಿತರ ಸೇವೆ · ಸಶಕ್ತ ಕರ್ನಾಟಕ",
    langBtn: "English",
    langCode: "ಕನ್ನಡ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    reset: "ಮರುಪ್ರಾರಂಭಿಸಿ",
    back: "ಹಿಂದೆ",
    officialBadge: "ಸ್ವತಂತ್ರ ಓಪನ್-ಸೋರ್ಸ್ ನಾಗರಿಕ ಉಲ್ಲೇಖ ನಿರ್ಮಾಣ",
    peopleFirst: "ನಾಗರಿಕರೇ ಮೊದಲು",
    simpleAccess: "ಸರಳ ಮತ್ತು ಸುಲಭ ಸೇವೆ",
    digitalKarnataka: "ಡಿಜಿಟಲ್ ಕರ್ನಾಟಕ",

    welcome: "Namma KYC ಗೆ ಸುಸ್ವಾಗತ",
    welcomeSub: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪಡಿತರ ಚೀಟಿಯ e-KYC ಯನ್ನು ನಿಮ್ಮ ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಮೊಬೈಲ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿ.",
    feat1Title: "ಪಡಿತರ ಚೀಟಿ e-KYC",
    feat1Text: "ಕುಟುಂಬದ ಪ್ರತಿಯೊಬ್ಬ ಸದಸ್ಯರ ಪರಿಶೀಲನೆ ಸುಲಭ",
    feat2Title: "ಅಧಿಕೃತ ಹಾಗೂ ನೇರ",
    feat2Text: "UIDAI ನ ಅಧಿಕೃತ ಆಧಾರ್ ಫೇಸ್ ಆರ್‌ಡಿ (FaceRD) ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ನೇರ ಪರಿಶೀಲನೆ",
    feat3Title: "ನಿಮ್ಮ ಗೌಪ್ಯತೆಗೆ ರಕ್ಷಣೆ",
    feat3Text: "ಯಾವುದೇ ಬಯೋಮೆಟ್ರಿಕ್ ವಿವರಗಳನ್ನು ಈ ಆ್ಯಪ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ",
    feat4Title: "ತ್ವರಿತ ಮತ್ತು ಸಂಪರ್ಕರಹಿತ",
    feat4Text: "ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ ಯಾವುದೇ ಕಚೇರಿಗೆ ಹೋಗದೆ ಪೂರ್ಣಗೊಳ್ಳುತ್ತದೆ",

    rationTitle: "ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಕುಟುಂಬದ ಸದಸ್ಯರ ವಿವರ",
    rationSub: "ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿರುವ ಕುಟುಂಬ ಸದಸ್ಯರ e-KYC ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    cardNumberLabel: "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",
    demoCardNumber: "KA-PDS-2026-8492",
    cardType: "ಕಾರ್ಡ್ ಪ್ರಕಾರ: ಆದ್ಯತಾ ಕುಟುಂಬ (ಬಿಪಿಎಲ್)",
    familyMembersList: "ಕುಟುಂಬ ಸದಸ್ಯರ ಪಟ್ಟಿ ಮತ್ತು e-KYC ಸ್ಥಿತಿ",
    kycRequiredBadge: "e-KYC ಬಾಕಿ ಇದೆ",
    kycCompletedBadge: "✓ e-KYC ಪೂರ್ಣಗೊಂಡಿದೆ",
    tapToViewStatus: "ಪರಿಶೀಲನಾ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಒತ್ತಿ",
    tapToProceed: "ಮುಖ ದೃಢೀಕರಣ ಮಾಡಲು ಒತ್ತಿ",
    selectMemberPrompt: "e-KYC ಬಾಕಿ ಇರುವ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮುಖ ದೃಢೀಕರಣವನ್ನು ಮುಂದುವರಿಸಿ.",

    // Modal / View for KYC Done
    kycDoneTitle: "e-KYC ಪರಿಶೀಲನಾ ವಿವರಗಳು",
    kycDoneBadge: "✓ e-KYC ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿದಿದೆ",
    memberHead: "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥ",
    memberWife: "ಪತ್ನಿ",
    memberSon: "ಪುತ್ರ",
    memberDaughter: "ಪುತ್ರಿ",
    resetMembersBtn: "ಮರುಹೊಂದಿಸಿ",
    aadhaarNumberMasked: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
    verificationMode: "ದೃಢೀಕರಣ ವಿಧಾನ",
    verificationModeVal: "ಆಧಾರ್ ಮುಖ ದೃಢೀಕರಣ (Aadhaar FaceRD - UIDAI)",
    verificationDate: "ದೃಢೀಕರಣ ದಿನಾಂಕ",
    verificationDateVal: "12 ಆಗಸ್ಟ್ 2024, ಬೆಳಗ್ಗೆ 11:20",

    kycDoneNote: "ಈ ಸದಸ್ಯರ e-KYC ಈಗಾಗಲೇ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ಯಾವುದೇ ಮರುಪರಿಶೀಲನೆ ಅಗತ್ಯವಿಲ್ಲ.",
    closeModal: "ಸರಿ (ಹಿಂತಿರುಗಿ)",

    stepper: ["ಸಮ್ಮತಿ", "ವಿಧಾನ", "ಮುಖ ಸ್ಕ್ಯಾನ್", "ಪೂರ್ಣ"],

    consentTitle: "ನಾಗರಿಕರ ಸಮ್ಮತಿ ಮತ್ತು ಪ್ರಮುಖ ಮಾಹಿತಿ",
    consent1: "ಸುರಕ್ಷಿತ ಗುರುತು ದೃಢೀಕರಣಕ್ಕಾಗಿ UIDAI ನ ಅಧಿಕೃತ AadhaarFaceRD ತಂತ್ರಜ್ಞಾನವನ್ನು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.",
    consent2: "ನಿಮ್ಮ ಮುಖದ ಚಿತ್ರವನ್ನು ನೇರವಾಗಿ ಅಧಿಕೃತ UIDAI ವ್ಯವಸ್ಥೆಗೆ ಮಾತ್ರ ರವಾನಿಸಲಾಗುತ್ತದೆ.",
    consent3: "ಈ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಮುಖದ ಫೋಟೋ ಅಥವಾ ಯಾವುದೇ ಬಯೋಮೆಟ್ರಿಕ್ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಿಡುವುದಿಲ್ಲ.",
    consent4: "ಪಡಿತರ ಚೀಟಿ e-KYC ಗೆ ಕಡ್ಡಾಯವಾಗಿ ಬೇಕಾದ ಕನಿಷ್ಠ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಆಹಾರ ಇಲಾಖೆಯ ತಂತ್ರಾಂಶಕ್ಕೆ ಜೋಡಿಸಲಾಗುತ್ತದೆ.",
    consent5: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ನಿಯಮಾವಳಿ ಮತ್ತು ಗೌಪ್ಯತಾ ಷರತ್ತುಗಳನ್ನು ಸಮ್ಮತಿಸುತ್ತೀರಿ.",
    consentCheck1: "ಮೇಲಿನ ಎಲ್ಲಾ ನಿಯಮಾವಳಿ ಮತ್ತು ಮಾಹಿತಿಗಳನ್ನು ನಾನು ಓದಿದ್ದೇನೆ ಮತ್ತು ಒಪ್ಪಿಕೊಂಡಿದ್ದೇನೆ.",
    consentCheck2: "AadhaarFaceRD ಮುಖಾಂತರ ನನ್ನ ಮುಖ ದೃಢೀಕರಣ ನಡೆಸಲು ನಾನು ಸ್ವಯಂಪ್ರೇರಿತ ಸಮ್ಮತಿ ನೀಡುತ್ತೇನೆ.",
    agreeContinue: "ಒಪ್ಪಿಗೆ ನೀಡಿ ಮುಂದುವರಿಸಿ",

    methodTitle: "ದೃಢೀಕರಣ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    methodSub: "ಪಡಿತರ ಚೀಟಿ e-KYC ಪೂರ್ಣಗೊಳಿಸಲು ಸೂಕ್ತ ವಿಧಾನವನ್ನು ಆರಿಸಿ:",
    methodFaceTitle: "ಆಧಾರ್ ಮುಖ ದೃಢೀಕರಣ (FaceRD)",
    methodFaceBadge: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    methodFaceProvider: "(ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾ ಮೂಲಕ)",
    methodFaceDesc: "ಯಾವುದೇ ಕಚೇರಿಗೆ ಹೋಗದೆ ತ್ವರಿತವಾಗಿ, ಸುರಕ್ಷಿತವಾಗಿ ಮತ್ತು ಸಂಪರ್ಕರಹಿತವಾಗಿ ಮುಖ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.",
    methodFpsTitle: "ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಭೇಟಿ (Fair Price Shop)",
    methodFpsBadge: "ಆಫ್‌ಲೈನ್ ವಿಧಾನ",
    methodFpsProvider: "(e-POS ಯಂತ್ರದಲ್ಲಿ ಬೆರಳಚ್ಚು ಅಥವಾ ಕಣ್ಣಿನ ಬಯೋಮೆಟ್ರಿಕ್)",
    methodFpsDesc: "ನೇರವಾಗಿ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ ಬಯೋಮೆಟ್ರಿಕ್ ನೀಡಲು ಬಯಸಿದರೆ ಈ ಆಯ್ಕೆ ಬಳಸಬಹುದು.",
    methodFpsNearbyTitle: "ಸಮೀಪದ ಯಾವುದೇ ರೇಷನ್ ಅಂಗಡಿಯಲ್ಲಿ ಮಾಡಿಸಿ",
    methodFpsNearbyText: "ನಿಮ್ಮ ಸಮೀಪದ ಯಾವುದೇ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗೆ (Fair Price Shop) ಭೇಟಿ ನೀಡಿ e-POS ಯಂತ್ರದಲ್ಲಿ ಬೆರಳಚ್ಚು ಅಥವಾ ಕಣ್ಣಿನ ಸ್ಕ್ಯಾನ್ ಮೂಲಕ e-KYC ಪೂರ್ಣಗೊಳಿಸಬಹುದು. ಈ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಕೇವಲ Aadhaar FaceRD ಮುಖ ದೃಢೀಕರಣವನ್ನು ಮಾತ್ರ ಮಾಡಲಾಗುತ್ತದೆ.",
    continueFace: "Aadhaar Face e-KYC ಮುಂದುವರಿಸಿ",
    methodNotice: "ಪ್ರಮುಖ ಮಾಹಿತಿ: ಸರ್ಕಾರದ ನಿಯಮಾವಳಿಯಂತೆ ಪಡಿತರ ಚೀಟಿ e-KYC ಗೆ ಕೇವಲ ಮೊಬೈಲ್ ಒಟಿಪಿ (OTP) ಸಾಕಾಗುವುದಿಲ್ಲ. ನೈಜ ವ್ಯಕ್ತಿ ಜೀವಂತಿಕೆ (Proof of Life) ದೃಢೀಕರಣಕ್ಕಾಗಿ ಮುಖ ಅಥವಾ ಬಯೋಮೆಟ್ರಿಕ್ ಕಡ್ಡಾಯವಾಗಿದೆ.",

    readyTitle: "ಮುಖ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮುನ್ನ ಪ್ರಮುಖ ನಿಯಮಗಳು",
    readySub: "ಉತ್ತಮ ಬೆಳಕಿರುವ ಸ್ಥಳದಲ್ಲಿ ನಿಂತು ಈ ಕೆಳಗಿನ ಚಿತ್ರಾತ್ಮಕ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ:",
    audioGuideLabel: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    playGuide: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಆಲಿಸಿ",
    stopGuide: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
    tabAll: "ಎಲ್ಲಾ ನಿಯಮಗಳು",
    tabDo: "✓ ಮಾಡಬೇಕಾದದ್ದು",
    tabDont: "✕ ಮಾಡಬಾರದದ್ದು",
    badgeDo: "ಮಾಡಬೇಕಾದದ್ದು",
    badgeDont: "ಮಾಡಬಾರದ್ದು",
    do1Title: "ಉತ್ತಮ ನೈಸರ್ಗಿಕ ಬೆಳಕು",
    do1Desc: "ಮುಖಕ್ಕೆ ಸಮನಾಗಿ ಬೆಳಕು ಬೀಳಲಿ, ಯಾವುದೇ ಕತ್ತಲೆ ಅಥವಾ ನೆರಳು ಇರಬಾರದು",
    do2Title: "ಕಣ್ಣಳತೆಯಲ್ಲಿ ಮೊಬೈಲ್",
    do2Desc: "ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾವನ್ನು ನೇರವಾಗಿ ಕಣ್ಣಿನ ಎದುರು ಹಿಡಿದು ನೋಡಿ",
    do3Title: "ನೀವು ಒಬ್ಬರೇ ಇರಿ",
    do3Desc: "ಫ್ರೇಮ್ ಒಳಗೆ ನಿಮ್ಮೊಬ್ಬರ ಮುಖ ಮಾತ್ರ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸಬೇಕು",
    do4Title: "ಸ್ವಾಭಾವಿಕ ಕಣ್ಣು ಮಿಟುಕಿಸಿ",
    do4Desc: "ಮುಖವನ್ನು ಶಾಂತವಾಗಿಟ್ಟು ಕ್ಯಾಮೆರಾ ಸೂಚಿಸಿದಾಗ ಕಣ್ಣು ಮಿಟುಕಿಸಿ",
    dont1Title: "ಮುಖ ಮುಚ್ಚುವುದು ಬೇಡ",
    dont1Desc: "ಟೋಪಿ, ಮಾಸ್ಕ್, ಕಪ್ಪು ಕನ್ನಡಕ ಅಥವಾ ಮುಖ ಮುಚ್ಚುವ ಬಟ್ಟೆ ಧರಿಸಬೇಡಿ",
    dont2Title: "ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಇತರರು ಬೇಡ",
    dont2Desc: "ಕ್ಯಾಮೆರಾ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಇತರ ವ್ಯಕ್ತಿಗಳು ಅಥವಾ ಫೋಟೋಗಳು ಇರಬಾರದು",
    dont3Title: "ಹಿಂಬೆಳಕು ಅಥವಾ ಕತ್ತಲೆ ಬೇಡ",
    dont3Desc: "ಹಿಂಬದಿಯಲ್ಲಿ ಕಿಟಕಿ ಅಥವಾ ಬಲ್ಬ್ ಇರಬಾರದು, ಮುಖ ಮಸುಕಾಗದಂತೆ ಎಚ್ಚರವಹಿಸಿ",
    dont4Title: "ಮೊಬೈಲ್ ಅಲುಗಾಡಿಸಬೇಡಿ",
    dont4Desc: "ಸ್ಕ್ಯಾನ್ ಆಗುವ ಸಮಯದಲ್ಲಿ ಫೋನ್ ಅಥವಾ ಕೈಯನ್ನು ಅಲುಗಾಡಿಸಬೇಡಿ, ಸ್ಥಿರವಾಗಿರಲಿ",
    imReady: "ನಾನು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ, ಮುಖ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",

    keepInside: "ನಿಮ್ಮ ಮುಖವನ್ನು ಹಸಿರು ವೃತ್ತದೊಳಗೆ ಇರಿಸಿ",
    capturing: "ಮುಖ ಸೆರೆಹಿಡಿಯಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಸ್ಥಿರವಾಗಿರಿ",

    verifyingTitle: "UIDAI ನೊಂದಿಗೆ ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ",
    verifyingSub: "ದಯವಿಟ್ಟು ಕೆಲವು ಕ್ಷಣ ನಿರೀಕ್ಷಿಸಿ...",
    vStep1: "ಮುಖದ ಚಿತ್ರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ",
    vStep2: "UIDAI ಅಧಿಕೃತ ಸರ್ವರ್‌ಗೆ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ",
    vStep3: "ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ...",
    vStep4: "UIDAI ನಿಂದ ಯಶಸ್ವಿ ದೃಢೀಕರಣ ಸಂದೇಶ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    vStep5: "ಕರ್ನಾಟಕ ಪಡಿತರ ದತ್ತಾಂಶದಲ್ಲಿ e-KYC ನವೀಕರಣ ಅಂತಿಮಗೊಂಡಿದೆ",
    verifyingNote: "ಈ ಪ್ರಕ್ರಿಯೆಯು ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮುಗಿಯುತ್ತದೆ. ದಯವಿಟ್ಟು ಅಪ್ಲಿಕೇಶನ್ ಮುಚ್ಚಬೇಡಿ.",

    successTitle: "e-KYC ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!",
    successSub: "ಲಕ್ಷ್ಮಿ ದೇವಿ ಅವರ ಗುರುತನ್ನು UIDAI ಯೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ. ಪಡಿತರ ಚೀಟಿ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.",
    refId: "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
    refVal: "NKYC-KA-2026-9284F",
    dateTime: "ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
    dateTimeVal: "27 ಸೆಪ್ಟೆಂಬರ್ 2026, 11:45 AM",
    service: "ಸೇವೆ",
    serviceVal: "ಪಡಿತರ ಚೀಟಿ ಆಧಾರ್ ಮುಖ e-KYC",
    status: "ಸ್ಥಿತಿ",
    statusVal: "✓ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    viewDetails: "ಕುಟುಂಬದ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    goHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",

    stageEyebrow: "Namma KYC",
    stageTitle: "ಪಡಿತರ ಚೀಟಿ e-KYC — ಆರಂಭದಿಂದ ಮುಕ್ತಾಯದವರೆಗೆ.",
    stageLede: "ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ ಸರಳ, ಸುಲಭ ಮತ್ತು ಗೌಪ್ಯತೆ-ರಕ್ಷಿತ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಸೇವೆ.",
    journeyHeading: "ನಾಗರಿಕರ ಪ್ರಯಾಣದ ಹಂತಗಳು",
    stepsList: ["ಮುಖಪುಟ", "ಸ್ವಾಗತ", "ಪಡಿತರ ಚೀಟಿ", "ಸಮ್ಮತಿ", "ವಿಧಾನ", "ಮಾರ್ಗದರ್ಶಿ", "ಸ್ಕ್ಯಾನ್", "ಪರಿಶೀಲನೆ", "ಪೂರ್ಣ"],

    footerTitle: "Namma KYC",
    footerSub: "ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಸುಲಭ ಡಿಜಿಟಲ್ ಸೇವೆ.",
    badgeGov: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಸೇವೆ",
    badgeGovSub: "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ",
    badgeUidai: "UIDAI ಅಧಿಕೃತ ತಂತ್ರಜ್ಞಾನ",
    badgeUidaiSub: "AadhaarFaceRD ಮುಖ ದೃಢೀಕರಣ",
    badgePrivacy: "ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ",
    badgePrivacySub: "ಯಾವುದೇ ಬಯೋಮೆಟ್ರಿಕ್ ಸಂಗ್ರಹವಿಲ್ಲ",
    badgeCitizen: "ಜನಹಿತ ಸೇವೆ",
    badgeCitizenSub: "ಸಶಕ್ತ ಕರ್ನಾಟಕಕ್ಕಾಗಿ"
  }
};

let currentLang = "en";
let currentStep = 0; // 0: Splash, 1: Welcome, 2: Ration, 3: Consent, 4: Method, 5: Guide, 6: Capture, 7: Verify, 8: Success
let consentRead = false;
let consentProceed = false;
let selectedMethod = "face"; // "face" or "fps"
let isAudioPlaying = false;
let activeAudio = null;
let dodontTab = "all"; // "all", "do", "dont"
let viewingKycDoneMember = null; // null | "suresh" | "ramesh" | "lakshmi" | "deepa"
let activeMemberToVerify = "lakshmi"; // "lakshmi" | "deepa"
let showFpsNotice = false;
let completedMembers = new Set(["suresh", "ramesh"]);

const t = () => I18N[currentLang];

/* Helper Icons & Animated SVG Pictograms */
const ICONS = {
  people: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  access: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  leaf: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 13-4c1.5 3 1.5 7-1 9l-5 2Z"/><path d="M11 20V10"/></svg>`,
  card: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10h10M7 14h6"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  lock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  speed: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>`,
  faceScan: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/><circle cx="12" cy="12" r="3"/><path d="M12 17a5 5 0 0 0 4-2"/></svg>`,
  shop: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`,
  info: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,

  // Animated / Pictorial SVG Illustrations for Instructions
  picLight: `
    <div class="pictogram-frame do-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#eaf6ee" />
        <g class="rotating-rays">
          <line x1="32" y1="8" x2="32" y2="12" stroke="#13824f" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="32" y1="52" x2="32" y2="56" stroke="#13824f" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="8" y1="32" x2="12" y2="32" stroke="#13824f" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="52" y1="32" x2="56" y2="32" stroke="#13824f" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="15" x2="18" y2="18" stroke="#13824f" stroke-width="2" stroke-linecap="round"/>
          <line x1="46" y1="46" x2="49" y2="49" stroke="#13824f" stroke-width="2" stroke-linecap="round"/>
          <line x1="15" y1="49" x2="18" y2="46" stroke="#13824f" stroke-width="2" stroke-linecap="round"/>
          <line x1="46" y1="18" x2="49" y2="15" stroke="#13824f" stroke-width="2" stroke-linecap="round"/>
        </g>
        <circle cx="32" cy="28" r="10" fill="#13824f" />
        <path d="M20 48c0-7 5.5-12 12-12s12 5 12 12" fill="#13824f" opacity="0.8"/>
        <circle cx="46" cy="18" r="7" fill="#22c55e" />
        <path d="M43 18l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    </div>
  `,
  picEyeLevel: `
    <div class="pictogram-frame do-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#eaf6ee" />
        <rect x="22" y="16" width="20" height="32" rx="4" fill="none" stroke="#0d4a36" stroke-width="2.5" />
        <line x1="28" y1="44" x2="36" y2="44" stroke="#0d4a36" stroke-width="2" stroke-linecap="round"/>
        <circle class="pulsing-reticle" cx="32" cy="28" r="5" fill="none" stroke="#13824f" stroke-width="2" stroke-dasharray="3 2" />
        <circle cx="32" cy="28" r="1.5" fill="#13824f" />
        <circle cx="48" cy="18" r="7" fill="#22c55e" />
        <path d="M45 18l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    </div>
  `,
  picSinglePerson: `
    <div class="pictogram-frame do-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#eaf6ee" />
        <rect x="18" y="14" width="28" height="36" rx="6" fill="none" stroke="#13824f" stroke-width="1.8" stroke-dasharray="4 2" />
        <circle cx="32" cy="26" r="7" fill="#0d4a36" />
        <path d="M22 46c0-6 4.5-10 10-10s10 4 10 10" fill="#0d4a36" />
        <circle cx="48" cy="18" r="7" fill="#22c55e" />
        <path d="M45 18l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    </div>
  `,
  picBlink: `
    <div class="pictogram-frame do-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#eaf6ee" />
        <circle cx="32" cy="32" r="18" fill="#ffffff" stroke="#13824f" stroke-width="2"/>
        <g class="animated-eyelids">
          <ellipse cx="26" cy="30" rx="3.5" ry="2" fill="#0d4a36"/>
          <ellipse cx="38" cy="30" rx="3.5" ry="2" fill="#0d4a36"/>
        </g>
        <path d="M27 38c2 2 8 2 10 0" stroke="#0d4a36" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="48" cy="18" r="7" fill="#22c55e" />
        <path d="M45 18l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    </div>
  `,
  picNoCover: `
    <div class="pictogram-frame dont-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#feebe9" />
        <circle cx="32" cy="28" r="9" fill="#7f1d1d" opacity="0.3"/>
        <path d="M20 22c3-4 8-6 12-6s9 2 12 6l-24 0z" fill="#dc2626"/>
        <rect x="25" y="27" width="14" height="6" rx="3" fill="#dc2626"/>
        <circle cx="48" cy="18" r="7" fill="#dc2626" />
        <path d="M45 15l6 6M51 15l-6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="48" x2="48" y2="16" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  `,
  picNoMultiple: `
    <div class="pictogram-frame dont-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#feebe9" />
        <circle cx="26" cy="28" r="7" fill="#7f1d1d" opacity="0.4"/>
        <path d="M16 48c0-5 4-8 10-8s10 3 10 8" fill="#7f1d1d" opacity="0.4"/>
        <circle cx="40" cy="24" r="6" fill="#dc2626" opacity="0.6"/>
        <path d="M32 44c0-4 3-7 8-7s8 3 8 7" fill="#dc2626" opacity="0.6"/>
        <circle cx="48" cy="18" r="7" fill="#dc2626" />
        <path d="M45 15l6 6M51 15l-6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="48" x2="48" y2="16" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  `,
  picNoBacklight: `
    <div class="pictogram-frame dont-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#feebe9" />
        <rect x="18" y="16" width="28" height="32" fill="#fde047" stroke="#ca8a04" stroke-width="1.5" />
        <line x1="32" y1="16" x2="32" y2="48" stroke="#ca8a04" stroke-width="1.5"/>
        <line x1="18" y1="32" x2="46" y2="32" stroke="#ca8a04" stroke-width="1.5"/>
        <circle cx="32" cy="34" r="8" fill="#000000" />
        <circle cx="48" cy="18" r="7" fill="#dc2626" />
        <path d="M45 15l6 6M51 15l-6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="48" x2="48" y2="16" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  `,
  picNoShake: `
    <div class="pictogram-frame dont-frame">
      <svg class="pictogram-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#feebe9" />
        <g class="vibrating-phone">
          <rect x="24" y="18" width="16" height="28" rx="3" fill="none" stroke="#7f1d1d" stroke-width="2" />
          <path d="M16 26c-2 3-2 9 0 12M48 26c2 3 2 9 0 12" stroke="#dc2626" stroke-width="2" stroke-linecap="round" fill="none"/>
        </g>
        <circle cx="48" cy="18" r="7" fill="#dc2626" />
        <path d="M45 15l6 6M51 15l-6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="16" y1="48" x2="48" y2="16" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  `
};

function render() {
  const s = t();

  // Update Document & Head Title
  document.title = s.pageTitle;

  // Outer stage copy
  const elDemoBadge = document.getElementById("demo-badge");
  if (elDemoBadge) elDemoBadge.textContent = s.bannerBadge;
  const elDemoMode = document.getElementById("demo-mode");
  if (elDemoMode) elDemoMode.textContent = s.bannerText;
  const elBannerBoundary = document.getElementById("banner-boundary");
  if (elBannerBoundary) elBannerBoundary.textContent = s.bannerSub;

  const elStageEyebrow = document.getElementById("stage-eyebrow");
  if (elStageEyebrow) elStageEyebrow.textContent = s.stageEyebrow;
  const elStageTitle = document.getElementById("stage-title");
  if (elStageTitle) elStageTitle.textContent = s.stageTitle;
  const elStageLede = document.getElementById("stage-lede");
  if (elStageLede) elStageLede.textContent = s.stageLede;
  const elJourneyTitle = document.getElementById("journey-title");
  if (elJourneyTitle) elJourneyTitle.textContent = s.journeyHeading;
  const elStart = document.getElementById("start");
  if (elStart) elStart.textContent = s.getStarted + " →";
  const elReset = document.getElementById("reset");
  if (elReset) elReset.textContent = s.reset;

  // Render bottom journey steps
  const elSteps = document.getElementById("steps");
  if (elSteps) {
    elSteps.innerHTML = s.stepsList.map((name, idx) => `
      <button class="demo-step-btn ${idx === currentStep ? "active" : ""}" data-step="${idx}">
        <span>${idx + 1}. ${name}</span>
      </button>
    `).join("");
    elSteps.querySelectorAll(".demo-step-btn").forEach(btn => {
      btn.onclick = () => {
        stopAudioPlayback();
        viewingKycDoneMember = null;
        currentStep = Number(btn.dataset.step);
        render();
      };
    });
  }

  // Render Phone Header
  const elAppTop = document.getElementById("app-top");
  if (elAppTop) {
    if (currentStep === 0) {
      elAppTop.innerHTML = "";
      elAppTop.style.display = "none";
    } else {
      elAppTop.style.display = "flex";
      elAppTop.innerHTML = `
        <button class="app-top-back" id="back-nav-btn" aria-label="Back">←</button>
        <span class="app-top-title">${s.app}</span>
        <button class="app-top-lang" id="top-lang-btn">🌐 ${s.langCode}</button>
      `;
      const elBack = document.getElementById("back-nav-btn");
      if (elBack) elBack.onclick = () => {
        stopAudioPlayback();
        if (viewingKycDoneMember) {
          viewingKycDoneMember = null;
          render();
          return;
        }
        if (currentStep > 0) {
          currentStep--;
          render();
        }
      };
      const elTopLang = document.getElementById("top-lang-btn");
      if (elTopLang) elTopLang.onclick = toggleLanguage;
    }
  }

  // Render Stepper Bar (steps 3 to 8)
  const elStepper = document.getElementById("stepper-bar");
  if (elStepper) {
    if (currentStep >= 3 && currentStep <= 8) {
      elStepper.style.display = "flex";
      let activeIndex = 0; // 0: Consent, 1: Method, 2: Face Scan, 3: Complete
      if (currentStep === 3) activeIndex = 0;
      else if (currentStep === 4) activeIndex = 1;
      else if (currentStep >= 5 && currentStep <= 7) activeIndex = 2;
      else if (currentStep >= 8) activeIndex = 3;

      elStepper.innerHTML = s.stepper.map((stepName, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        return `
          <div class="step-node ${isActive ? "active" : ""} ${isDone ? "done" : ""}">
            <div class="step-circle">${isDone ? "✓" : i + 1}</div>
            <span class="step-label">${stepName}</span>
          </div>
          ${i < 3 ? `<div class="step-connector ${isDone ? "done" : ""}"></div>` : ""}
        `;
      }).join("");
    } else {
      elStepper.style.display = "none";
      elStepper.innerHTML = "";
    }
  }

  // Render Screen Body
  const elScreen = document.getElementById("screen");
  if (elScreen) {
    elScreen.scrollTop = 0;
    elScreen.innerHTML = getScreenHtml(s);
    wireScreenEvents();
  }

  // Update Footer Trust Badges
  updateFooterBadges(s);
}

function updateFooterBadges(s) {
  const brandEl = document.querySelector(".trust-brand-copy");
  if (brandEl) {
    brandEl.innerHTML = `
      <b>${s.footerTitle}</b>
      <p>${s.footerSub}</p>
    `;
  }
  const badgesGrid = document.querySelector(".trust-badges-grid");
  if (badgesGrid) {
    badgesGrid.innerHTML = `
      <div class="trust-badge-item">
        <div class="trust-badge-icon">✓</div>
        <div>
          <span>${s.badgeGov}</span>
          <small style="display:block;color:var(--text-muted);font-size:10px;">${s.badgeGovSub}</small>
        </div>
      </div>
      <div class="trust-badge-item">
        <div class="trust-badge-icon">🔒</div>
        <div>
          <span>${s.badgeUidai}</span>
          <small style="display:block;color:var(--text-muted);font-size:10px;">${s.badgeUidaiSub}</small>
        </div>
      </div>
      <div class="trust-badge-item">
        <div class="trust-badge-icon">🛡️</div>
        <div>
          <span>${s.badgePrivacy}</span>
          <small style="display:block;color:var(--text-muted);font-size:10px;">${s.badgePrivacySub}</small>
        </div>
      </div>
      <div class="trust-badge-item">
        <div class="trust-badge-icon">👥</div>
        <div>
          <span>${s.badgeCitizen}</span>
          <small style="display:block;color:var(--text-muted);font-size:10px;">${s.badgeCitizenSub}</small>
        </div>
      </div>
    `;
  }
}

function getScreenHtml(s) {
  // Screen 0: Splash Screen
  if (currentStep === 0) {
    return `
      <div class="splash-container">
        <div class="splash-header-row">
          <img class="splash-emblem" src="${ASSETS.emblem}" alt="${s.gov}" />
          <button class="splash-lang-btn" id="splash-lang-toggle">🌐 ${s.langBtn}</button>
        </div>
        <div class="splash-gov-title">${s.gov}</div>
        <div class="splash-brand">
          <h1>${s.app}</h1>
          <div class="splash-brand-dot"></div>
        </div>
        <p class="splash-tagline">${s.tagline}</p>
        <div class="soudha-frame">
          <img class="soudha-photo" src="${ASSETS.soudha}" alt="Vidhana Soudha, Bengaluru" />
        </div>
        <div class="splash-values-strip">
          <div class="value-item">
            <div class="value-icon-circle">${ICONS.people}</div>
            <span>${s.peopleFirst}</span>
          </div>
          <div class="value-item">
            <div class="value-icon-circle">${ICONS.access}</div>
            <span>${s.simpleAccess}</span>
          </div>
          <div class="value-item">
            <div class="value-icon-circle">${ICONS.leaf}</div>
            <span>${s.digitalKarnataka}</span>
          </div>
        </div>
        <div class="splash-actions">
          <button class="primary-btn" id="splash-start-btn">${s.getStarted} →</button>
        </div>
        <div class="splash-disclosure">
          <svg class="karnataka-map-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 5 6 9 6 13c0 4 3 8 6 9 3-1 6-5 6-9 0-4-2-8-6-9z"/></svg>
          <span>${currentLang === "kn" ? "ಸ್ವತಂತ್ರ ಓಪನ್-ಸೋರ್ಸ್ ನಾಗರಿಕ ಉಲ್ಲೇಖ ನಿರ್ಮಾಣ" : "Independent open-source citizen reference build"}</span>
        </div>
      </div>
    `;
  }

  // Screen 1: Welcome Screen
  if (currentStep === 1) {
    return `
      <div class="screen-card welcome-card">
        <div class="welcome-header">
          <div class="welcome-progress-dots">
            <i class="active"></i><i></i><i></i>
          </div>
          <h2>${s.welcome}</h2>
          <p class="screen-desc">${s.welcomeSub}</p>
        </div>

        <div class="family-art-wrapper">
          <img class="family-art-img" src="${ASSETS.family}" alt="Karnataka Family illustration" />
          <div class="family-art-badge">
            <span>👨‍👩‍👧‍👦 ${currentLang === "kn" ? "ಪಡಿತರ ಕುಟುಂಬ e-KYC" : "Family Ration e-KYC"}</span>
          </div>
        </div>

        <div class="feature-card-list">
          <div class="feature-box">
            <div class="feature-box-icon orange">${ICONS.card}</div>
            <div class="feature-box-copy">
              <b>${s.feat1Title}</b>
              <small>${s.feat1Text}</small>
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon green">${ICONS.shield}</div>
            <div class="feature-box-copy">
              <b>${s.feat2Title}</b>
              <small>${s.feat2Text}</small>
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon gold">${ICONS.lock}</div>
            <div class="feature-box-copy">
              <b>${s.feat3Title}</b>
              <small>${s.feat3Text}</small>
            </div>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon blue">${ICONS.speed}</div>
            <div class="feature-box-copy">
              <b>${s.feat4Title}</b>
              <small>${s.feat4Text}</small>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" id="welcome-continue-btn">${s.continue} →</button>
        </div>
      </div>
    `;
  }

  // Screen 2: Ration Card & Household Members (with KYC Done inspection)
  if (currentStep === 2) {
    if (viewingKycDoneMember) {
      return getKycDoneModalHtml(s, viewingKycDoneMember);
    }

    const isLakshmiCompleted = completedMembers.has("lakshmi");
    const isDeepaCompleted = completedMembers.has("deepa");

    let continueBtnText = s.continue + " →";
    if (!isLakshmiCompleted) {
      continueBtnText = currentLang === "kn" ? "ಲಕ್ಷ್ಮಿ ದೇವಿ ಅವರ e-KYC ಮುಂದುವರಿಸಿ →" : "Verify Lakshmi Devi →";
    } else if (!isDeepaCompleted) {
      continueBtnText = currentLang === "kn" ? "ದೀಪಾ ಕುಮಾರ್ ಅವರ e-KYC ಮುಂದುವರಿಸಿ →" : "Verify Deepa Kumar →";
    }

    return `
      <div class="screen-card member-screen-card">
        <div class="member-screen-header">
          <h2>${s.rationTitle}</h2>
          <p class="screen-desc">${s.rationSub}</p>
        </div>

        <div class="ration-card-banner">
          <div class="ration-card-header-row">
            <span class="ration-chip">${s.cardNumberLabel}</span>
            <span class="ration-type-badge">${s.cardType}</span>
          </div>
          <div class="ration-number-display">${s.demoCardNumber}</div>
        </div>

        <div class="member-list-heading">
          <span>${s.familyMembersList}</span>
          <button class="reset-status-btn" id="reset-members-btn" title="Reset members to test all options">
            ↺ ${s.resetMembersBtn || (currentLang === "kn" ? "ಮರುಹೊಂದಿಸಿ" : "Reset Demo")}
          </button>
        </div>

        <div class="member-list">
          <!-- Member 1: Suresh Kumar (KYC Completed) -->
          <div class="member-card completed" id="member-suresh-card" role="button" tabindex="0">
            <div class="member-avatar done">✓</div>
            <div class="member-info">
              <div class="member-name-row">
                <b>${currentLang === "kn" ? "ಸುರೇಶ್ ಕುಮಾರ್" : "Suresh Kumar"}</b>
                <span class="member-rel">(${s.memberHead})</span>
              </div>
              <small class="member-status-text done">${s.kycCompletedBadge} · ${s.tapToViewStatus}</small>
            </div>
            <span class="member-action-badge done">✓ ${currentLang === "kn" ? "ವಿವರ" : "View"}</span>
          </div>

          <!-- Member 2: Lakshmi Devi (Pending or Completed) -->
          <div class="member-card ${isLakshmiCompleted ? "completed" : "pending-action"}" id="member-lakshmi-card" role="button" tabindex="0">
            <div class="member-avatar ${isLakshmiCompleted ? "done" : "pending"}">${isLakshmiCompleted ? "✓" : "L"}</div>
            <div class="member-info">
              <div class="member-name-row">
                <b>${currentLang === "kn" ? "ಲಕ್ಷ್ಮಿ ದೇವಿ" : "Lakshmi Devi"}</b>
                <span class="member-rel">(${s.memberWife})</span>
              </div>
              <small class="member-status-text ${isLakshmiCompleted ? "done" : "pending"}">
                ${isLakshmiCompleted ? `${s.kycCompletedBadge} · ${s.tapToViewStatus}` : `⚠️ ${s.kycRequiredBadge}`}
              </small>
            </div>
            <span class="member-action-badge ${isLakshmiCompleted ? "done" : "action"}">
              ${isLakshmiCompleted ? (currentLang === "kn" ? "ವಿವರ" : "View") : (currentLang === "kn" ? "ಪ್ರಾರಂಭಿಸಿ →" : "Verify →")}
            </span>
          </div>

          <!-- Member 3: Ramesh Kumar (KYC Completed) -->
          <div class="member-card completed" id="member-ramesh-card" role="button" tabindex="0">
            <div class="member-avatar done">✓</div>
            <div class="member-info">
              <div class="member-name-row">
                <b>${currentLang === "kn" ? "ರಮೇಶ್ ಕುಮಾರ್" : "Ramesh Kumar"}</b>
                <span class="member-rel">(${s.memberSon})</span>
              </div>
              <small class="member-status-text done">${s.kycCompletedBadge} · ${s.tapToViewStatus}</small>
            </div>
            <span class="member-action-badge done">✓ ${currentLang === "kn" ? "ವಿವರ" : "View"}</span>
          </div>

          <!-- Member 4: Deepa Kumar (KYC Pending - Always stays pending to test all options!) -->
          <div class="member-card ${isDeepaCompleted ? "completed" : "pending-action"}" id="member-deepa-card" role="button" tabindex="0">
            <div class="member-avatar ${isDeepaCompleted ? "done" : "pending"}">${isDeepaCompleted ? "✓" : "D"}</div>
            <div class="member-info">
              <div class="member-name-row">
                <b>${currentLang === "kn" ? "ದೀಪಾ ಕುಮಾರ್" : "Deepa Kumar"}</b>
                <span class="member-rel">(${s.memberDaughter})</span>
              </div>
              <small class="member-status-text ${isDeepaCompleted ? "done" : "pending"}">
                ${isDeepaCompleted ? `${s.kycCompletedBadge} · ${s.tapToViewStatus}` : `⚠️ ${s.kycRequiredBadge}`}
              </small>
            </div>
            <span class="member-action-badge ${isDeepaCompleted ? "done" : "action"}">
              ${isDeepaCompleted ? (currentLang === "kn" ? "ವಿವರ" : "View") : (currentLang === "kn" ? "ಪ್ರಾರಂಭಿಸಿ →" : "Verify →")}
            </span>
          </div>
        </div>

        <div class="ration-helper-note">
          <span>ℹ</span>
          <span>${s.selectMemberPrompt}</span>
        </div>

        <div class="actions">
          <button class="primary-btn" id="ration-continue-btn">
            ${continueBtnText}
          </button>
        </div>
      </div>
    `;
  }

  // Screen 3: Consent & Information
  if (currentStep === 3) {
    return `
      <div class="screen-card">
        <h2>${s.consentTitle}</h2>
        
        <div class="consent-list-container">
          <div class="consent-statement">
            <div class="consent-icon">${ICONS.faceScan}</div>
            <span>${s.consent1}</span>
          </div>
          <div class="consent-statement">
            <div class="consent-icon">${ICONS.shield}</div>
            <span>${s.consent2}</span>
          </div>
          <div class="consent-statement">
            <div class="consent-icon">${ICONS.lock}</div>
            <span>${s.consent3}</span>
          </div>
          <div class="consent-statement">
            <div class="consent-icon">${ICONS.card}</div>
            <span>${s.consent4}</span>
          </div>
          <div class="consent-statement">
            <div class="consent-icon">${ICONS.leaf}</div>
            <span>${s.consent5}</span>
          </div>
        </div>

        <div class="checkbox-row" id="check-read-row">
          <div class="check-square ${consentRead ? "checked" : ""}">
            ${consentRead ? ICONS.check : ""}
          </div>
          <span>${s.consentCheck1}</span>
        </div>

        <div class="checkbox-row" id="check-proceed-row">
          <div class="check-square ${consentProceed ? "checked" : ""}">
            ${consentProceed ? ICONS.check : ""}
          </div>
          <span>${s.consentCheck2}</span>
        </div>

        <div class="actions">
          <button class="primary-btn" id="consent-continue-btn" ${(!consentRead || !consentProceed) ? "disabled" : ""}>
            ${s.agreeContinue} →
          </button>
        </div>
      </div>
    `;
  }

  // Screen 4: Select Biometric Verification Method (Authentic PDS Options)
  if (currentStep === 4) {
    return `
      <div class="screen-card">
        <div>
          <h2>${s.methodTitle}</h2>
          <p class="screen-desc">${s.methodSub}</p>
        </div>

        <div class="choice-cards-container">
          <!-- Method 1: FaceRD (The ONLY active/selectable method in this mobile app) -->
          <div class="method-choice-card selected" id="choose-face-card">
            <div class="method-icon-box">${ICONS.faceScan}</div>
            <div class="method-copy">
              <div class="method-title-row">
                <b>${s.methodFaceTitle}</b>
                <span class="badge-recommended">${s.methodFaceBadge}</span>
              </div>
              <small class="method-provider">${s.methodFaceProvider}</small>
              <small>${s.methodFaceDesc}</small>
            </div>
            <div class="radio-indicator">
              ${ICONS.check}
            </div>
          </div>

          <!-- Method 2: Fair Price Shop Biometric (Informational fallback / unselectable in mobile app) -->
          <div class="method-choice-card unselectable ${showFpsNotice ? "fps-highlight" : ""}" id="choose-fps-card" role="button" tabindex="0">
            <div class="method-icon-box" style="background:#f1f5f9; color:#475569;">${ICONS.shop}</div>
            <div class="method-copy">
              <div class="method-title-row">
                <b>${s.methodFpsTitle}</b>
                <span class="badge-offline">${s.methodFpsBadge}</span>
              </div>
              <small class="method-provider">${s.methodFpsProvider}</small>
              <small>${s.methodFpsDesc}</small>
            </div>
            <div class="radio-indicator info-indicator" title="${currentLang === "kn" ? "ಮಾಹಿತಿ" : "Info"}">
              ${ICONS.info}
            </div>
          </div>

          <!-- Nearby FPS Guidance Banner (revealed when FPS card is tapped or toggled) -->
          ${showFpsNotice ? `
            <div class="fps-nearby-callout">
              <div class="fps-callout-header">
                <span>🏪</span>
                <b>${s.methodFpsNearbyTitle}</b>
              </div>
              <p>${s.methodFpsNearbyText}</p>
              <small class="fps-callout-note">✓ ${currentLang === "kn" ? "ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಮುಂದುವರಿಯಲು ಕೆಳಗಿನ ಮುಖ e-KYC ಬಟನ್ ಒತ್ತಿ" : "To proceed in this app with Aadhaar FaceRD, tap below"}</small>
            </div>
          ` : `
            <div class="fps-hint-tap" id="fps-hint-link">
              <span>🏪 ${currentLang === "kn" ? "ರೇಷನ್ ಅಂಗಡಿ e-KYC ಮಾಹಿತಿ ಪಡೆಯಲು ಟ್ಯಾಪ್ ಮಾಡಿ" : "Tap here to view nearby ration shop instructions"}</span>
            </div>
          `}
        </div>

        <div class="info-callout">
          <span>ℹ</span>
          <div>${s.methodNotice}</div>
        </div>

        <div class="actions">
          <button class="primary-btn" id="method-continue-btn">${s.continueFace || s.continue} →</button>
        </div>
      </div>
    `;
  }

  // Screen 5: Face Authentication Preparation — Rich Animated & Pictorial Instructions
  if (currentStep === 5) {
    const showDos = dodontTab === "all" || dodontTab === "do";
    const showDonts = dodontTab === "all" || dodontTab === "dont";
    return `
      <div class="screen-card">
        <h2>${s.readyTitle}</h2>
        <p class="screen-desc">${s.readySub}</p>

        <div class="guide-header-strip">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="sound-wave-icon">🔊</span>
            <span style="font-size:12.5px;font-weight:800;color:var(--text);">${s.audioGuideLabel}</span>
          </div>
          <button class="guide-audio-btn ${isAudioPlaying ? "playing" : ""}" id="audio-guide-btn">
            ${isAudioPlaying ? `
              <div class="audio-wave">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              ${s.stopGuide}
            ` : `
              ▶ ${s.playGuide}
            `}
          </button>
        </div>

        <div class="dodont-filter-tabs">
          <button class="dodont-tab ${dodontTab === "all" ? "active" : ""}" id="tab-all-btn">${s.tabAll}</button>
          <button class="dodont-tab ${dodontTab === "do" ? "active" : ""}" id="tab-do-btn">${s.tabDo}</button>
          <button class="dodont-tab ${dodontTab === "dont" ? "active" : ""}" id="tab-dont-btn">${s.tabDont}</button>
        </div>

        <div class="dodont-grid">
          ${showDos ? `
            <!-- DO 1: Good Lighting -->
            <div class="dodont-card do">
              <div class="dodont-card-top">
                ${ICONS.picLight}
                <span class="dodont-badge do">✓ ${s.badgeDo}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.do1Title}</b>
                <small>${s.do1Desc}</small>
              </div>
            </div>

            <!-- DO 2: Camera at Eye Level -->
            <div class="dodont-card do">
              <div class="dodont-card-top">
                ${ICONS.picEyeLevel}
                <span class="dodont-badge do">✓ ${s.badgeDo}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.do2Title}</b>
                <small>${s.do2Desc}</small>
              </div>
            </div>

            <!-- DO 3: Single Person Only -->
            <div class="dodont-card do">
              <div class="dodont-card-top">
                ${ICONS.picSinglePerson}
                <span class="dodont-badge do">✓ ${s.badgeDo}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.do3Title}</b>
                <small>${s.do3Desc}</small>
              </div>
            </div>

            <!-- DO 4: Blink Naturally -->
            <div class="dodont-card do">
              <div class="dodont-card-top">
                ${ICONS.picBlink}
                <span class="dodont-badge do">✓ ${s.badgeDo}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.do4Title}</b>
                <small>${s.do4Desc}</small>
              </div>
            </div>
          ` : ""}

          ${showDonts ? `
            <!-- DON'T 1: No Face Coverings -->
            <div class="dodont-card dont">
              <div class="dodont-card-top">
                ${ICONS.picNoCover}
                <span class="dodont-badge dont">✕ ${s.badgeDont}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.dont1Title}</b>
                <small>${s.dont1Desc}</small>
              </div>
            </div>

            <!-- DON'T 2: No Multiple People -->
            <div class="dodont-card dont">
              <div class="dodont-card-top">
                ${ICONS.picNoMultiple}
                <span class="dodont-badge dont">✕ ${s.badgeDont}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.dont2Title}</b>
                <small>${s.dont2Desc}</small>
              </div>
            </div>

            <!-- DON'T 3: No Backlight or Dark -->
            <div class="dodont-card dont">
              <div class="dodont-card-top">
                ${ICONS.picNoBacklight}
                <span class="dodont-badge dont">✕ ${s.badgeDont}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.dont3Title}</b>
                <small>${s.dont3Desc}</small>
              </div>
            </div>

            <!-- DON'T 4: Do Not Shake Mobile -->
            <div class="dodont-card dont">
              <div class="dodont-card-top">
                ${ICONS.picNoShake}
                <span class="dodont-badge dont">✕ ${s.badgeDont}</span>
              </div>
              <div class="dodont-card-copy">
                <b>${s.dont4Title}</b>
                <small>${s.dont4Desc}</small>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="actions">
          <button class="primary-btn" id="guide-ready-btn">${s.imReady} →</button>
        </div>
      </div>
    `;
  }

  // Screen 6: Face Capture Simulation
  if (currentStep === 6) {
    return `
      <div class="screen-card" style="padding:14px;">
        <div class="camera-viewfinder">
          <img class="camera-bg-image" src="${ASSETS.face}" alt="Citizen face" />
          <div class="camera-scanline"></div>
          <div class="camera-top-pill">
            <span>👁</span>
            <span>${s.keepInside}</span>
          </div>
          <div class="camera-face-bracket"></div>
          <div class="camera-bottom-status">
            <div class="capture-spinner"></div>
            <span>${s.capturing}</span>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" id="capture-advance-btn">${s.continue} →</button>
        </div>
      </div>
    `;
  }

  // Screen 7: Verifying Identity (UIDAI Verification Stage)
  if (currentStep === 7) {
    return `
      <div class="screen-card">
        <div class="verifying-container">
          <div class="pulsing-radar">
            <div class="radar-ring r1"></div>
            <div class="radar-ring r2"></div>
            <div class="pulsing-radar-icon">${ICONS.faceScan}</div>
          </div>
          <h2>${s.verifyingTitle}</h2>
          <p class="screen-desc" style="margin-bottom:8px;">${s.verifyingSub}</p>

          <div class="timeline-verification">
            <div class="v-timeline-row done">
              <div class="v-dot">✓</div>
              <span>${s.vStep1}</span>
            </div>
            <div class="v-timeline-row done">
              <div class="v-dot">✓</div>
              <span>${s.vStep2}</span>
            </div>
            <div class="v-timeline-row active">
              <div class="v-dot">•</div>
              <span>${s.vStep3}</span>
            </div>
            <div class="v-timeline-row">
              <div class="v-dot">○</div>
              <span>${s.vStep4}</span>
            </div>
            <div class="v-timeline-row">
              <div class="v-dot">○</div>
              <span>${s.vStep5}</span>
            </div>
          </div>

          <div class="info-callout" style="width:100%;text-align:left;">
            <span>ℹ</span>
            <span>${s.verifyingNote}</span>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" id="verify-continue-btn">${s.continue} →</button>
        </div>
      </div>
    `;
  }

  // Screen 8: e-KYC Completed Successfully!
  const memberNameSuccess = activeMemberToVerify === "deepa" 
    ? (currentLang === "kn" ? "ದೀಪಾ ಕುಮಾರ್" : "Deepa Kumar") 
    : (currentLang === "kn" ? "ಲಕ್ಷ್ಮಿ ದೇವಿ" : "Lakshmi Devi");
  const subtitleSuccess = currentLang === "kn"
    ? `${memberNameSuccess} ಅವರ ಗುರುತನ್ನು UIDAI ಯೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ. ಪಡಿತರ ಚೀಟಿ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.`
    : `${memberNameSuccess}'s identity has been successfully authenticated with UIDAI. Ration card records updated.`;

  return `
    <div class="screen-card">
      <div class="completion-container">
        <div class="celebration-badge">
          <div class="confetti-layer">
            <span class="confetti-piece"></span>
            <span class="confetti-piece"></span>
            <span class="confetti-piece"></span>
            <span class="confetti-piece"></span>
          </div>
          <div class="success-check-circle">✓</div>
        </div>
        <h2>${s.successTitle}</h2>
        <p class="screen-desc">${subtitleSuccess}</p>

        <div class="details-card-box">
          <div class="detail-line">
            <small>${s.refId}</small>
            <code>${s.refVal}</code>
          </div>
          <div class="detail-line">
            <small>${s.dateTime}</small>
            <b>${s.dateTimeVal}</b>
          </div>
          <div class="detail-line">
            <small>${s.service}</small>
            <b>${s.serviceVal}</b>
          </div>
          <div class="detail-line">
            <small>${s.status}</small>
            <span class="badge-completed">${s.statusVal}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="primary-btn" id="success-view-btn">${s.viewDetails}</button>
        <button class="secondary-btn" id="success-home-btn">${s.goHome}</button>
      </div>
    </div>
  `;
}

// Modal view when citizen clicks on a member whose KYC is already done
function getKycDoneModalHtml(s, memberKey) {
  let memberName = "";
  let memberRel = "";
  let aadhaarMask = "XXXX-XXXX-8421";
  let vDate = "12 Aug 2024, 11:20 AM";

  if (memberKey === "suresh") {
    memberName = currentLang === "kn" ? "ಸುರೇಶ್ ಕುಮಾರ್" : "Suresh Kumar";
    memberRel = s.memberHead;
    aadhaarMask = "XXXX-XXXX-8421";
    vDate = currentLang === "kn" ? "12 ಆಗಸ್ಟ್ 2024, ಬೆಳಗ್ಗೆ 11:20" : "12 Aug 2024, 11:20 AM";
  } else if (memberKey === "ramesh") {
    memberName = currentLang === "kn" ? "ರಮೇಶ್ ಕುಮಾರ್" : "Ramesh Kumar";
    memberRel = s.memberSon;
    aadhaarMask = "XXXX-XXXX-9104";
    vDate = currentLang === "kn" ? "20 ಜನವರಿ 2025, ಮಧ್ಯಾಹ್ನ 02:45" : "20 Jan 2025, 02:45 PM";
  } else if (memberKey === "deepa") {
    memberName = currentLang === "kn" ? "ದೀಪಾ ಕುಮಾರ್" : "Deepa Kumar";
    memberRel = s.memberDaughter;
    aadhaarMask = "XXXX-XXXX-6238";
    vDate = currentLang === "kn" ? "28 ಸೆಪ್ಟೆಂಬರ್ 2026, ಮಧ್ಯಾಹ್ನ 12:15" : "28 Sep 2026, 12:15 PM";
  } else {
    memberName = currentLang === "kn" ? "ಲಕ್ಷ್ಮಿ ದೇವಿ" : "Lakshmi Devi";
    memberRel = s.memberWife;
    aadhaarMask = "XXXX-XXXX-4819";
    vDate = currentLang === "kn" ? "27 ಸೆಪ್ಟೆಂಬರ್ 2026, ಬೆಳಗ್ಗೆ 11:45" : "27 Sep 2026, 11:45 AM";
  }

  return `
    <div class="screen-card kyc-done-card">
      <div class="kyc-done-header">
        <div class="kyc-done-shield">✓</div>
        <span class="kyc-done-badge-pill">${s.kycDoneBadge}</span>
      </div>

      <h2 style="margin-bottom:4px;">${memberName}</h2>
      <p class="screen-desc" style="margin-bottom:16px;">${memberRel} · ${s.demoCardNumber}</p>

      <div class="details-card-box">
        <div class="detail-line">
          <small>${s.aadhaarNumberMasked}</small>
          <code>${aadhaarMask}</code>
        </div>
        <div class="detail-line">
          <small>${s.verificationMode}</small>
          <b>${s.verificationModeVal}</b>
        </div>
        <div class="detail-line">
          <small>${s.verificationDate}</small>
          <b>${vDate}</b>
        </div>
        <div class="detail-line">
          <small>${s.status}</small>
          <span class="badge-completed">${s.statusVal}</span>
        </div>
      </div>

      <div class="info-callout" style="margin-top:14px;background:#eef7f1;border-color:#cce7d6;color:#135939;">
        <span>✓</span>
        <span>${s.kycDoneNote}</span>
      </div>

      <div class="actions" style="margin-top:20px;">
        <button class="primary-btn" id="kyc-done-close-btn">${s.closeModal}</button>
      </div>
    </div>
  `;
}

function wireScreenEvents() {
  const s = t();

  // Splash
  const splashStart = document.getElementById("splash-start-btn");
  if (splashStart) splashStart.onclick = () => { currentStep = 1; render(); };
  const splashLang = document.getElementById("splash-lang-toggle");
  if (splashLang) splashLang.onclick = toggleLanguage;

  // Welcome
  const welcomeCont = document.getElementById("welcome-continue-btn");
  if (welcomeCont) welcomeCont.onclick = () => { currentStep = 2; render(); };

  // Ration Card Member Clicks & Modal
  const resetBtn = document.getElementById("reset-members-btn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      completedMembers = new Set(["suresh", "ramesh"]);
      activeMemberToVerify = "lakshmi";
      viewingKycDoneMember = null;
      render();
    };
  }

  const sureshCard = document.getElementById("member-suresh-card");
  if (sureshCard) sureshCard.onclick = () => { viewingKycDoneMember = "suresh"; render(); };

  const rameshCard = document.getElementById("member-ramesh-card");
  if (rameshCard) rameshCard.onclick = () => { viewingKycDoneMember = "ramesh"; render(); };

  const lakshmiCard = document.getElementById("member-lakshmi-card");
  if (lakshmiCard) {
    lakshmiCard.onclick = () => {
      if (completedMembers.has("lakshmi")) {
        viewingKycDoneMember = "lakshmi";
        render();
      } else {
        activeMemberToVerify = "lakshmi";
        currentStep = 3; // Proceed to consent
        render();
      }
    };
  }

  const deepaCard = document.getElementById("member-deepa-card");
  if (deepaCard) {
    deepaCard.onclick = () => {
      if (completedMembers.has("deepa")) {
        viewingKycDoneMember = "deepa";
        render();
      } else {
        activeMemberToVerify = "deepa";
        currentStep = 3; // Proceed to consent
        render();
      }
    };
  }

  const kycDoneClose = document.getElementById("kyc-done-close-btn");
  if (kycDoneClose) {
    kycDoneClose.onclick = () => {
      viewingKycDoneMember = null;
      render();
    };
  }

  const rationCont = document.getElementById("ration-continue-btn");
  if (rationCont) {
    rationCont.onclick = () => {
      if (!completedMembers.has("lakshmi")) {
        activeMemberToVerify = "lakshmi";
        currentStep = 3;
      } else if (!completedMembers.has("deepa")) {
        activeMemberToVerify = "deepa";
        currentStep = 3;
      } else {
        currentStep = 8;
      }
      render();
    };
  }

  // Consent
  const checkRead = document.getElementById("check-read-row");
  if (checkRead) checkRead.onclick = () => { consentRead = !consentRead; render(); };
  const checkProceed = document.getElementById("check-proceed-row");
  if (checkProceed) checkProceed.onclick = () => { consentProceed = !consentProceed; render(); };
  const consentCont = document.getElementById("consent-continue-btn");
  if (consentCont) consentCont.onclick = () => {
    if (consentRead && consentProceed) {
      currentStep = 4;
      render();
    }
  };

  // Method Selection
  const chooseFace = document.getElementById("choose-face-card");
  if (chooseFace) {
    chooseFace.onclick = () => {
      showFpsNotice = false;
      render();
    };
  }
  const chooseFps = document.getElementById("choose-fps-card");
  if (chooseFps) {
    chooseFps.onclick = () => {
      showFpsNotice = !showFpsNotice;
      render();
    };
  }
  const fpsHintLink = document.getElementById("fps-hint-link");
  if (fpsHintLink) {
    fpsHintLink.onclick = () => {
      showFpsNotice = true;
      render();
    };
  }
  const methodCont = document.getElementById("method-continue-btn");
  if (methodCont) methodCont.onclick = () => { currentStep = 5; render(); };

  // Face Guide Do's & Don'ts Filter Tabs
  const tabAll = document.getElementById("tab-all-btn");
  if (tabAll) tabAll.onclick = () => { dodontTab = "all"; render(); };
  const tabDo = document.getElementById("tab-do-btn");
  if (tabDo) tabDo.onclick = () => { dodontTab = "do"; render(); };
  const tabDont = document.getElementById("tab-dont-btn");
  if (tabDont) tabDont.onclick = () => { dodontTab = "dont"; render(); };

  // Face Guide Voice Audio
  const audioBtn = document.getElementById("audio-guide-btn");
  if (audioBtn) {
    audioBtn.onclick = () => {
      toggleVoicePlayback();
    };
  }
  const guideReady = document.getElementById("guide-ready-btn");
  if (guideReady) guideReady.onclick = () => {
    stopAudioPlayback();
    currentStep = 6;
    render();
    // Simulate automated biometric scan
    setTimeout(() => {
      if (currentStep === 6) {
        currentStep = 7;
        render();
        // Simulate UIDAI verification & update
        setTimeout(() => {
          if (currentStep === 7) {
            completedMembers.add(activeMemberToVerify);
            currentStep = 8;
            render();
          }
        }, 2400);
      }
    }, 2800);
  };

  // Capture
  const captureCont = document.getElementById("capture-advance-btn");
  if (captureCont) {
    captureCont.onclick = () => {
      currentStep = 7;
      render();
      setTimeout(() => {
        if (currentStep === 7) {
          completedMembers.add(activeMemberToVerify);
          currentStep = 8;
          render();
        }
      }, 2000);
    };
  }

  // Verify
  const verifyCont = document.getElementById("verify-continue-btn");
  if (verifyCont) {
    verifyCont.onclick = () => {
      completedMembers.add(activeMemberToVerify);
      currentStep = 8;
      render();
    };
  }

  // Success
  const successView = document.getElementById("success-view-btn");
  if (successView) {
    successView.onclick = () => {
      viewingKycDoneMember = activeMemberToVerify;
      currentStep = 2; // view verification certificate details modal
      render();
    };
  }
  const successHome = document.getElementById("success-home-btn");
  if (successHome) {
    successHome.onclick = () => {
      currentStep = 2; // return to ration card members so user sees Lakshmi is completed and Deepa is still pending!
      render();
    };
  }
}

function toggleVoicePlayback() {
  if (isAudioPlaying) {
    stopAudioPlayback();
  } else {
    playVoiceGuidance();
  }
}

function playVoiceGuidance() {
  const audioSrc = currentLang === "kn" ? ASSETS.audioKn : ASSETS.audioEn;
  
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }

  activeAudio = new Audio(audioSrc);
  isAudioPlaying = true;
  render();

  activeAudio.play().then(() => {
    // Playing successfully
  }).catch((err) => {
    console.warn("Audio file playback blocked by browser, trying speech synthesis fallback:", err);
    playSpeechSynthesisFallback();
  });

  activeAudio.onended = () => {
    stopAudioPlayback();
  };

  activeAudio.onerror = () => {
    playSpeechSynthesisFallback();
  };
}

function stopAudioPlayback() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if ("speechSynthesis" in window && speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  isAudioPlaying = false;
  render();
}

function playSpeechSynthesisFallback() {
  if (!("speechSynthesis" in window)) {
    isAudioPlaying = false;
    render();
    return;
  }
  const s = t();
  const text = [s.do1Title, s.do2Title, s.do3Title, s.do4Title].join(". ");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = currentLang === "kn" ? "kn-IN" : "en-IN";
  u.rate = 0.9;
  u.onend = () => {
    isAudioPlaying = false;
    render();
  };
  speechSynthesis.speak(u);
}

function toggleLanguage() {
  stopAudioPlayback();
  currentLang = currentLang === "en" ? "kn" : "en";
  render();
}

// Stage CTA actions
const elStageStart = document.getElementById("start");
if (elStageStart) elStageStart.onclick = () => { currentStep = 1; render(); };
const elStageReset = document.getElementById("reset");
if (elStageReset) elStageReset.onclick = () => {
  currentStep = 0;
  consentRead = false;
  consentProceed = false;
  completedMembers = new Set(["suresh", "ramesh"]);
  viewingKycDoneMember = null;
  stopAudioPlayback();
  render();
};

// Initial Render
render();
