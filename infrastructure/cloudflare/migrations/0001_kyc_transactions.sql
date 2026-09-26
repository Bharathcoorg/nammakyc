CREATE TABLE IF NOT EXISTS kyc_transactions (
  request_id TEXT PRIMARY KEY,
  member_reference TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received','validating','authenticating','processing','success','retrying','failed')),
  provider_reference TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  idempotency_key TEXT PRIMARY KEY,
  request_fingerprint TEXT NOT NULL,
  request_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES kyc_transactions(request_id)
);

CREATE INDEX IF NOT EXISTS idx_kyc_transactions_status ON kyc_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_transactions_updated_at ON kyc_transactions(updated_at);
