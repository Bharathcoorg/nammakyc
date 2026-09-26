import { AppError } from "../domain/errors";
import { isRetryableKycError, type TransactionService } from "../services/transactions";
import type { KycJob } from "./kyc";
import { isDuplicateDelivery, type KycJobConsumer, type KycJobResult } from "./consumer";

export class KycWorker implements KycJobConsumer {
  constructor(
    private readonly service: TransactionService,
    private readonly maxAttempts = 3
  ) {}

  async consume(job: KycJob): Promise<KycJobResult> {
    const current = await this.service["repository"].get(job.transactionId);
    if (isDuplicateDelivery(current, job)) {
      return { acknowledged: true, retryable: false };
    }

    try {
      await this.service.process({
        transactionId: job.transactionId,
        memberReference: job.input.memberReference,
        consentReference: job.input.consentReference
      });
      return { acknowledged: true, retryable: false };
    } catch (error) {
      if (!isRetryableKycError(error) || job.attempt + 1 >= this.maxAttempts) {
        return { acknowledged: true, retryable: false };
      }
      return { acknowledged: false, retryable: true };
    }
  }
}
