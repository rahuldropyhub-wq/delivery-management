import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ylzwxkyrhgmmdjolpgxm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsend4a3lyaGdtbWRqb2xwZ3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMTc2ODEsImV4cCI6MjEwMjY5MzY4MX0.ekbCbj9siEH05U5qT2P5nH_6Ss6cUJSXV-iZt62IrhM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
