export type AadhaarAuthenticationMethod = "face" | "otp";

export interface AuthenticationRequest {
  method: AadhaarAuthenticationMethod;
  transactionId: string;
  memberReference: string;
  consentReference: string;
}

export interface AuthenticationResult {
  accepted: boolean;
  providerReference?: string;
}

export interface AadhaarProvider {
  startAuthentication(request: AuthenticationRequest, signal?: AbortSignal): Promise<AuthenticationResult>;
}
