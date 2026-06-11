
-- ============================================
-- AI Math Tutor - Core Database Schema
-- ============================================

-- 1. PROFILES (extends Supabase auth.users)
-- One row per parent who signs up
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHILDREN (linked to parent)
-- Each parent can have multiple children with different grades
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 9),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREDIT LEDGER (tracks every credit movement)
-- Positive = credits added (purchase, signup bonus, rollover)
-- Negative = credits consumed (tutoring session)
CREATE TABLE public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signup_bonus', 'purchase', 'subscription', 'usage', 'rollover', 'expiry', 'refund')),
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBSCRIPTIONS (Stripe subscription tracking)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL CHECK (plan_name IN ('starter', 'standard', 'premium')),
  credits_per_month INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SESSIONS (each tutoring conversation)
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'stuck_loop', 'flagged')),
  interaction_count INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  grade INTEGER NOT NULL,
  topic TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 6. MESSAGES (individual messages within a session)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PARENT NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('stuck_loop', 'credits_low', 'credits_empty', 'session_flagged', 'weekly_report')),
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  session_id UUID REFERENCES public.sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_children_parent ON public.children(parent_id);
CREATE INDEX idx_credit_ledger_parent ON public.credit_ledger(parent_id);
CREATE INDEX idx_credit_ledger_created ON public.credit_ledger(created_at DESC);
CREATE INDEX idx_sessions_parent ON public.sessions(parent_id);
CREATE INDEX idx_sessions_child ON public.sessions(child_id);
CREATE INDEX idx_messages_session ON public.messages(session_id);
CREATE INDEX idx_notifications_parent ON public.notifications(parent_id, read);
CREATE INDEX idx_subscriptions_parent ON public.subscriptions(parent_id);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);

-- ============================================
-- FUNCTION: Get parent's current credit balance
-- ============================================
CREATE OR REPLACE FUNCTION public.get_credit_balance(p_parent_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(amount), 0)::INTEGER
  FROM public.credit_ledger
  WHERE parent_id = p_parent_id;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- FUNCTION: Deduct credit (returns new balance, -1 if insufficient)
-- ============================================
CREATE OR REPLACE FUNCTION public.deduct_credit(p_parent_id UUID, p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT COALESCE(SUM(amount), 0) INTO current_balance
  FROM public.credit_ledger
  WHERE parent_id = p_parent_id;

  IF current_balance <= 0 THEN
    RETURN -1;
  END IF;

  new_balance := current_balance - 1;

  INSERT INTO public.credit_ledger (parent_id, amount, balance_after, type, description)
  VALUES (p_parent_id, -1, new_balance, 'usage', 'Tutoring session: ' || p_session_id::TEXT);

  -- Update session credits_used
  UPDATE public.sessions
  SET credits_used = credits_used + 1,
      interaction_count = interaction_count + 1
  WHERE id = p_session_id;

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Add signup bonus credits
-- ============================================
CREATE OR REPLACE FUNCTION public.add_signup_bonus()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.credit_ledger (parent_id, amount, balance_after, type, description)
  VALUES (NEW.id, 10, 10, 'signup_bonus', 'Welcome bonus - 10 free credits');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-add 10 credits when a profile is created
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.add_signup_bonus();

-- ============================================
-- FUNCTION: Auto-create profile on auth signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create profile when user signs up via Supabase Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Children: parents can only manage their own children
CREATE POLICY "Parents can view own children" ON public.children FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own children" ON public.children FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own children" ON public.children FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete own children" ON public.children FOR DELETE USING (auth.uid() = parent_id);

-- Credit ledger: parents can only view their own
CREATE POLICY "Parents can view own credits" ON public.credit_ledger FOR SELECT USING (auth.uid() = parent_id);

-- Subscriptions: parents can only view their own
CREATE POLICY "Parents can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = parent_id);

-- Sessions: parents can view their own
CREATE POLICY "Parents can view own sessions" ON public.sessions FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Messages: parents can view messages from their sessions
CREATE POLICY "Parents can view own messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = messages.session_id AND sessions.parent_id = auth.uid()));
CREATE POLICY "Parents can insert own messages" ON public.messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = messages.session_id AND sessions.parent_id = auth.uid()));

-- Notifications: parents can view/update their own
CREATE POLICY "Parents can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = parent_id);
