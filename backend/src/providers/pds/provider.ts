export interface PdsMember {
  memberReference: string;
  displayName: string;
  kycRequired: boolean;
}

export interface PdsHousehold {
  householdReference: string;
  members: PdsMember[];
}

export interface PdsProvider {
  lookupHousehold(rationCardReference: string): Promise<PdsHousehold>;
}
