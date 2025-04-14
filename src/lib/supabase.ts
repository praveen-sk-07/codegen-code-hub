
import { createClient } from '@supabase/supabase-js';

// Use the provided environment variables or fallback to the hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hhcqjzszbkdawyxldhqd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3FqenN6YmtkYXd5eGxkaHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTA0NzgsImV4cCI6MjA2MDE4NjQ3OH0.a-BTHulGtWJ0cp68KAvnOlKDb-xHKr_4pK-xe4Iit24';

// Only log warnings in development mode when using fallbacks
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Supabase URL or Anon Key missing from environment variables. Using hardcoded values.');
  console.warn('For production, make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
