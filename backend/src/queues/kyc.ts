import type { StartKycInput } from "../services/transactions";

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

export class InMemoryKycJobQueue implements KycJobQueue {
  private readonly jobs: KycJob[] = [];

  async enqueue(job: KycJob): Promise<void> {
    this.jobs.push(job);
  }

  drain(): KycJob[] {
    return this.jobs.splice(0, this.jobs.length);
  }
}
