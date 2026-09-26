export interface ConsentArtifact {
  consentReference: string;
  purpose: "ration-card-e-kyc";
  policyVersion: string;
  language: "en" | "kn";
  capturedAt: string;
  transactionReference: string;
}
