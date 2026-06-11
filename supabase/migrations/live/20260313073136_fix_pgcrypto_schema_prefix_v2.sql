
-- Drop and recreate both functions with extensions schema prefix
DROP FUNCTION IF EXISTS set_child_password;
DROP FUNCTION IF EXISTS verify_child_login;

CREATE FUNCTION set_child_password(p_parent_id uuid, p_child_id uuid, p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_child record;
BEGIN
  SELECT * INTO v_child FROM children WHERE id = p_child_id AND parent_id = p_parent_id;
  IF v_child IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Child not found');
  END IF;

  IF EXISTS (SELECT 1 FROM children WHERE username = p_username AND id != p_child_id) THEN
    RETURN json_build_object('success', false, 'error', 'Username already taken');
  END IF;

  UPDATE children
  SET username = p_username, password_hash = extensions.crypt(p_password, extensions.gen_salt('bf'))
  WHERE id = p_child_id;

  RETURN json_build_object('success', true);
END;
$$;

CREATE FUNCTION verify_child_login(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_child record;
BEGIN
  SELECT c.*, p.id as plan_parent_id
  INTO v_child
  FROM children c
  JOIN auth.users u ON c.parent_id = u.id
  LEFT JOIN subscriptions s ON s.user_id = c.parent_id AND s.status = 'active'
  WHERE c.username = p_username;

  IF v_child IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid username or password');
  END IF;

  IF v_child.password_hash IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Login not set up yet');
  END IF;

  IF v_child.password_hash != extensions.crypt(p_password, v_child.password_hash) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid username or password');
  END IF;

  RETURN json_build_object(
    'success', true,
    'child_id', v_child.id,
    'parent_id', v_child.parent_id,
    'name', v_child.name,
    'grade', v_child.grade
  );
END;
$$;
