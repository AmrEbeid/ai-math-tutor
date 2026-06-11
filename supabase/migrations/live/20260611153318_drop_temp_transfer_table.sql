-- Drop the leftover temp_transfer table (owner-confirmed 2026-06-11 with the exact
-- phrase DROP TEMP_TRANSFER CONFIRMED). It had no references anywhere in the codebase
-- (api/, lib/, public/, tests/, scripts/) and held a single row (id, content text,
-- created_at) from a past manual transfer, reviewed by the owner before this drop.
DROP TABLE IF EXISTS public.temp_transfer;