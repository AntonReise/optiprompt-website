'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  github_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const Account: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;

      // Redirect to login if not authenticated
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching user data:', fetchError);
          setError('Failed to load user data');
          setLoading(false);
          return;
        }

        setUserData(data);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <MainLayout>
        <section className="pt-[103px] py-24 bg-white min-h-screen">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading your account...</p>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <section className="pt-[103px] py-24 bg-white min-h-screen">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-[#2563EB] hover:bg-[#1E40AF] text-white px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-[103px] py-24 bg-gradient-to-br from-white via-[#fafbff] to-[#f0f4ff] min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header with gradient */}
              <div className="h-32 bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED]"></div>

              {/* Profile content */}
              <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="relative -mt-16 mb-6 flex justify-center">
                  <div className="relative">
                    {userData?.avatar_url ? (
                      <Image
                        src={userData.avatar_url}
                        alt={userData.full_name || 'Profile'}
                        width={128}
                        height={128}
                        className="rounded-full border-4 border-white shadow-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {userData?.full_name?.charAt(0)?.toUpperCase() ||
                            userData?.email?.charAt(0)?.toUpperCase() ||
                            '?'}
                        </span>
                      </div>
                    )}
                    {/* GitHub badge */}
                    {userData?.github_id && (
                      <div className="absolute -bottom-1 -right-1 bg-[#24292e] rounded-full p-2 shadow-md">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and email */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {userData?.full_name || 'Anonymous User'}
                  </h1>
                  <p className="text-gray-500">{userData?.email}</p>
                </div>

                {/* Info cards */}
                <div className="space-y-4 mb-8">
                  {/* Email */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#2563EB]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Email
                      </p>
                      <p className="text-gray-900 font-medium truncate">
                        {userData?.email}
                      </p>
                    </div>
                  </div>

                  {/* GitHub Username */}
                  {userData?.github_id && (
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#24292e]/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-[#24292e]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          GitHub ID
                        </p>
                        <p className="text-gray-900 font-medium">
                          {userData.github_id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Member since */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#10B981]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Member Since
                      </p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(userData?.created_at || null)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <Link href="/subscription">
                    <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#2563EB]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Subscription</p>
                          <p className="text-sm text-gray-600">View your plan & usage</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/contact">
                    <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#D97706]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Support</p>
                          <p className="text-sm text-gray-600">Get help from our team</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Sign out button */}
                <Button
                  variant="secondary"
                  onClick={handleSignOut}
                  className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 font-medium transition-colors"
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Account;
