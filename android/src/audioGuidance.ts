import * as Speech from "expo-speech";

export type GuidanceLanguage = "en" | "kn";

const GUIDANCE: Record<GuidanceLanguage, string> = {
  en: "Find a well-lit place. Keep your face clearly visible and remove anything covering it. Hold the phone at eye level and keep your face steady. Follow the instructions shown during Aadhaar verification.",
  kn: "ಉತ್ತಮ ಬೆಳಕು ಇರುವ ಸ್ಥಳದಲ್ಲಿರಿ. ನಿಮ್ಮ ಮುಖವು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡಿ ಮತ್ತು ಮುಖವನ್ನು ಮುಚ್ಚಿರುವ ವಸ್ತುಗಳನ್ನು ತೆಗೆದುಹಾಕಿ. ಫೋನ್ ಅನ್ನು ಕಣ್ಣಿನ ಮಟ್ಟದಲ್ಲಿ ಹಿಡಿದು ಮುಖವನ್ನು ಸ್ಥಿರವಾಗಿರಿಸಿ. ಆಧಾರ್ ಪರಿಶೀಲನೆಯ ಸಮಯದಲ್ಲಿ ಪರದೆಯಲ್ಲಿರುವ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ."
};

let cachedVoices: Speech.Voice[] | null = null;

// Pre-load available voices into memory immediately on module load for instant playback
void Speech.getAvailableVoicesAsync().then((voices) => {
  cachedVoices = voices;
}).catch(() => {});

function findBestVoice(voices: Speech.Voice[], language: GuidanceLanguage): Speech.Voice | undefined {
  if (language === "kn") {
    // Prefer high-quality realistic human voice installed on Android Google Speech / OEM engine
    return (
      voices.find((v) => {
        const lang = v.language.toLowerCase();
        const id = (v.identifier || "").toLowerCase();
        return (
          (lang.startsWith("kn") || lang.includes("kannada")) &&
          (id.includes("network") || id.includes("natural") || id.includes("enhanced") || v.quality === Speech.VoiceQuality.Enhanced)
        );
      }) ??
      voices.find((v) => {
        const lang = v.language.toLowerCase();
        return lang.startsWith("kn") || lang.includes("kannada");
      })
    );
  } else {
    // Prefer natural Indian English voice
    return (
      voices.find((v) => {
        const lang = v.language.toLowerCase();
        const id = (v.identifier || "").toLowerCase();
        return (
          (lang.startsWith("en-in") || lang.includes("en_in")) &&
          (id.includes("network") || id.includes("natural") || id.includes("enhanced") || v.quality === Speech.VoiceQuality.Enhanced)
        );
      }) ??
      voices.find((v) => v.language.toLowerCase().startsWith("en-in")) ??
      voices.find((v) => v.language.toLowerCase().startsWith("en"))
    );
  }
}

export async function speakGuidance(
  language: GuidanceLanguage,
  onDone?: () => void
): Promise<boolean> {
  try {
    // Instantly stop any previous speech
    await Speech.stop();

    // Use cached voices if ready, otherwise quickly query
    if (!cachedVoices) {
      cachedVoices = await Speech.getAvailableVoicesAsync().catch(() => []);
    }

    const preferred = findBestVoice(cachedVoices || [], language);

    // If Kannada is selected but device lacks Kannada voice data, return false
    if (language === "kn" && !preferred) {
      return false;
    }

    // Trigger speech with realistic human voice identifier, natural conversational rate (0.9) and pitch (1.0)
    Speech.speak(GUIDANCE[language], {
      language: preferred?.language ?? (language === "kn" ? "kn-IN" : "en-IN"),
      voice: preferred?.identifier,
      rate: 0.9,
      pitch: 1.0,
      onDone: () => onDone?.(),
      onStopped: () => onDone?.(),
      onError: () => {
        onDone?.();
      },
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
