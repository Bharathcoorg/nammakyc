export type MetricName =
  | "http.requests"
  | "http.errors"
  | "http.responses"
  | "kyc.created"
  | "kyc.succeeded"
  | "kyc.failed"
  | "queue.retried"
  | "queue.invalid"
  | "queue.succeeded"
  | "queue.failed"
  | "queue.duplicate"
  | "provider.timeout"
  | "provider.failure";

export interface MetricEvent {
  name: MetricName;
  value?: number;
  requestId?: string;
  route?: string;
  provider?: "aadhaar"|"kyc"|"pds";
  status?: number;
  occurredAt: string;
}

export interface MetricsSink {
  increment(name: MetricName, labels?: Omit<MetricEvent,"name"|"occurredAt"|"value">): void|Promise<void>;
}

export class NoopMetricsSink implements MetricsSink {
  increment(_name: MetricName, _labels?: Omit<MetricEvent,"name"|"occurredAt"|"value">): void {}
}

export class ConsoleMetricsSink implements MetricsSink {
  increment(name: MetricName, labels?: Omit<MetricEvent,"name"|"occurredAt"|"value">): void {
    console.log(JSON.stringify({type:"metric",name,value:1,occurredAt:new Date().toISOString(),...labels}));
  }
}
