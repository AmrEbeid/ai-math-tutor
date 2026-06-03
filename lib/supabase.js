import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env.js';

// Server-side Supabase client (uses service role key for admin operations)
export function createServerClient() {
  return createClient(
    getEnv('SUPABASE_URL'),
    getEnv('SUPABASE_SERVICE_ROLE_KEY')
  );
}

// Authenticated client (uses user's JWT from request)
export function createAuthClient(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;

  const client = createClient(
    getEnv('SUPABASE_URL'),
    getEnv('SUPABASE_ANON_KEY'),
    {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }
  );
  return client;
}

// Extract and verify user from request
export async function getUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;

  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}
