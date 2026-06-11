
-- 1. Drop the global UNIQUE constraint on username
ALTER TABLE public.children DROP CONSTRAINT IF EXISTS children_username_key;

-- 2. Add composite UNIQUE on (parent_id, username) so same parent can't have duplicate usernames
ALTER TABLE public.children ADD CONSTRAINT children_parent_username_unique UNIQUE (parent_id, username);

-- 3. Replace verify_child_login to require parent email
CREATE OR REPLACE FUNCTION public.verify_child_login(p_parent_email text, p_username text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_child record;
BEGIN
  SELECT c.*
  INTO v_child
  FROM children c
  JOIN profiles p ON c.parent_id = p.id
  WHERE c.username = p_username
    AND p.email = p_parent_email;

  IF v_child IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  IF v_child.password_hash IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Login not set up yet');
  END IF;

  IF v_child.password_hash != extensions.crypt(p_password, v_child.password_hash) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  RETURN json_build_object(
    'success', true,
    'child_id', v_child.id,
    'parent_id', v_child.parent_id,
    'name', v_child.name,
    'grade', v_child.grade,
    'language', v_child.preferred_language
  );
END;
$function$;
