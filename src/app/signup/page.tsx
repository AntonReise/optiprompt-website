'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { isSupabaseConfigured } from '@/lib/supabase';
import { signUpWithPassword } from '@/lib/auth';

export default function Signup() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({});
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
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (!isSupabaseConfigured()) {
        setErrors({ general: 'Authentication is not yet configured. Please set up Supabase to enable signup.' });
        setIsSubmitting(false);
        return;
      }

      const { user, session, error } = await signUpWithPassword(
        formState.email,
        formState.password,
        { redirectTo: `${window.location.origin}/account` }
      );

      if (error) {
        setErrors({ general: error.message || 'An error occurred during signup. Please try again.' });
        return;
      }

      if (user) {
        // Check if email confirmation is required
        if (!session) {
          // Email confirmation required
          setErrors({ general: 'Please check your email to confirm your account before signing in.' });
        } else {
          // Auto-signed in, redirect to account
          router.push('/account');
          router.refresh();
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred during signup. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Signup Form Section */}
      <section className="pt-[160px] py-24 bg-white flex-1">
        <div className="container mx-auto px-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h1 className="text-[36px] font-bold text-black mb-4 text-center">Sign Up</h1>
              <p className="text-[16px] text-gray-600 mb-8 text-center">
                Create your account to get started with OptiPrompt
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
                  helpText="We'll use this to send you account updates"
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
                  placeholder="Create a strong password"
                  helpText="Must be at least 8 characters long"
                  error={errors.password}
                  className="mb-6"
                  required
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  error={errors.confirmPassword}
                  className="mb-8"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full mb-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#2563EB] hover:underline font-medium">
                      Sign in
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

