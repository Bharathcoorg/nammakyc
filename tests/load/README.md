# Load-test harness

The k6 scenario in `tests/load/k6.js` exercises the public KYC creation boundary with synthetic references.

Example:

```sh
BASE_URL=https://test.example RPS=5 DURATION=30s k6 run tests/load/k6.js
```

Use only a dedicated test deployment with mock/sandbox providers. Never point this harness at production or real citizen data.

For larger exercises, increase RPS and duration gradually and record p50/p95/p99 latency, HTTP errors, queue depth, oldest-message age, provider failures, D1 errors, and recovery behaviour. The thresholds in the script are starter checks, not production capacity claims.
