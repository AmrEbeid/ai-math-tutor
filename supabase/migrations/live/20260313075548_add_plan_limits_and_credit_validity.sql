
-- Add max_children and billing_cycle to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS max_children integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual'));

-- Add expires_at to credit_ledger for credit validity tracking
ALTER TABLE credit_ledger
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Create weekly_reports add-on table
CREATE TABLE IF NOT EXISTS report_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) NOT NULL,
  child_id uuid REFERENCES children(id) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_subscription_id text,
  price_cents integer DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Enable RLS on report_subscriptions
ALTER TABLE report_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own report subscriptions" ON report_subscriptions
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert own report subscriptions" ON report_subscriptions
  FOR INSERT WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update own report subscriptions" ON report_subscriptions
  FOR UPDATE USING (parent_id = auth.uid());

-- Create weekly_reports table to store generated reports
CREATE TABLE IF NOT EXISTS weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) NOT NULL,
  child_id uuid REFERENCES children(id) NOT NULL,
  report_week_start date NOT NULL,
  summary text,
  strengths text,
  areas_to_improve text,
  teacher_notes text,
  sessions_count integer DEFAULT 0,
  credits_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own weekly reports" ON weekly_reports
  FOR SELECT USING (parent_id = auth.uid());

-- Update the add_child function to enforce max_children limit
CREATE OR REPLACE FUNCTION check_child_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max integer;
  v_count integer;
BEGIN
  -- Get the max_children from active subscription
  SELECT COALESCE(max_children, 1) INTO v_max
  FROM subscriptions
  WHERE parent_id = NEW.parent_id AND status = 'active'
  ORDER BY created_at DESC LIMIT 1;

  -- If no subscription, allow 1 child (free tier)
  IF v_max IS NULL THEN
    v_max := 1;
  END IF;

  -- Count existing children
  SELECT COUNT(*) INTO v_count FROM children WHERE parent_id = NEW.parent_id;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Child limit reached. Your plan allows up to % children. Please upgrade to add more.', v_max;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for child limit check
DROP TRIGGER IF EXISTS check_child_limit_trigger ON children;
CREATE TRIGGER check_child_limit_trigger
  BEFORE INSERT ON children
  FOR EACH ROW
  EXECUTE FUNCTION check_child_limit();

-- Function to get valid (non-expired) credit balance
CREATE OR REPLACE FUNCTION get_valid_credit_balance(p_parent_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance integer;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_balance
  FROM credit_ledger
  WHERE parent_id = p_parent_id
    AND (expires_at IS NULL OR expires_at > now());
  RETURN v_balance;
END;
$$;
