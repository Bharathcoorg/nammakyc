import { route, type RouteEnv } from "./routes/router";
import { applySecurityHeaders, requestId } from "./security/headers";
import { validateRequest } from "./security/request";
import { CloudflareKycQueue, type KycJob } from "./queues/kyc";
import { decodeKycJob } from "./queues/consumer";
import { KycWorker } from "./queues/worker";
import { MockPdsProvider } from "./providers/pds/mock";
import { MockAadhaarProvider } from "./providers/aadhaar/mock";
import { MockKycProvider } from "./providers/kyc/mock";
import { createTransactionRepository } from "./repositories/factory";
import { ConsoleAuditSink, type AuditSink } from "./observability/events";
import { TransactionService } from "./services/transactions";
import { queueRetryDelaySeconds } from "./queues/retry";
import { ConsoleMetricsSink, NoopMetricsSink } from "./observability/metrics";

export interface QueueBinding {
  send(body: unknown): Promise<void>;
}

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
      const metrics = env.METRICS ?? new ConsoleMetricsSink();
      const response = await route(request, { ...env, QUEUE: queue, AUDIT: audit, METRICS: metrics }) ??
        Response.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, { status: 404 });
      void metrics.increment("http.responses", { route: new URL(request.url).pathname, status: response.status });
      return responseWithHeaders(response, id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const status = message === "JSON content type required" ? 415 : message === "Request body too large" ? 413 : 500;
      const metrics = env.METRICS ?? new ConsoleMetricsSink();
      void metrics.increment("http.errors",{route:new URL(request.url).pathname});
      return responseWithHeaders(
        Response.json(
          { error: { code: status === 415 || status === 413 ? "INVALID_REQUEST" : "INTERNAL_ERROR", message: status === 415 || status === 413 ? message : "Internal server error" } },
          { status }
        ),
        id
      );
    }
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    const rawDays = env.RETENTION_IDEMPOTENCY_DAYS?.trim();
    if (!rawDays) return;
    if (!env.DB) throw new Error("D1 database configuration is required for retention cleanup");
    const days = Number(rawDays);
    if (!Number.isFinite(days) || days <= 0 || days > 3650) {
      throw new Error("Invalid idempotency retention configuration");
    }
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
        body: unknown;
        attempts: number;
        retry(options?: { delaySeconds?: number }): void;
      }>;
    },
    env: Env
  ): Promise<void> {
    if (env.ENVIRONMENT === "production" && (!env.DB || !env.PDS || !env.AADHAAR || !env.KYC)) {
      throw new Error("Production queue dependencies are required before processing");
    }

    const repository = createTransactionRepository(env.DB);
    const audit = env.AUDIT ?? new ConsoleAuditSink();
    const metrics = env.METRICS ?? new NoopMetricsSink();
    const service = new TransactionService(
      repository,
      env.PDS ?? new MockPdsProvider(),
      env.AADHAAR ?? new MockAadhaarProvider(),
      env.KYC ?? new MockKycProvider(),
      audit,
      metrics
    );
    const worker = new KycWorker(service);

    for (const message of batch.messages) {
      try {
        const job = decodeKycJob(message.body);
        const result = await worker.consume({
          ...job,
          attempt: Math.max(0, message.attempts - 1)
        });

        if (result.retryable && !result.acknowledged) {
          const attempt = Math.max(0, message.attempts - 1);
          const delaySeconds = queueRetryDelaySeconds(attempt);
          message.retry({ delaySeconds });
          void metrics.increment("queue.retried",{route:"queue"});
          audit.emit({
            event:"queue.retry_scheduled",
            requestId:job.transactionId,
            jobId:job.jobId,
            attempt,
            occurredAt:new Date().toISOString(),
            status:"retrying"
          });
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Invalid KYC queue envelope") {
          void metrics.increment("queue.invalid",{route:"queue"});
          audit.emit({
            event:"queue.invalid_message",
            requestId:"unknown",
            occurredAt:new Date().toISOString(),
            status:"rejected",
            errorCode:"INVALID_REQUEST"
          });
          throw error;
        }
        const job = (() => {
          try { return decodeKycJob(message.body); } catch { return undefined; }
        })();
        if (job) await service.markFailed(job.transactionId);
        throw error;
      }
    }
  }
};
