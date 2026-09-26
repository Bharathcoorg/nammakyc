import { healthResponse } from "./health";
import { MockPdsProvider } from "../providers/pds/mock";
import { MockAadhaarProvider } from "../providers/aadhaar/mock";
import { MockKycProvider } from "../providers/kyc/mock";
import { HouseholdService } from "../services/household";
import { TransactionService } from "../services/transactions";
import { createTransactionRepository } from "../repositories/factory";
import { AppError } from "../domain/errors";
import type { KycJobQueue } from "../queues/kyc";

export interface RouteEnv { DB?: Parameters<typeof createTransactionRepository>[0]; QUEUE?: KycJobQueue }
const pds=new MockPdsProvider();
const householdService=new HouseholdService(pds);
const jsonHeaders={"Cache-Control":"no-store"};

export async function route(request:Request,env:RouteEnv={}):Promise<Response|undefined>{
 const url=new URL(request.url);
 if(request.method==="GET"&&url.pathname==="/health")return healthResponse();
 const householdMatch=url.pathname.match(/^\/v1\/households\/([^/]+)$/);
 if(request.method==="GET"&&householdMatch){try{return Response.json(await householdService.lookup(decodeURIComponent(householdMatch[1])),{headers:jsonHeaders})}catch{return Response.json({error:{code:"INVALID_REQUEST",message:"Invalid ration card reference"}},{status:400,headers:jsonHeaders})}}
 const repository=createTransactionRepository(env.DB);
 const transactionService=new TransactionService(repository,pds,new MockAadhaarProvider(),new MockKycProvider());
 if(request.method==="POST"&&url.pathname==="/v1/kyc"){
  const key=request.headers.get("Idempotency-Key")??"";
  try{const body=await request.json() as Record<string,unknown>;
   const fields=["householdReference","memberReference","consentReference"] as const;
   for(const field of fields){const value=body[field];if(typeof value!=="string"||value.trim().length<1||value.trim().length>128)throw new AppError("INVALID_REQUEST","Invalid KYC request",400);}
   if(key.trim().length<16||key.trim().length>128)throw new AppError("INVALID_REQUEST","Invalid idempotency key",400);
   const policyVersion=typeof body.consentPolicyVersion==="string"?body.consentPolicyVersion.trim():undefined;
   const language=body.consentLanguage==="en"||body.consentLanguage==="kn"?body.consentLanguage:undefined;
   if(policyVersion&&policyVersion.length>64)throw new AppError("INVALID_REQUEST","Invalid consent policy version",400);
   const input={householdReference:(body.householdReference as string).trim(),memberReference:(body.memberReference as string).trim(),consentReference:(body.consentReference as string).trim(),consentPolicyVersion:policyVersion,consentLanguage:language,idempotencyKey:key};
   const tx=env.QUEUE ? await transactionService.create(input) : await transactionService.start(input);
   if(env.QUEUE){
    try {
      await env.QUEUE.enqueue({jobId:crypto.randomUUID(),transactionId:tx.requestId,input,enqueuedAt:new Date().toISOString(),attempt:0});
    } catch(error) {
      await transactionService.markFailed(tx.requestId);
      throw new AppError("UPSTREAM_UNAVAILABLE","KYC processing queue is temporarily unavailable",503);
    }
   }
   return Response.json({requestId:tx.requestId,status:tx.status,reference:tx.providerReference},{status:202,headers:jsonHeaders})}catch(error){const e=error instanceof AppError?error:new AppError("INTERNAL_ERROR","Internal server error",500);return Response.json({error:{code:e.code,message:e.message}},{status:e.status,headers:jsonHeaders})}
 }
 const statusMatch=url.pathname.match(/^\/v1\/kyc\/([^/]+)$/);
 if(request.method==="GET"&&statusMatch){const tx=await repository.get(decodeURIComponent(statusMatch[1]));if(!tx)return Response.json({error:{code:"NOT_FOUND",message:"KYC transaction not found"}},{status:404,headers:jsonHeaders});return Response.json({requestId:tx.requestId,status:tx.status,reference:tx.providerReference},{headers:jsonHeaders})}
 return undefined;
}
