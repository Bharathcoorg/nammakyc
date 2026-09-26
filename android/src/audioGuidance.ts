import * as Speech from "expo-speech";

export type GuidanceLanguage = "en" | "kn";

const GUIDANCE: Record<GuidanceLanguage, string> = {
  en: "Find a well-lit place. Keep your face clearly visible and remove anything covering it. Hold the phone at eye level and keep your face steady. Follow the instructions shown during Aadhaar verification.",
  kn: "ಉತ್ತಮ ಬೆಳಕು ಇರುವ ಸ್ಥಳದಲ್ಲಿರಿ. ನಿಮ್ಮ ಮುಖವು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡಿ ಮತ್ತು ಮುಖವನ್ನು ಮುಚ್ಚಿರುವ ವಸ್ತುಗಳನ್ನು ತೆಗೆದುಹಾಕಿ. ಫೋನ್ ಅನ್ನು ಕಣ್ಣಿನ ಮಟ್ಟದಲ್ಲಿ ಹಿಡಿದು ಮುಖವನ್ನು ಸ್ಥಿರವಾಗಿರಿಸಿ. ಆಧಾರ್ ಪರಿಶೀಲನೆಯ ಸಮಯದಲ್ಲಿ ಪರದೆಯಲ್ಲಿರುವ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ."
};

export async function speakGuidance(language: GuidanceLanguage): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const preferred = language === "kn"
      ? voices.find((voice) => voice.language.toLowerCase().startsWith("kn"))
      : voices.find((voice) => voice.language.toLowerCase().startsWith("en-in")) ??
        voices.find((voice) => voice.language.toLowerCase().startsWith("en"));
    if (language === "kn" && !preferred) return false;
    await Speech.stop();
    await Speech.speak(GUIDANCE[language], {
      language: preferred?.language ?? (language === "kn" ? "kn-IN" : "en-IN"),
      voice: preferred?.identifier,
      rate: 0.9,
      pitch: 1,
    });
    return true;
  } catch {
    return false;
  }
}

export async function stopGuidance(): Promise<void> {
  try {
    await Speech.stop();
  } catch {
    // Voice is optional; stopping it must never block navigation.
  }
}
