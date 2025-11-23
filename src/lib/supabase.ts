/**
 * Supabase Configuration Utility
 * 
 * This file provides a utility to check if Supabase is configured.
 * 
 * The Supabase client is created in src/lib/supabaseClient.ts
 */

export const isSupabaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
  );
};

