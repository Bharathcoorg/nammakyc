import type { KycStatus } from "./status";

const transitions: Record<KycStatus, readonly KycStatus[]> = {
  received: ["validating", "failed"],
  validating: ["aadhaar_pending", "retrying", "failed"],
  aadhaar_pending: ["aadhaar_authenticating", "retrying", "failed"],
  aadhaar_authenticating: ["aadhaar_authenticated", "retrying", "failed"],
  aadhaar_authenticated: ["pds_processing", "retrying", "failed"],
  pds_processing: ["success", "retrying", "failed"],
  success: [],
  retrying: ["aadhaar_authenticating", "pds_processing", "failed"],
  failed: []
};

export function canTransition(from: KycStatus, to: KycStatus): boolean {
  return transitions[from].includes(to);
}
