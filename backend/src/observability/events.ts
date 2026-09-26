export type KycEventName =
  | "transaction.created"
  | "authentication.started"
  | "authentication.completed"
  | "authentication.failed"
  | "kyc.submission.completed"
  | "transaction.retrying"
  | "transaction.failed"
  | "transaction.succeeded"
  | "transaction.cleanup";

export interface KycAuditEvent {
  event: KycEventName;
  requestId: string;
  occurredAt: string;
  status?: string;
  provider?: "aadhaar" | "kyc";
  durationMs?: number;
  errorCode?: string;
}

export interface AuditSink {
  emit(event: KycAuditEvent): void | Promise<void>;
}

export class ConsoleAuditSink implements AuditSink {
  emit(event: KycAuditEvent): void {
    console.log(JSON.stringify(event));
  }
}

export function safeErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error && typeof (error as {code?: unknown}).code === "string") {
    return (error as {code: string}).code;
  }
  return undefined;
}
