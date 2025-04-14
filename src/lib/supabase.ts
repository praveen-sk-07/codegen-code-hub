
import { createClient } from '@supabase/supabase-js';

// For development purposes, we'll use placeholder values if environment variables are not available
// In production, these should be properly set in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log a warning instead of an error to prevent blocking the application
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Supabase URL or Anon Key missing. Using placeholder values for development.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  console.warn('For production, make sure to use real Supabase credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
