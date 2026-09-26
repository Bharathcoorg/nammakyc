import { route, type RouteEnv } from "./routes/router";
import { applySecurityHeaders, requestId } from "./security/headers";
import { validateRequest } from "./security/request";
import { CloudflareKycQueue, processKycJob, type KycJob } from "./queues/kyc";
import { MockPdsProvider } from "./providers/pds/mock";
import { MockAadhaarProvider } from "./providers/aadhaar/mock";
import { MockKycProvider } from "./providers/kyc/mock";
import { isRetryableKycError, TransactionService } from "./services/transactions";
import { createTransactionRepository } from "./repositories/factory";

export interface QueueBinding { send(body: KycJob): Promise<void> }
export interface Env extends RouteEnv {
  ENVIRONMENT:string;
  KYC_QUEUE?: QueueBinding;
}

const jsonHeaders={"Cache-Control":"no-store"};

function responseWithHeaders(response: Response, id: string): Response {
  return applySecurityHeaders(response, id);
}

export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const id=requestId(request);
    try {
      validateRequest(request);
      const queue = env.KYC_QUEUE ? new CloudflareKycQueue(env.KYC_QUEUE) : undefined;
      return responseWithHeaders(await route(request,{...env,QUEUE:queue}) ?? Response.json({error:{code:"NOT_FOUND",message:"Route not found"}},{status:404}),id);
    } catch(error) {
      const message=error instanceof Error?error.message:"";
      const status=message==="JSON content type required"||message==="Request body too large"?415:500;
      return responseWithHeaders(Response.json({error:{code:status===415?"INVALID_REQUEST":"INTERNAL_ERROR",message:status===415?message:"Internal server error"}},{status}),id);
    }
  },

  async queue(batch: { messages: Array<{ body: KycJob; retry(options?: {delaySeconds?:number}):void }> }, env: Env): Promise<void> {
    const repository=createTransactionRepository(env.DB);
    const service=new TransactionService(repository,new MockPdsProvider(),new MockAadhaarProvider(),new MockKycProvider());

    for(const message of batch.messages) {
      try {
        await processKycJob(message.body,service);
      } catch(error) {
        const retryable = isRetryableKycError(error);
        if(retryable) message.retry({delaySeconds: Math.min(60, 2 ** Math.min(message.body.attempt, 5))});
        else await service.markFailed(message.body.transactionId);
      }
    }
  }
};
