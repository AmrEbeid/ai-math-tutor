
DROP FUNCTION IF EXISTS verify_child_login;

CREATE FUNCTION verify_child_login(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_child record;
BEGIN
  SELECT c.*
  INTO v_child
  FROM children c
  JOIN auth.users u ON c.parent_id = u.id
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
