ALTER TABLE children ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'UAE';

COMMENT ON COLUMN children.country IS 'The country whose math curriculum the child follows (e.g., UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, Egypt, UK, US)';