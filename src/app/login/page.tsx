'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { isSupabaseConfigured } from '@/lib/supabase';
import { signInWithPassword } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    const newErrors: { email?: string; password?: string } = {};
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        setErrors({ general: 'Authentication is not yet configured. Please set up Supabase to enable login.' });
        setIsSubmitting(false);
        return;
      }

      const { error } = await signInWithPassword(
        formState.email,
        formState.password
      );

      if (error) {
        throw error;
      }

      // Successful login - redirect to account page
      router.push('/account');
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred during login. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Login Form Section */}
      <section className="pt-[160px] py-24 bg-white flex-1">
        <div className="container mx-auto px-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h1 className="text-[36px] font-bold text-black mb-4 text-center">Sign In</h1>
              <p className="text-[16px] text-gray-600 mb-8 text-center">
                Sign in to access your OptiPrompt account
              </p>

              <form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                  className="mb-6"
                  required
                />

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  className="mb-6"
                  required
                />

                <div className="flex items-center justify-end mb-8">
                  <Link href="/forgot-password" className="text-sm text-[#2563EB] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full mb-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#2563EB] hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

