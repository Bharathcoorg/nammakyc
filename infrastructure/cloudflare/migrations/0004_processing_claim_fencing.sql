ALTER TABLE kyc_transactions ADD COLUMN processing_claim_id TEXT;
CREATE INDEX IF NOT EXISTS idx_kyc_processing_claim_id ON kyc_transactions(processing_claim_id);
