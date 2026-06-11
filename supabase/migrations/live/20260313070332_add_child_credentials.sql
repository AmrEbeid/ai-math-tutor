
-- Add login credentials to children table
ALTER TABLE children ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE children ADD COLUMN IF NOT EXISTS password_hash text;

-- Create index for child login lookups
CREATE INDEX IF NOT EXISTS idx_children_username ON children(username);

-- Function to verify child login (returns child + parent info)
CREATE OR REPLACE FUNCTION verify_child_login(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_child record;
  v_balance integer;
BEGIN
  SELECT c.*, p.email as parent_email, p.full_name as parent_name
  INTO v_child
  FROM children c
  JOIN profiles p ON p.id = c.parent_id
  WHERE c.username = p_username
    AND c.password_hash = crypt(p_password, c.password_hash)
    AND c.is_active = true;

  IF v_child IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid username or password');
  END IF;

  -- Get parent credit balance
  SELECT COALESCE(
    (SELECT balance_after FROM credit_ledger
     WHERE parent_id = v_child.parent_id
     ORDER BY created_at DESC LIMIT 1), 0
  ) INTO v_balance;

  RETURN json_build_object(
    'success', true,
    'child_id', v_child.id,
    'child_name', v_child.name,
    'grade', v_child.grade,
    'language', v_child.preferred_language,
    'parent_id', v_child.parent_id,
    'credits', v_balance
  );
END;
$$;

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to set child password (called by parent via API)
CREATE OR REPLACE FUNCTION set_child_password(p_child_id uuid, p_parent_id uuid, p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_child record;
BEGIN
  -- Verify child belongs to parent
  SELECT * INTO v_child FROM children WHERE id = p_child_id AND parent_id = p_parent_id;
  IF v_child IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Child not found');
  END IF;

  -- Check username uniqueness
  IF EXISTS (SELECT 1 FROM children WHERE username = p_username AND id != p_child_id) THEN
    RETURN json_build_object('success', false, 'error', 'Username already taken');
  END IF;

  -- Set credentials
  UPDATE children
  SET username = p_username, password_hash = crypt(p_password, gen_salt('bf'))
  WHERE id = p_child_id;

  RETURN json_build_object('success', true);
END;
$$;
