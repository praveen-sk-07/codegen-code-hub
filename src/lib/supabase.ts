
import { createClient } from '@supabase/supabase-js';

// Supabase connection details should be replaced with your actual Supabase URL and anon key
// These are public keys that can be safely used in the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key missing. Make sure your environment variables are set correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
