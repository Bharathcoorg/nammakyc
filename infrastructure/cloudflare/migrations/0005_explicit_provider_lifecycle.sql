-- Expand the persisted lifecycle and keep Aadhaar/PDS references separate.
-- The original schema has foreign-key children, so rebuild those children around
-- the replacement parent table instead of dropping the parent while references exist.
CREATE TABLE kyc_transactions_v2 (
 request_id TEXT PRIMARY KEY,
 household_reference TEXT NOT NULL,
 member_reference TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('received','validating','aadhaar_pending','aadhaar_authenticating','aadhaar_authenticated','pds_processing','success','retrying','failed')),
 authentication_method TEXT NOT NULL DEFAULT 'face' CHECK(authentication_method IN ('face','otp')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 aadhaar_session_reference TEXT,
 aadhaar_authentication_reference TEXT,
 pds_transaction_reference TEXT,
 processing_claim_id TEXT
);

INSERT INTO kyc_transactions_v2 (
 request_id,household_reference,member_reference,status,authentication_method,created_at,updated_at,
 aadhaar_authentication_reference,pds_transaction_reference,processing_claim_id
)
SELECT
 request_id,household_reference,member_reference,
 CASE status
  WHEN 'authenticating' THEN 'aadhaar_authenticating'
  WHEN 'processing' THEN 'pds_processing'
  ELSE status
 END,
 'face',
 created_at,updated_at,
 CASE WHEN status='processing' THEN provider_reference END,
 CASE WHEN status='success' THEN provider_reference END,
 processing_claim_id
FROM kyc_transactions;

CREATE TABLE idempotency_keys_v2 (
 idempotency_key TEXT PRIMARY KEY,
 request_fingerprint TEXT NOT NULL,
 request_id TEXT NOT NULL UNIQUE,
 created_at TEXT NOT NULL,
 FOREIGN KEY(request_id) REFERENCES kyc_transactions_v2(request_id)
);

INSERT INTO idempotency_keys_v2 (
 idempotency_key,request_fingerprint,request_id,created_at
)
SELECT idempotency_key,request_fingerprint,request_id,created_at
FROM idempotency_keys;

CREATE TABLE consent_artifacts_v2 (
 consent_reference TEXT PRIMARY KEY,
 purpose TEXT NOT NULL CHECK(purpose = 'ration-card-e-kyc'),
 policy_version TEXT NOT NULL,
 language TEXT NOT NULL CHECK(language IN ('en','kn')),
 captured_at TEXT NOT NULL,
 transaction_reference TEXT NOT NULL UNIQUE,
 FOREIGN KEY(transaction_reference) REFERENCES kyc_transactions_v2(request_id)
);

INSERT INTO consent_artifacts_v2 (
 consent_reference,purpose,policy_version,language,captured_at,transaction_reference
)
SELECT consent_reference,purpose,policy_version,language,captured_at,transaction_reference
FROM consent_artifacts;

DROP TABLE consent_artifacts;
DROP TABLE idempotency_keys;
DROP TABLE kyc_transactions;

ALTER TABLE kyc_transactions_v2 RENAME TO kyc_transactions;
ALTER TABLE idempotency_keys_v2 RENAME TO idempotency_keys;
ALTER TABLE consent_artifacts_v2 RENAME TO consent_artifacts;

CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_processing_claim_id ON kyc_transactions(processing_claim_id);
CREATE INDEX IF NOT EXISTS idx_consent_transaction ON consent_artifacts(transaction_reference);
