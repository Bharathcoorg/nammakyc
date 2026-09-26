import type { AadhaarProvider } from "../providers/aadhaar/provider";
import type { KycProvider } from "../providers/kyc/provider";
import { AppError } from "../domain/errors";

export async function submitAuthenticatedKyc(
  aadhaar: AadhaarProvider,
  kyc: KycProvider,
  transactionId: string,
  memberReference: string,
  consentReference: string
): Promise<string> {
  const authentication = await aadhaar.startAuthentication({
    transactionId,
    memberReference,
    consentReference
  });

  if (!authentication.accepted || !authentication.providerReference) {
    throw new AppError("AUTHENTICATION_FAILED", "Authentication was not accepted", 401);
  }

  const result = await kyc.submit({
    transactionId,
    memberReference,
    authenticationReference: authentication.providerReference
  });

  if (!result.success) {
    throw new AppError("UPSTREAM_UNAVAILABLE", "KYC provider did not complete the request", 503);
  }

  return result.providerReference ?? transactionId;
}
