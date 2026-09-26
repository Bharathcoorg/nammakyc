import type { KycStatus } from "./status";

const transitions: Record<KycStatus, readonly KycStatus[]> = {
  received: ["validating", "failed"],
  validating: ["authenticating", "retrying", "failed"],
  authenticating: ["processing", "retrying", "failed"],
  processing: ["success", "retrying", "failed"],
  success: [],
  retrying: ["authenticating", "processing", "failed"],
  failed: []
};

export function canTransition(from: KycStatus, to: KycStatus): boolean {
  return transitions[from].includes(to);
}
