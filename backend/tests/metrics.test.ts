import { describe, expect, it } from "vitest";
import { ConsoleMetricsSink, NoopMetricsSink } from "../src/observability/metrics";

describe("metrics boundary", () => {
  it("keeps the no-op sink side-effect free", () => {
    expect(() => new NoopMetricsSink().increment("http.requests",{route:"/health"})).not.toThrow();
  });

  it("emits structured metric records without citizen identifiers", () => {
    const original=console.log;
    let output="";
    console.log=((value:unknown)=>{output=String(value)}) as typeof console.log;
    try {
      new ConsoleMetricsSink().increment("queue.retried",{route:"queue"});
    } finally {
      console.log=original;
    }
    expect(output).toContain('"type":"metric"');
    expect(output).toContain('"name":"queue.retried"');
    expect(output).not.toMatch(/aadhaar|otp|biometric|rationCard|memberReference/i);
  });
});
