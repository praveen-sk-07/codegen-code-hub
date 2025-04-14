
-- Create a function to check if an email exists
-- This function will be used by our edge function to check email availability
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
DECLARE
  email_exists boolean;
BEGIN
  -- Check if the email exists in the auth.users table
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = email_to_check
  ) INTO email_exists;
  
  RETURN email_exists;
END;
$$;

-- Grant necessary permissions (to be executed by a Supabase admin)
GRANT EXECUTE ON FUNCTION check_email_exists TO authenticated;
GRANT EXECUTE ON FUNCTION check_email_exists TO anon;
