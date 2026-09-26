export interface HouseholdMember{memberReference:string;displayName:string;kycRequired:boolean}
export interface Household{householdReference:string;members:HouseholdMember[]}
export interface KycResponse{requestId:string;status:string;reference?:string}
