export const KYC_STATUSES = [
  "received",
  "validating",
  "aadhaar_pending",
  "aadhaar_authenticating",
  "aadhaar_authenticated",
  "pds_processing",
  "success",
  "retrying",
  "failed"
] as const;

export type KycStatus = (typeof KYC_STATUSES)[number];
