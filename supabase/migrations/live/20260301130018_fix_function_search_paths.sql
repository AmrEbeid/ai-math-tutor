
-- Fix security: set search_path on all functions

CREATE OR REPLACE FUNCTION public.get_credit_balance(p_parent_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(amount), 0)::INTEGER
  FROM public.credit_ledger
  WHERE parent_id = p_parent_id;
$$ LANGUAGE SQL STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION public.deduct_credit(p_parent_id UUID, p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO current_balance
  FROM public.credit_ledger
  WHERE parent_id = p_parent_id;

  IF current_balance <= 0 THEN
    RETURN -1;
  END IF;

  new_balance := current_balance - 1;

  INSERT INTO public.credit_ledger (parent_id, amount, balance_after, type, description)
  VALUES (p_parent_id, -1, new_balance, 'usage', 'Tutoring session: ' || p_session_id::TEXT);

  UPDATE public.sessions
  SET credits_used = credits_used + 1,
      interaction_count = interaction_count + 1
  WHERE id = p_session_id;

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE OR REPLACE FUNCTION public.add_signup_bonus()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.credit_ledger (parent_id, amount, balance_after, type, description)
  VALUES (NEW.id, 10, 10, 'signup_bonus', 'Welcome bonus - 10 free credits');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;
