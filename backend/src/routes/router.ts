import { healthResponse } from "./health";
import { MockPdsProvider } from "../providers/pds/mock";
import { MockAadhaarProvider } from "../providers/aadhaar/mock";
import { MockKycProvider } from "../providers/kyc/mock";
import type { PdsProvider } from "../providers/pds/provider";
import type { AadhaarProvider } from "../providers/aadhaar/provider";
import type { KycProvider } from "../providers/kyc/provider";
import { HouseholdService } from "../services/household";
import { TransactionService } from "../services/transactions";
import { createTransactionRepository } from "../repositories/factory";
import { AppError } from "../domain/errors";
import type { KycJobQueue } from "../queues/kyc";
import type { AuditSink } from "../observability/events";
import { NoopMetricsSink, type MetricsSink } from "../observability/metrics";
import { authorizeRequest, type AuthorizationPolicy } from "../security/authorization";

export interface RouteEnv {
  DB?: Parameters<typeof createTransactionRepository>[0];
  QUEUE?: KycJobQueue;
  AUDIT?: AuditSink;
  ENVIRONMENT?: string;
  PDS?: PdsProvider;
  AADHAAR?: AadhaarProvider;
  KYC?: KycProvider;
  AUTHORIZATION?: AuthorizationPolicy;
  METRICS?: MetricsSink;
}

const jsonHeaders = {"Cache-Control":"no-store"};

function providers(env: RouteEnv) {
  if (env.ENVIRONMENT === "production") {
    if (!env.PDS || !env.AADHAAR || !env.KYC) {
      throw new AppError("INTERNAL_ERROR","Production provider configuration is required",500);
    }
    return { pds: env.PDS, aadhaar: env.AADHAAR, kyc: env.KYC };
  }
  return {
    pds: env.PDS ?? new MockPdsProvider(),
    aadhaar: env.AADHAAR ?? new MockAadhaarProvider(),
    kyc: env.KYC ?? new MockKycProvider()
  };
}

function repositoryFor(env: RouteEnv) {
  if (env.ENVIRONMENT === "production" && !env.DB) {
    throw new AppError("INTERNAL_ERROR","Production database configuration is required",500);
  }
  return createTransactionRepository(env.DB);
}

async function authorize(env: RouteEnv, action: "household.read" | "kyc.create" | "kyc.status.read", request: Request, requestId?: string) {
  try {
    await authorizeRequest(env, { action, request, requestId });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("INTERNAL_ERROR","Production authorization policy is required",500);
  }
}

