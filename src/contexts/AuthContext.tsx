'use client';

/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Automatically syncs with Supabase auth state.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getCurrentUser, signOut, onAuthStateChange } from '@/lib/auth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      try {
        const currentSession = await getSession();
        const currentUser = await getCurrentUser();
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_OUT') {
        router.push('/');
      } else if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setSession(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut: handleSignOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a safe default when not in provider (shouldn't happen, but prevents crashes)
    return {
      user: null,
      session: null,
      loading: false,
      signOut: async () => {},
      isAuthenticated: false,
    };
  }
  return context;
}
