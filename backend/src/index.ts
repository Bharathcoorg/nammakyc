import { route, type RouteEnv } from "./routes/router";
import { applySecurityHeaders, requestId } from "./security/headers";
import { validateRequest } from "./security/request";
import { CloudflareKycQueue, processKycJob, type KycJob } from "./queues/kyc";
import { MockPdsProvider } from "./providers/pds/mock";
import { MockAadhaarProvider } from "./providers/aadhaar/mock";
import { MockKycProvider } from "./providers/kyc/mock";
import { isRetryableKycError, TransactionService } from "./services/transactions";
import { createTransactionRepository } from "./repositories/factory";
import { ConsoleAuditSink, type AuditSink } from "./observability/events";

export interface QueueBinding { send(body: KycJob): Promise<void> }
export interface Env extends RouteEnv {
  ENVIRONMENT: string;
  AUDIT?: AuditSink;
  KYC_QUEUE?: QueueBinding;
  RETENTION_IDEMPOTENCY_DAYS?: string;
}

function responseWithHeaders(response: Response, id: string): Response {
  return applySecurityHeaders(response, id);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = requestId(request);
    try {
      await validateRequest(request);
      const queue = env.KYC_QUEUE ? new CloudflareKycQueue(env.KYC_QUEUE) : undefined;
      const audit = env.AUDIT ?? new ConsoleAuditSink();
      return responseWithHeaders(
        await route(request, { ...env, QUEUE: queue, AUDIT: audit }) ??
          Response.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, { status: 404 }),
        id
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const status = message === "JSON content type required" || message === "Request body too large" ? 415 : 500;
      return responseWithHeaders(
        Response.json(
          { error: { code: status === 415 ? "INVALID_REQUEST" : "INTERNAL_ERROR", message: status === 415 ? message : "Internal server error" } },
          { status }
        ),
        id
      );
    }
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    const rawDays = env.RETENTION_IDEMPOTENCY_DAYS?.trim();
    if (!rawDays) return;
    const days = Number(rawDays);
    if (!Number.isFinite(days) || days <= 0 || days > 3650) throw new Error("Invalid idempotency retention configuration");
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    const repository = createTransactionRepository(env.DB);
    const deleted = await repository.purgeIdempotencyBefore(cutoff);
    (env.AUDIT ?? new ConsoleAuditSink()).emit({
      event: "transaction.cleanup",
      requestId: "system-retention",
      occurredAt: new Date().toISOString(),
      status: `idempotency_deleted:${deleted}`
    });
  },

  async queue(
    batch: {
      messages: Array<{
        body: KycJob;
        attempts: number;
        retry(options?: { delaySeconds?: number }): void;
      }>;
    },
    env: Env
  ): Promise<void> {
    if (env.ENVIRONMENT === "production") throw new Error("Production provider configuration is required before queue processing");
    const repository = createTransactionRepository(env.DB);
    const audit = env.AUDIT ?? new ConsoleAuditSink();
    const service = new TransactionService(repository, new MockPdsProvider(), new MockAadhaarProvider(), new MockKycProvider(), audit);

    for (const message of batch.messages) {
      try {
        await processKycJob(message.body, service);
      } catch (error) {
        if (isRetryableKycError(error)) {
          const attempt = Math.max(1, message.attempts);
          const delaySeconds = Math.min(60, 2 ** Math.min(attempt - 1, 5));
          message.retry({ delaySeconds });
        } else {
          await service.markFailed(message.body.transactionId);
        }
      }
    }
  }
};
