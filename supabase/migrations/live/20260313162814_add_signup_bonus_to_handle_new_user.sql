
-- Update handle_new_user to also grant 10 free signup credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  );

  -- Grant 10 free signup credits
  INSERT INTO public.credit_ledger (parent_id, amount, balance_after, type, description)
  VALUES (
    NEW.id,
    10,
    10,
    'signup_bonus',
    'Welcome bonus - 10 free credits'
  );

  -- Create a free subscription record
  INSERT INTO public.subscriptions (parent_id, plan_name, credits_per_month, price_cents, status, max_children)
  VALUES (
    NEW.id,
    'free',
    10,
    0,
    'active',
    1
  );

  RETURN NEW;
END;
$$;
