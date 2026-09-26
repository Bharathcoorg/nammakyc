export interface PdsMember {
  memberReference: string;
  displayName: string;
  kycRequired: boolean;
  lastVerifiedAt?: string;
}

export interface PdsHousehold {
  householdReference: string;
  members: PdsMember[];
}

export interface PdsProvider {
  lookupHousehold(rationCardReference: string, signal?: AbortSignal): Promise<PdsHousehold>;
}
