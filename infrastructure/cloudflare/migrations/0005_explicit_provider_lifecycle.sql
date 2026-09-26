-- Expand the persisted lifecycle and keep Aadhaar/PDS references separate.
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

DROP TABLE kyc_transactions;
ALTER TABLE kyc_transactions_v2 RENAME TO kyc_transactions;

CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_processing_claim_id ON kyc_transactions(processing_claim_id);
