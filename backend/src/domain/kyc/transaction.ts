import type { AadhaarAuthenticationMethod } from "../../providers/aadhaar/provider";
import type { KycStatus } from "./status";
import { canTransition } from "./transition";

export interface KycTransaction {
  requestId:string;
  householdReference:string;
  memberReference:string;
  status:KycStatus;
  authenticationMethod:AadhaarAuthenticationMethod;
  createdAt:string;
  updatedAt:string;
  aadhaarSessionReference?:string;
  aadhaarAuthenticationReference?:string;
  pdsTransactionReference?:string;
  processingClaimId?:string;
}

export function createTransaction(requestId:string,householdReference:string,memberReference:string,authenticationMethod:AadhaarAuthenticationMethod="otp_face",now=new Date().toISOString()):KycTransaction{
 return {requestId,householdReference,memberReference,status:"received",authenticationMethod,createdAt:now,updatedAt:now};
}

export function transitionTransaction(transaction:KycTransaction,nextStatus:KycStatus,now=new Date().toISOString()):KycTransaction{
 if(!canTransition(transaction.status,nextStatus))throw new Error(`Invalid KYC transition: ${transaction.status} -> ${nextStatus}`);
 return {...transaction,status:nextStatus,updatedAt:now};
}
