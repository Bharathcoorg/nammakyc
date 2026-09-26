import { route, type RouteEnv } from "./routes/router";
import { applySecurityHeaders, requestId } from "./security/headers";
import { validateRequest } from "./security/request";
import { CloudflareKycQueue } from "./queues/cloudflare";
import { KycWorker } from "./queues/worker";
import { MockPdsProvider } from "./providers/pds/mock";
import { MockAadhaarProvider } from "./providers/aadhaar/mock";
import { MockKycProvider } from "./providers/kyc/mock";
import { TransactionService } from "./services/transactions";
import { createTransactionRepository } from "./repositories/factory";
import type { QueueEnvelope } from "./queues/consumer";
export interface Env extends RouteEnv { ENVIRONMENT:string; KYC_QUEUE?: { send(body: unknown): Promise<void> }; }
export default {async fetch(request:Request,env:Env):Promise<Response>{const id=requestId(request);try{validateRequest(request);const response=await route(request,env);return applySecurityHeaders(response??Response.json({error:{code:"NOT_FOUND",message:"Route not found"}},{status:404}),id)}catch(error){const message=error instanceof Error?error.message:"";const status=message==="JSON content type required"||message==="Request body too large"?415:500;return applySecurityHeaders(Response.json({error:{code:status===415?"INVALID_REQUEST":"INTERNAL_ERROR",message:status===415?message:"Internal server error"}},{status}),id)}}};
