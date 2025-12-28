/**
 * Authentication Helpers
 *
 * This file provides helper functions for GitHub OAuth authentication.
 * Uses the proper SSR-compatible Supabase client.
 */

import { createClient } from '@/lib/supabase/client';
import type { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Type alias for auth errors
type AuthError = SupabaseAuthError | { message: string; status?: number };

/**
 * Get the current user session
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const supabase = createClient();
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
export const signInWithGitHub = async (next?: string): Promise<{ error: AuthError | null }> => {
  try {
    const supabase = createClient();
    const redirectTo = next 
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
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
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
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
  const supabase = createClient();
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};
