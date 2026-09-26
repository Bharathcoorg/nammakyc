export type Language = "en" | "kn";

export const translations = {
  en: {
    appName: "Namma KYC", tagline: "Karnataka ration-card e-KYC", chooseLanguage: "Choose your language",
    languageHint: "Your choice applies to the complete journey.", english: "English", kannada: "ಕನ್ನಡ", continue: "Continue",
    welcomeTitle: "Complete e-KYC from your phone", welcomeText: "A simple reference journey for Karnataka ration-card beneficiaries.",
    secureTitle: "Privacy-first by design", secureText: "The reference app does not store Aadhaar biometrics or OTPs.",
    rationCard: "Ration card number", rationCardHint: "Enter the number printed on your ration card.", findHousehold: "Continue",
    household: "Household members", selectMember: "Select the member completing e-KYC.", kycRequired: "KYC required", kycComplete: "KYC completed",
    consent: "Consent & verification", consentText: "I consent to continue with Aadhaar authentication for e-KYC.",
    privacyText: "Authentication is performed only through an authorized integration. This reference build uses a mock provider.",
    startVerification: "Start verification", processing: "Verification in progress", processingText: "Your request is being processed. Keep this screen open.",
    success: "e-KYC request completed", successText: "Your verification request has been submitted successfully.", reference: "Reference", back: "Back",
    error: "Something went wrong. Please try again.", demoNote: "Independent open-source reference implementation",
    step: "Step", of: "of", householdStep: "Household", verifyStep: "Verify", doneStep: "Done", trust: "Secure reference flow",
  },
  kn: {
    appName: "ನಮ್ಮ KYC", tagline: "ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ", chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    languageHint: "ನಿಮ್ಮ ಆಯ್ಕೆ ಸಂಪೂರ್ಣ ಪ್ರಕ್ರಿಯೆಗೆ ಅನ್ವಯಿಸುತ್ತದೆ.", english: "English", kannada: "ಕನ್ನಡ", continue: "ಮುಂದುವರಿಸಿ",
    welcomeTitle: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಿಂದ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಿ", welcomeText: "ಕರ್ನಾಟಕದ ಪಡಿತರ ಚೀಟಿ ಫಲಾನುಭವಿಗಳಿಗಾಗಿ ಸರಳ ರೆಫರೆನ್ಸ್ ಪ್ರಕ್ರಿಯೆ.",
    secureTitle: "ಗೌಪ್ಯತೆ ಮೊದಲು", secureText: "ರೆಫರೆನ್ಸ್ ಅಪ್ಲಿಕೇಶನ್ ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಅಥವಾ OTP ಡೇಟಾವನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    rationCard: "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ", rationCardHint: "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ಇರುವ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.", findHousehold: "ಮುಂದುವರಿಸಿ",
    household: "ಕುಟುಂಬದ ಸದಸ್ಯರು", selectMember: "ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸುವ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ.", kycRequired: "KYC ಅಗತ್ಯವಿದೆ", kycComplete: "KYC ಪೂರ್ಣಗೊಂಡಿದೆ",
    consent: "ಸಮ್ಮತಿ ಮತ್ತು ಪರಿಶೀಲನೆ", consentText: "ಇ-ಕೆವೈಸಿಗಾಗಿ ಆಧಾರ್ ದೃಢೀಕರಣವನ್ನು ಮುಂದುವರಿಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
    privacyText: "ಅಧಿಕೃತ ಇಂಟಿಗ್ರೇಶನ್ ಮೂಲಕ ಮಾತ್ರ ದೃಢೀಕರಣ ನಡೆಯುತ್ತದೆ. ಈ ರೆಫರೆನ್ಸ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಮಾಕ್ ಪ್ರೊವೈಡರ್ ಬಳಸಲಾಗಿದೆ.",
    startVerification: "ಪರಿಶೀಲನೆ ಪ್ರಾರಂಭಿಸಿ", processing: "ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ", processingText: "ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ. ಈ ಪರದೆಯನ್ನು ತೆರೆದಿಡಿ.",
    success: "ಇ-ಕೆವೈಸಿ ವಿನಂತಿ ಪೂರ್ಣಗೊಂಡಿದೆ", successText: "ನಿಮ್ಮ ಪರಿಶೀಲನಾ ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.", reference: "ಉಲ್ಲೇಖ", back: "ಹಿಂದೆ",
    error: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", demoNote: "ಸ್ವತಂತ್ರ ಓಪನ್-ಸೋರ್ಸ್ ರೆಫರೆನ್ಸ್ ಆವೃತ್ತಿ",
    step: "ಹಂತ", of: "ರಲ್ಲಿ", householdStep: "ಕುಟುಂಬ", verifyStep: "ಪರಿಶೀಲನೆ", doneStep: "ಪೂರ್ಣ", trust: "ಸುರಕ್ಷಿತ ರೆಫರೆನ್ಸ್ ಪ್ರಕ್ರಿಯೆ",
  },
} as const;

export type Strings = typeof translations.en;
