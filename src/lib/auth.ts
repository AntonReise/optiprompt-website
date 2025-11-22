/**
 * Authentication Helpers
 * 
 * This file provides helper functions for authentication operations.
 * All functions handle the case where Supabase is not yet configured.
 */

import { supabase, getSupabaseClient } from './supabaseClient';
import { isSupabaseConfigured } from './supabase';
import type { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Type alias for auth errors
type AuthError = SupabaseAuthError | { message: string; status?: number };

/**
 * Get the current user session
 */
export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      session: null,
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  options?: { redirectTo?: string }
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      session: null,
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.redirectTo || `${window.location.origin}/account`,
      },
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    return { error };
  } catch (error: any) {
    return {
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
}

/**
 * Reset password for email
 */
export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string
): Promise<{ error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password`,
    });
    return { error };
  } catch (error: any) {
    return {
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });
    return { error };
  } catch (error: any) {
    return {
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: null }, unsubscribe: () => {} };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

