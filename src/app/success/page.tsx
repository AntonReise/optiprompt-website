'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If we have a session_id, the checkout was successful
    // The webhook will handle updating the subscription in Supabase
    if (sessionId) {
      setLoading(false);
      // Optionally: refresh subscription data after a short delay to allow webhook to process
      setTimeout(() => {
        router.push('/subscription');
      }, 2000);
    } else {
      // No session_id means user navigated here directly
      router.push('/subscription');
    }
  }, [sessionId, router]);

  if (loading) {
    return (
      <MainLayout>
        <section className="pt-[160px] py-24 bg-white flex-1">
          <div className="container mx-auto px-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your subscription...</p>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-[160px] py-24 bg-white flex-1">
        <div className="container mx-auto px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
              <div className="flex justify-center mb-4">
                <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-black mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for subscribing to OptiPrompt Pro. Your subscription is now active.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your subscription page...
              </p>
            </div>
            <Link href="/subscription">
              <Button
                variant="primary"
                className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium"
              >
                Go to Subscription Page
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

