'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { signInWithGitHub } from '@/lib/auth';

const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LoginContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for error in URL params (from failed OAuth callback)
    const errorParam = searchParams.get('error');
    if (errorParam === 'auth') {
      setError('Authentication failed. Please try again.');
    } else if (errorParam === 'configuration') {
      setError('Authentication is not properly configured.');
    }
  }, [searchParams]);

  const handleGitHubLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(
        'Authentication is not yet configured. Please set up Supabase to enable login.',
      );
      setIsSubmitting(false);
      return;
    }

    const { error } = await signInWithGitHub();

    if (error) {
      setError(error.message || 'An error occurred during login. Please try again.');
      setIsSubmitting(false);
    }
    // If successful, the browser will redirect to GitHub for authentication
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-10">
      <h1 className="text-[36px] font-bold text-black mb-4 text-center">Sign In</h1>
      <p className="text-[16px] text-gray-600 mb-8 text-center">
        Sign in to access your OptiPrompt account
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="button"
        variant="primary"
        className="rounded-[10px] bg-[#24292e] hover:bg-[#1a1e22] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full flex items-center justify-center gap-3"
        onClick={handleGitHubLogin}
        disabled={isSubmitting}
      >
        <GitHubIcon className="w-5 h-5" />
        {isSubmitting ? 'Connecting...' : 'Continue with GitHub'}
      </Button>

      <p className="text-sm text-gray-500 text-center mt-6">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-[#2563EB] hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#2563EB] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Login Section */}
      <section className="pt-[160px] py-24 bg-white flex-1">
        <div className="container mx-auto px-12">
          <div className="max-w-md mx-auto">
            <Suspense
              fallback={
                <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                  <p className="text-gray-600">Loading...</p>
                </div>
              }
            >
              <LoginContent />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Login;
