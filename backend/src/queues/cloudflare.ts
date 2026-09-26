import type { KycJob, KycJobQueue } from "./kyc";
import { encodeKycJob } from "./consumer";

export interface QueueBindingLike {
  send(body: unknown): Promise<void>;
}

export class CloudflareKycQueue implements KycJobQueue {
  constructor(private readonly binding: QueueBindingLike) {}

  async enqueue(job: KycJob): Promise<void> {
    await this.binding.send(encodeKycJob(job));
  }
}
