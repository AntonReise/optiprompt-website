'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with actual Supabase password reset once configured
      if (isSupabaseConfigured()) {
        // Actual Supabase password reset will go here
        // const { error } = await supabase.auth.resetPasswordForEmail(email, {
        //   redirectTo: `${window.location.origin}/reset-password`,
        // });
        // if (error) throw error;
        setIsSuccess(true);
      } else {
        // Placeholder: show message that Supabase needs to be configured
        setError('Password reset is not yet configured. Please set up Supabase to enable this feature.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Forgot Password Form Section */}
      <section className="pt-[103px] py-24 bg-white">
        <div className="container mx-auto px-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <h1 className="text-[36px] font-bold text-black mb-4 text-center">Reset Password</h1>
              <p className="text-[16px] text-gray-600 mb-8 text-center">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              {isSuccess ? (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <Image src="/images/success-icon.svg" alt="Success" width={48} height={48} className="mx-auto mb-4" />
                    <h3 className="text-[24px] font-bold text-green-700 mb-2">Check your email!</h3>
                    <p className="text-[16px] text-green-600 mb-4">
                      We've sent password reset instructions to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Didn't receive the email? Check your spam folder or{' '}
                      <button 
                        onClick={() => setIsSuccess(false)} 
                        className="text-[#2563EB] hover:underline"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                  <Link href="/login">
                    <Button 
                      variant="primary" 
                      className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </p>
                  
                  <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    value={email} 
                    onChange={handleChange} 
                    placeholder="you@example.com" 
                    error={error && !error.includes('configured') ? error : undefined}
                    className="mb-8"
                    required 
                  />
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium w-full mb-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                  </Button>
                  
                  <div className="text-center">
                    <Link href="/login" className="text-sm text-[#2563EB] hover:underline">
                      ← Back to login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

