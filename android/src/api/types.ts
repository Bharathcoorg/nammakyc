export type KycStatus="received"|"validating"|"aadhaar_pending"|"aadhaar_authenticating"|"aadhaar_authenticated"|"pds_processing"|"success"|"retrying"|"failed";
export type AuthenticationMethod="face"|"otp"|"otp_face";
export interface HouseholdMember{memberReference:string;displayName:string;kycRequired:boolean;lastVerifiedAt?:string}
export interface Household{householdReference:string;members:HouseholdMember[]}
export interface KycResponse{requestId:string;status:KycStatus;authenticationMethod:AuthenticationMethod;reference?:string}
