// src/services/supabase.js
// Centralized Supabase client — single source of truth
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lpgdolynzbgisbqbfwrf.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export default supabase;
