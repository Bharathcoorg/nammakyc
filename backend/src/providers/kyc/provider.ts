export interface KycSubmission {
  transactionId: string;
  memberReference: string;
  authenticationReference: string;
}

export interface KycResult {
  success: boolean;
  providerReference?: string;
}

export interface KycProvider {
  submit(request: KycSubmission, signal?: AbortSignal): Promise<KycResult>;
}
