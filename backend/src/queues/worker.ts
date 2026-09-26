import { isRetryableKycError, type TransactionService } from "../services/transactions";
import type { KycJob } from "./kyc";
import { isDuplicateDelivery, type KycJobConsumer, type KycJobResult } from "./consumer";
import { NoopMetricsSink, type MetricsSink } from "../observability/metrics";

export class KycWorker implements KycJobConsumer {
  constructor(private readonly service: TransactionService,private readonly maxAttempts=3,private readonly metrics:MetricsSink=new NoopMetricsSink()) {}
  async consume(job:KycJob):Promise<KycJobResult>{
    const current=await this.service.get(job.transactionId);
    if(isDuplicateDelivery(current,job)){void this.metrics.increment("queue.duplicate",{route:"queue"});return {acknowledged:true,retryable:false};}
    try{
      await this.service.process({transactionId:job.transactionId});
      void this.metrics.increment("queue.succeeded",{route:"queue"});return {acknowledged:true,retryable:false};
    }catch(error){
      if(!isRetryableKycError(error)||job.attempt+1>=this.maxAttempts){if(job.attempt+1>=this.maxAttempts){await this.service.markFailed(job.transactionId);void this.metrics.increment("queue.failed",{route:"queue"});}return {acknowledged:true,retryable:false};}
      return {acknowledged:false,retryable:true};
    }
  }
}
