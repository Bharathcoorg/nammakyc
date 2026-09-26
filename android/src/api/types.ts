export interface HouseholdMember {
  memberReference: string;
  displayName: string;
  kycRequired: boolean;
}

export interface Household {
  householdReference: string;
  members: HouseholdMember[];
}
