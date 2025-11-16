/**
 * Supabase Configuration Utility
 * 
 * This file provides a utility to check if Supabase is configured
 * and can be used to initialize the Supabase client once configured.
 * 
 * To enable Supabase authentication:
 * 1. Set NEXT_PUBLIC_SUPABASE_URL in your .env.local file
 * 2. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file
 * 3. Install @supabase/supabase-js: npm install @supabase/supabase-js
 * 4. Uncomment the code below and update the authentication pages
 */

export const isSupabaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Uncomment once Supabase is set up:
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

