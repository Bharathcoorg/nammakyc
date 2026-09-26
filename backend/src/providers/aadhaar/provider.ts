export interface AuthenticationRequest {
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
