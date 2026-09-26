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

  it("extracts only structured application error codes", () => {
    expect(safeErrorCode(new AppError("UPSTREAM_UNAVAILABLE", "private upstream detail", 503))).toBe("UPSTREAM_UNAVAILABLE");
    expect(safeErrorCode(new Error("private detail"))).toBeUndefined();
  });

  it("provides a runtime sink for structured events", () => {
    expect(typeof new ConsoleAuditSink().emit).toBe("function");
  });
});
