-- Migration 004: drop the leftover temp_transfer table
-- APPLIED to production 2026-06-11 (PROD-SQL-3) as remote migration
--   drop_temp_transfer_table, after the exact owner phrase
--   DROP TEMP_TRANSFER CONFIRMED.
-- The table (id integer, content text, created_at timestamptz) had zero references in
-- the codebase and held a single row from a past manual transfer; the owner reviewed
-- the row before confirming. Post-apply verification: to_regclass NULL, 19 public
-- tables remain, all with RLS enabled.
DROP TABLE IF EXISTS public.temp_transfer;
