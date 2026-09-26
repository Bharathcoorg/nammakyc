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

export interface Env extends RouteEnv {
  ENVIRONMENT: string;
  KYC_QUEUE?: { send(body: unknown): Promise<void> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = requestId(request);
    try {
      validateRequest(request);
      const queue = env.KYC_QUEUE ? new CloudflareKycQueue(env.KYC_QUEUE) : undefined;
      const response = await route(request, { ...env, QUEUE: queue });
      return applySecurityHeaders(
        response ?? Response.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, { status: 404 }),
        id
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const status = message === "JSON content type required" || message === "Request body too large" ? 415 : 500;
      return applySecurityHeaders(
        Response.json({
          error: {
            code: status === 415 ? "INVALID_REQUEST" : "INTERNAL_ERROR",
            message: status === 415 ? message : "Internal server error"
          }
        }, { status }),
        id
      );
    }
  },

  async queue(
    batch: { messages: Array<{ body: unknown; attempts: number; ack(): void; retry(options?: { delaySeconds?: number }): void }> },
    env: Env
  ): Promise<void> {
    const service = new TransactionService(
      createTransactionRepository(env.DB),
      new MockPdsProvider(),
      new MockAadhaarProvider(),
      new MockKycProvider()
    );
    const worker = new KycWorker(service);

    for (const message of batch.messages) {
      try {
        const envelope = message.body as QueueEnvelope;
        if (envelope?.version !== 1 || !envelope.job) {
          message.ack();
          continue;
        }
        envelope.job.attempt = Math.max(envelope.job.attempt, message.attempts ?? 0);
        const result = await worker.consume(envelope.job);
        if (result.retryable) message.retry({ delaySeconds: 30 });
        else message.ack();
      } catch {
        message.retry({ delaySeconds: 30 });
      }
    }
  }
};
