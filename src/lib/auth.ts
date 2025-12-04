/**
 * Authentication Helpers
 *
 * This file provides helper functions for GitHub OAuth authentication.
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
export const getSession = async (): Promise<Session | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getSession();
  return session?.user ?? null;
};

/**
 * Sign in with GitHub OAuth
 */
export const signInWithGitHub = async (): Promise<{ error: AuthError | null }> => {
  if (!isSupabaseConfigured()) {
    return {
      error: { message: 'Supabase is not configured', status: 500 } as AuthError,
    };
  }

  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error };
  } catch (error: any) {
    return {
      error: { message: error.message || 'An error occurred', status: 500 } as AuthError,
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
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
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void,
) => {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: null }, unsubscribe: () => { } };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

