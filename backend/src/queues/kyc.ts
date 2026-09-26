import type { StartKycInput, TransactionService } from "../services/transactions";

export interface KycJob {
  jobId: string;
  transactionId: string;
  input: StartKycInput;
  enqueuedAt: string;
  attempt: number;
}

export interface KycJobQueue {
  enqueue(job: KycJob): Promise<void>;
}

export interface QueueProducerLike {
  send(body: KycJob): Promise<void>;
}

export class CloudflareKycQueue implements KycJobQueue {
  constructor(private readonly queue: QueueProducerLike) {}

  async enqueue(job: KycJob): Promise<void> {
    await this.queue.send(job);
  }
}

export class InMemoryKycJobQueue implements KycJobQueue {
  private readonly jobs: KycJob[] = [];

  async enqueue(job: KycJob): Promise<void> {
    this.jobs.push(job);
  }

  drain(): KycJob[] {
    return this.jobs.splice(0, this.jobs.length);
  }
}

export async function processKycJob(
  job: KycJob,
  service: TransactionService
): Promise<void> {
  await service.process({
    transactionId: job.transactionId,
    memberReference: job.input.memberReference,
    consentReference: job.input.consentReference
  });
}
