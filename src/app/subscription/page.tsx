'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Image from 'next/image';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSubscription, getUserUsage, createStripePortalSession } from '@/lib/subscription';

interface SubscriptionData {
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface UsageData {
  totalEnhancements: number;
  usedEnhancements: number;
  remainingEnhancements: number | null; // null for unlimited
  resetDate: string;
}

export default function Subscription() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [error, setError] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check authentication and fetch subscription/usage data
    const fetchData = async () => {
      try {
        // Redirect to login if not authenticated
        if (!authLoading && !isAuthenticated) {
          router.push('/login');
          return;
        }

        if (!isSupabaseConfigured() || !user) {
          // Use mock data when Supabase is not configured
          const mockSubscription: SubscriptionData = {
            plan: 'pro',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
          };

          const mockUsage: UsageData = {
            totalEnhancements: -1,
            usedEnhancements: 247,
            remainingEnhancements: null,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };

          setSubscription(mockSubscription);
          setUsage(mockUsage);
          setLoading(false);
          return;
        }

        // Fetch real data from Supabase
        const [subscriptionData, usageData] = await Promise.all([
          getUserSubscription(),
          getUserUsage(),
        ]);

        if (subscriptionData) {
          setSubscription(subscriptionData);
        } else {
          // Default to free plan if no subscription found
          setSubscription({
            plan: 'free',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
          });
        }

        if (usageData) {
          setUsage(usageData);
        } else {
          // Default usage for free plan
          setUsage({
            totalEnhancements: 3,
            usedEnhancements: 0,
            remainingEnhancements: 3,
            resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [router, user, isAuthenticated, authLoading]);

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set up Supabase to enable subscription management.');
        setIsRedirecting(false);
        return;
      }

      const { url, error } = await createStripePortalSession();

      if (error) {
        setError(error.message || 'Failed to create Stripe portal session');
        setIsRedirecting(false);
        return;
      }

      if (url) {
        window.location.href = url;
      } else {
        // Fallback to environment variable if helper not implemented
        const stripePortalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL;
        if (stripePortalUrl) {
          window.location.href = stripePortalUrl;
        } else {
          setError('Stripe portal is not configured. Please contact support.');
          setIsRedirecting(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to redirect to Stripe');
      setIsRedirecting(false);
    }
  };

  const getPlanDisplayName = (plan: string) => {
    const planNames: Record<string, string> = {
      free: 'Free',
      pro: 'Pro',
      business: 'Business',
    };
    return planNames[plan] || plan;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 border-green-200',
      trialing: 'bg-blue-100 text-blue-700 border-blue-200',
      canceled: 'bg-gray-100 text-gray-700 border-gray-200',
      past_due: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="pt-[103px] py-24 bg-white">
          <div className="container mx-auto px-12">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-600">Loading subscription information...</p>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      
      <section className="pt-[103px] py-24 bg-white">
        <div className="container mx-auto px-12">
          <div className="max-w-4xl mx-auto">
            {/* Development Banner */}
            {!isSupabaseConfigured() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Development Preview:</strong> You're viewing this page with mock data. Authentication is not configured yet. This page will require login once Supabase is set up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-[48px] font-bold text-black mb-4">Subscription & Usage</h1>
              <p className="text-[18px] text-gray-600">
                Manage your subscription and track your usage
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Subscription Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[28px] font-bold text-black">Subscription Status</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(subscription?.status || 'active')}`}>
                  {subscription?.status === 'active' ? 'Active' : 
                   subscription?.status === 'trialing' ? 'Trialing' :
                   subscription?.status === 'canceled' ? 'Canceled' : 'Past Due'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                  <p className="text-[24px] font-bold text-black">{getPlanDisplayName(subscription?.plan || 'free')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                  <p className="text-[24px] font-bold text-black">
                    {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                  </p>
                </div>
              </div>

              {subscription?.cancelAtPeriodEnd && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    Your subscription will cancel at the end of the current billing period.
                  </p>
                </div>
              )}

              <Button
                onClick={handleManageSubscription}
                variant="primary"
                className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium"
                disabled={isRedirecting}
              >
                {isRedirecting ? 'Redirecting...' : 'Manage Subscription'}
              </Button>
            </div>

            {/* Usage Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-[28px] font-bold text-black mb-6">Usage Statistics</h2>

              {usage && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-xl p-6">
                      <p className="text-sm text-[#010d3e] mb-2">Total Enhancements</p>
                      <p className="text-[32px] font-bold text-black">
                        {usage.totalEnhancements === -1 ? 'Unlimited' : usage.totalEnhancements.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-xl p-6">
                      <p className="text-sm text-[#010d3e] mb-2">Used This Period</p>
                      <p className="text-[32px] font-bold text-black">{usage.usedEnhancements.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-xl p-6">
                      <p className="text-sm text-[#010d3e] mb-2">Remaining</p>
                      <p className="text-[32px] font-bold text-black">
                        {usage.remainingEnhancements === null ? 'Unlimited' : usage.remainingEnhancements.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Usage Resets On</p>
                        <p className="text-[18px] font-semibold text-black">
                          {formatDate(usage.resetDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Progress</p>
                        {usage.totalEnhancements === -1 ? (
                          <p className="text-[18px] font-semibold text-black">Unlimited</p>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-[#2563EB] h-2 rounded-full"
                                style={{
                                  width: `${Math.min((usage.usedEnhancements / usage.totalEnhancements) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-[18px] font-semibold text-black">
                              {Math.round((usage.usedEnhancements / usage.totalEnhancements) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!usage && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No usage data available</p>
                </div>
              )}
            </div>

            {/* Additional Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full rounded-[10px] bg-white border border-gray-300 text-black hover:bg-gray-50 px-6 py-3 h-[50px] text-[16px] font-medium"
                >
                  Back to Home
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full rounded-[10px] bg-white border border-gray-300 text-black hover:bg-gray-50 px-6 py-3 h-[50px] text-[16px] font-medium"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

