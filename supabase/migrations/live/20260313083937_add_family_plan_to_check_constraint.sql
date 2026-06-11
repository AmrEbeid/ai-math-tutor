
ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_plan_name_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_name_check
  CHECK (plan_name = ANY (ARRAY['free'::text, 'starter'::text, 'standard'::text, 'premium'::text, 'family'::text]));