export async function route(request:Request,env:RouteEnv={}):Promise<Response|undefined>{
 const url=new URL(request.url);
 const metrics=env.METRICS ?? new NoopMetricsSink();
 void metrics.increment("http.requests",{route:url.pathname});
 if(request.method==="GET"&&url.pathname==="/health")return healthResponse();

 const householdMatch=url.pathname.match(/^\/v1\/households\/([^/]+)$/);
 if(request.method==="GET"&&householdMatch){
  try{
   await authorize(env,"household.read",request);
   const { pds } = providers(env);
   const householdService=new HouseholdService(pds);
   return Response.json(await householdService.lookup(decodeURIComponent(householdMatch[1])),{headers:jsonHeaders});
  }catch(error){
   if(error instanceof AppError) { void metrics.increment("http.errors",{route:url.pathname}); return Response.json({error:{code:error.code,message:error.message}},{status:error.status,headers:jsonHeaders}); }
   void metrics.increment("http.errors",{route:url.pathname});
   return Response.json({error:{code:"INVALID_REQUEST",message:"Invalid ration card reference"}},{status:400,headers:jsonHeaders});
  }
 }

 if(request.method==="POST"&&url.pathname==="/v1/kyc"){
  const key=request.headers.get("Idempotency-Key")??"";
  try{
   await authorize(env,"kyc.create",request);
   const repository=repositoryFor(env);
   const configured=providers(env);
   const transactionService=new TransactionService(repository,configured.pds,configured.aadhaar,configured.kyc,env.AUDIT,metrics);
   const body=await request.json() as unknown;
   if(!body || typeof body!=="object" || Array.isArray(body)) throw new AppError("INVALID_REQUEST","Invalid JSON request body",400);
   const payload=body as Record<string,unknown>;
   const fields=["householdReference","memberReference","consentReference"] as const;
   for(const field of fields){
    const value=payload[field];
    if(typeof value!=="string"||value.trim().length<1||value.trim().length>128)throw new AppError("INVALID_REQUEST","Invalid KYC request",400);
   }
   if(key.trim().length<16||key.trim().length>128)throw new AppError("INVALID_REQUEST","Invalid idempotency key",400);
   const policyVersion=typeof payload.consentPolicyVersion==="string"?payload.consentPolicyVersion.trim():undefined;
   if(payload.consentPolicyVersion!==undefined&&(!policyVersion||policyVersion.length>64))throw new AppError("INVALID_REQUEST","Invalid consent policy version",400);
   const language=payload.consentLanguage==="en"||payload.consentLanguage==="kn"?payload.consentLanguage:undefined;
   if(payload.consentLanguage!==undefined&&!language)throw new AppError("INVALID_REQUEST","Invalid consent language",400);
   const authenticationMethod=payload.authenticationMethod==="otp"?"otp":payload.authenticationMethod==="face"||payload.authenticationMethod===undefined?"face":undefined;
   if(!authenticationMethod)throw new AppError("INVALID_REQUEST","Invalid authentication method",400);
   
   const input={
    householdReference:(payload.householdReference as string).trim(),
    memberReference:(payload.memberReference as string).trim(),
    consentReference:(payload.consentReference as string).trim(),
    consentPolicyVersion:policyVersion,
    consentLanguage:language,
    authenticationMethod,
    idempotencyKey:key
   };
   const tx=env.QUEUE ? await transactionService.create(input) : await transactionService.start(input);
   if(env.QUEUE){
    try {
     await env.QUEUE.enqueue({jobId:crypto.randomUUID(),transactionId:tx.requestId,input,enqueuedAt:new Date().toISOString(),attempt:0});
    } catch(error) {
     await transactionService.markRetrying(tx.requestId);
     throw new AppError("UPSTREAM_UNAVAILABLE","KYC processing queue is temporarily unavailable",503);
    }
   }
   return Response.json({requestId:tx.requestId,status:tx.status,authenticationMethod:tx.authenticationMethod,reference:tx.pdsTransactionReference??tx.aadhaarAuthenticationReference},{status:202,headers:jsonHeaders});
  }catch(error){
   const e=error instanceof AppError?error:error instanceof SyntaxError?new AppError("INVALID_REQUEST","Invalid JSON request body",400):new AppError("INTERNAL_ERROR","Internal server error",500);
   void metrics.increment("http.errors",{route:url.pathname});
   return Response.json({error:{code:e.code,message:e.message}},{status:e.status,headers:jsonHeaders});
  }
 }

 const statusMatch=url.pathname.match(/^\/v1\/kyc\/([^/]+)$/);
 if(request.method==="GET"&&statusMatch){
  try {
   await authorize(env,"kyc.status.read",request,decodeURIComponent(statusMatch[1]));
  } catch(error) {
   const e=error instanceof AppError?error:new AppError("INTERNAL_ERROR","Internal server error",500);
   void metrics.increment("http.errors",{route:url.pathname});
   return Response.json({error:{code:e.code,message:e.message}},{status:e.status,headers:jsonHeaders});
  }
  try {
   const repository=repositoryFor(env);
   const tx=await repository.get(decodeURIComponent(statusMatch[1]));
   if(!tx)return Response.json({error:{code:"NOT_FOUND",message:"KYC transaction not found"}},{status:404,headers:jsonHeaders});
   return Response.json({requestId:tx.requestId,status:tx.status,authenticationMethod:tx.authenticationMethod,reference:tx.pdsTransactionReference??tx.aadhaarAuthenticationReference},{headers:jsonHeaders});
  } catch(error) {
   const e=error instanceof AppError?error:new AppError("INTERNAL_ERROR","Internal server error",500);
   void metrics.increment("http.errors",{route:url.pathname});
   return Response.json({error:{code:e.code,message:e.message}},{status:e.status,headers:jsonHeaders});
  }
 }
 return undefined;
}
