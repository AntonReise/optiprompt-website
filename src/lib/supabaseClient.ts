/**
 * Supabase Client Setup
 * 
 * This file creates and exports the Supabase client instance.
 * 
 * The client will automatically use these environment variables.
 * If they're not set, the app will show appropriate messages.
 */

import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './supabase';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a singleton Supabase client
// If credentials are not configured, we'll create a client with empty strings
// and handle errors gracefully in the auth functions
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper to check if Supabase is properly configured
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  }
  return supabase;
};

