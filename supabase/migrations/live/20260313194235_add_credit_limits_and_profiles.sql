
-- 1. Add credit limit columns to children table
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS credit_limit_daily integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS credit_limit_weekly integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS credit_limit_monthly integer DEFAULT NULL;

COMMENT ON COLUMN public.children.credit_limit_daily IS 'Max credits child can use per day. NULL = no daily limit.';
COMMENT ON COLUMN public.children.credit_limit_weekly IS 'Max credits child can use per week. NULL = no weekly limit.';
COMMENT ON COLUMN public.children.credit_limit_monthly IS 'Max credits child can use per month. NULL = no monthly limit.';

-- 2. Add country to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text DEFAULT NULL;

COMMENT ON COLUMN public.profiles.country IS 'Parent country (e.g., UAE, UK, US, Saudi Arabia)';

-- 3. Add credit_limit_reached to notifications type check
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type = ANY (ARRAY['stuck_loop','credits_low','credits_empty','session_flagged','weekly_report','credit_limit_reached']));

-- 4. Add child_id to notifications so we can link limit alerts to specific child
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS child_id uuid REFERENCES public.children(id) DEFAULT NULL;

-- 5. Function: get child credit usage for a given period
CREATE OR REPLACE FUNCTION public.get_child_credit_usage(
  p_child_id uuid,
  p_period text DEFAULT 'daily'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_usage integer;
  v_limit integer;
  v_period_start timestamptz;
  v_child record;
BEGIN
  -- Get child with limits
  SELECT * INTO v_child FROM children WHERE id = p_child_id;
  IF v_child IS NULL THEN
    RETURN json_build_object('error', 'Child not found');
  END IF;

  -- Determine period start
  CASE p_period
    WHEN 'daily' THEN
      v_period_start := date_trunc('day', now());
      v_limit := v_child.credit_limit_daily;
    WHEN 'weekly' THEN
      v_period_start := date_trunc('week', now());
      v_limit := v_child.credit_limit_weekly;
    WHEN 'monthly' THEN
      v_period_start := date_trunc('month', now());
      v_limit := v_child.credit_limit_monthly;
    ELSE
      RETURN json_build_object('error', 'Invalid period. Use daily, weekly, or monthly.');
  END CASE;

  -- Sum credits used in period
  SELECT COALESCE(SUM(credits_used), 0) INTO v_usage
  FROM sessions
  WHERE child_id = p_child_id
    AND started_at >= v_period_start;

  RETURN json_build_object(
    'child_id', p_child_id,
    'period', p_period,
    'usage', v_usage,
    'limit', v_limit,
    'limit_set', v_limit IS NOT NULL,
    'exceeded', CASE WHEN v_limit IS NOT NULL THEN v_usage >= v_limit ELSE false END,
    'remaining', CASE WHEN v_limit IS NOT NULL THEN GREATEST(v_limit - v_usage, 0) ELSE null END,
    'period_start', v_period_start
  );
END;
$function$;

-- 6. Function: get all credit limits and usage for a child (used by dashboard)
CREATE OR REPLACE FUNCTION public.get_child_limits_summary(p_child_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_daily json;
  v_weekly json;
  v_monthly json;
BEGIN
  SELECT public.get_child_credit_usage(p_child_id, 'daily') INTO v_daily;
  SELECT public.get_child_credit_usage(p_child_id, 'weekly') INTO v_weekly;
  SELECT public.get_child_credit_usage(p_child_id, 'monthly') INTO v_monthly;

  RETURN json_build_object(
    'daily', v_daily,
    'weekly', v_weekly,
    'monthly', v_monthly
  );
END;
$function$;
