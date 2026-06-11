-- Migration 003: pin search_path on all remaining public functions
-- APPLIED to production 2026-06-11 (PROD-SQL-2) as remote migration
--   pin_search_path_on_remaining_functions, after the exact owner phrase
--   APPLY SEARCH_PATH HARDENING CONFIRMED.
-- Closes the Supabase advisor finding `function_search_path_mutable` (14 functions:
-- 11 SECURITY DEFINER + 3 invoker) — without a pinned search_path, an
-- attacker-controlled schema earlier in a caller's path could shadow the tables and
-- functions these bodies reference (search-path hijack, privilege escalation on the
-- SECURITY DEFINER ones).
--
-- Pattern notes:
-- * `search_path = public` matches the 3 functions hardened earlier by the live
--   `fix_function_search_paths` migration.
-- * crypt()/gen_salt() calls in the password functions are already schema-qualified
--   (`extensions.crypt`, per the live `fix_pgcrypto_schema_prefix_v2` migration), so
--   `public` alone is sufficient there — verified against live prosrc before applying.
-- * match_knowledge_chunks uses the unqualified pgvector `<=>` operator, so it also
--   needs the `extensions` schema in its path.
-- Post-apply verification: 0 functions left with NULL proconfig; functional probes of
-- verify_child_login (bcrypt path), get_valid_credit_balance, get_child_limits_summary,
-- and match_knowledge_chunks all executed correctly; live /api/auth/child-login -> 401.

ALTER FUNCTION public.check_child_limit() SET search_path = public;
ALTER FUNCTION public.check_policy_acceptance(uuid, text, text) SET search_path = public;
ALTER FUNCTION public.delete_child_profile(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.delete_parent_account(uuid) SET search_path = public;
ALTER FUNCTION public.enforce_subscription_expiry() SET search_path = public;
ALTER FUNCTION public.get_child_credit_usage(uuid, text) SET search_path = public;
ALTER FUNCTION public.get_child_limits_summary(uuid) SET search_path = public;
ALTER FUNCTION public.get_valid_credit_balance(uuid) SET search_path = public;
ALTER FUNCTION public.match_knowledge_chunks(vector, double precision, integer, text[], text[], integer[]) SET search_path = public, extensions;
ALTER FUNCTION public.record_child_consent(uuid, uuid, text, text, text, text) SET search_path = public;
ALTER FUNCTION public.record_signup_consent(uuid, text, text, text, text, text, text) SET search_path = public;
ALTER FUNCTION public.set_child_password(uuid, uuid, text, text) SET search_path = public;
ALTER FUNCTION public.verify_child_login(text, text, text) SET search_path = public;
ALTER FUNCTION public.verify_child_login(text, text) SET search_path = public;
