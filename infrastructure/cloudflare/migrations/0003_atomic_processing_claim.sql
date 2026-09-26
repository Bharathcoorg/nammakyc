-- Atomically claim a transaction before calling external verification providers.
-- The conditional update prevents concurrent workers from both entering authentication.
CREATE INDEX IF NOT EXISTS idx_kyc_processing_claim ON kyc_transactions(status, updated_at);
