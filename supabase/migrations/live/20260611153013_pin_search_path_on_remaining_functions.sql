-- Security hardening (advisor: function_search_path_mutable): pin search_path on the
-- 14 remaining public functions (11 SECURITY DEFINER + 3 invoker) so an attacker-created
-- schema earlier in a caller's search_path can never shadow the tables/functions these
-- bodies reference. Matches the search_path=public pattern of the 3 functions hardened
-- by the earlier fix_function_search_paths migration. crypt()/gen_salt() calls are
-- already schema-qualified (extensions.crypt) so public alone is sufficient there;
-- match_knowledge_chunks additionally needs the extensions schema for the pgvector
-- <=> operator.

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