export const KYC_STATUSES = [
  "received",
  "validating",
  "authenticating",
  "processing",
  "success",
  "retrying",
  "failed"
] as const;

export type KycStatus = (typeof KYC_STATUSES)[number];
