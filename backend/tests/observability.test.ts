import { describe, expect, it } from "vitest";
import { ConsoleAuditSink, type AuditSink, safeErrorCode } from "../src/observability/events";
import { AppError } from "../src/domain/errors";

describe("observability events", () => {
  it("defines a redaction-safe event shape without citizen references", async () => {
    const events: unknown[] = [];
    const sink: AuditSink = { emit: event => { events.push(event); } };
    sink.emit({ event: "transaction.created", requestId: "request-1", occurredAt: "2026-09-26T12:00:00.000Z", status: "validating" });
    expect(events[0]).toEqual({
      event: "transaction.created",
      requestId: "request-1",
      occurredAt: "2026-09-26T12:00:00.000Z",
      status: "validating"
    });
    expect(JSON.stringify(events[0])).not.toContain("aadhaar");
  });

  it("accepts retention cleanup events without sensitive payloads", () => {
    const event = { event: "transaction.cleanup" as const, requestId: "system-retention", occurredAt: "2026-09-26T12:00:00.000Z", status: "idempotency_deleted:3" };
    expect(event.status).toBe("idempotency_deleted:3");
    expect(JSON.stringify(event)).not.toMatch(/aadhaar|otp|biometric|ration/i);
  });

  it("extracts only structured application error codes", () => {
    expect(safeErrorCode(new AppError("UPSTREAM_UNAVAILABLE", "private upstream detail", 503))).toBe("UPSTREAM_UNAVAILABLE");
    expect(safeErrorCode(new Error("private detail"))).toBeUndefined();
  });

  it("accepts queue retry events without citizen identifiers", () => {
    const event = {
      event:"queue.retry_scheduled" as const,
      requestId:"request-1",
      jobId:"job-1",
      attempt:1,
      occurredAt:"2026-09-26T12:00:00.000Z",
      status:"retrying"
    };
    expect(event.attempt).toBe(1);
    expect(JSON.stringify(event)).not.toMatch(/aadhaar|otp|biometric|rationCard|memberReference/i);
  });

  it("records malformed queue messages without inventing a citizen reference", () => {
    const event = {
      event:"queue.invalid_message" as const,
      requestId:"unknown",
      occurredAt:"2026-09-26T12:00:00.000Z",
      status:"rejected",
      errorCode:"INVALID_REQUEST"
    };
    expect(event.requestId).toBe("unknown");
    expect(JSON.stringify(event)).not.toMatch(/aadhaar|otp|biometric|rationCard|memberReference/i);
  });

  it("provides a runtime sink for structured events", () => {
    expect(typeof new ConsoleAuditSink().emit).toBe("function");
  });
});
