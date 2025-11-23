/**
 * User Profile Helpers
 * 
 * TODO: Implement these functions once the Supabase database schema is set up.
 * 
 * Expected database schema:
 * - profiles table with columns: id (uuid, references auth.users), name, email, company, phone, created_at, updated_at
 */

import { supabase, getSupabaseClient } from './supabaseClient';
import { isSupabaseConfigured } from './supabase';
import { getCurrentUser } from './auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ data: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured') };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: new Error(error.message || 'An error occurred') };
  }
}

