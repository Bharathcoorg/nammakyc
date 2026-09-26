CREATE TABLE IF NOT EXISTS consent_artifacts (
 consent_reference TEXT PRIMARY KEY,
 purpose TEXT NOT NULL CHECK(purpose = 'ration-card-e-kyc'),
 policy_version TEXT NOT NULL,
 language TEXT NOT NULL CHECK(language IN ('en','kn')),
 captured_at TEXT NOT NULL,
 transaction_reference TEXT NOT NULL UNIQUE,
 FOREIGN KEY(transaction_reference) REFERENCES kyc_transactions(request_id)
);
CREATE INDEX IF NOT EXISTS idx_consent_transaction ON consent_artifacts(transaction_reference);
