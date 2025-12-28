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
import { getUserSubscription, getUserUsage, createStripePortalSession, createCheckoutSession } from '@/lib/subscription';
import { BILLING_ENABLED } from '@/lib/config';
import { CheckCircle2, CreditCard, Activity, Clock } from 'lucide-react';


interface SubscriptionData {
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface UsageData {
  totalEnhancements: number;
  usedEnhancements: number; // Calls in last 24 hours
  remainingEnhancements: number | null; // null for unlimited
  totalUsage: number; // Lifetime usage count
  nextResetAt: string | null;
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
            usedEnhancements: 12,
            remainingEnhancements: null,
            totalUsage: 247,
            nextResetAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
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
          // Default usage based on plan (this shouldn't normally happen as getUserUsage handles this)
          const dailyLimit = subscriptionData?.plan === 'pro' ? 100 : 3;
          setUsage({
            totalEnhancements: dailyLimit,
            usedEnhancements: 0,
            remainingEnhancements: dailyLimit,
            totalUsage: 0,
            nextResetAt: null,
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

  const handleUpgradeToPro = async () => {
    if (!BILLING_ENABLED) {
      console.warn('Billing is disabled; ignoring upgrade action.');
      return;
    }

    setIsRedirecting(true);
    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set up Supabase to enable subscription management.');
        setIsRedirecting(false);
        return;
      }

      const { url, error } = await createCheckoutSession();

      if (error || !url) {
        setError(error?.message || 'Failed to create checkout session. Please try again.');
        setIsRedirecting(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsRedirecting(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!BILLING_ENABLED) {
      console.warn('Billing is disabled; ignoring portal action.');
      return;
    }

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Development Banner */}
            {!isSupabaseConfigured() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Development Preview:</strong> You're viewing mock data. Authentication is not configured yet. This page will require login once Supabase is set up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-12">
              <h1 className="text-4xl md:text-[48px] font-bold text-black mb-4 tracking-tight">Account & Billing</h1>
              <p className="text-lg md:text-[18px] text-gray-600">
                Manage your subscription, billing details, and prompt usage
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8">
                <p className="text-red-600 text-sm flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </p>
              </div>
            )}

            {/* Unified Subscription & Usage Statistics Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Left Column: Subscription Details */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h2 className="text-[22px] font-bold text-black">Subscription Plan</h2>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <p className="text-3xl font-bold text-black">{getPlanDisplayName(subscription?.plan || 'free')}</p>
                        {subscription?.plan !== 'free' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusBadgeColor(subscription?.status || 'active')}`}>
                            {subscription?.status || 'Active'}
                          </span>
                        )}
                      </div>

                      {subscription?.plan !== 'free' && subscription?.currentPeriodEnd && (
                        <div className="flex items-center gap-2 text-gray-600 mb-6">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            Renews on {formatDateTime(subscription.currentPeriodEnd).split(',')[0]}
                          </p>
                        </div>
                      )}

                      {subscription?.cancelAtPeriodEnd && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                          <p className="text-amber-800 text-sm">
                            Subscription will end on {subscription.currentPeriodEnd ? formatDateTime(subscription.currentPeriodEnd).split(',')[0] : 'period end'}.
                          </p>
                        </div>
                      )}

                      {!BILLING_ENABLED && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
                          <p className="text-sm text-blue-800 leading-relaxed">
                            Pro subscriptions are currently in early access. You have full access to the free features while we finalize our payment systems.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        {BILLING_ENABLED && (subscription?.plan === 'free' || subscription?.status !== 'active') && (
                          <Button
                            onClick={handleUpgradeToPro}
                            variant="primary"
                            className="rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] transition-all text-white px-8 py-4 h-auto text-base font-semibold shadow-lg shadow-blue-500/20"
                            disabled={isRedirecting}
                          >
                            {isRedirecting ? 'Processing...' : 'Upgrade to Pro'}
                          </Button>
                        )}

                        {BILLING_ENABLED && subscription?.plan !== 'free' && subscription?.status === 'active' && (
                          <Button
                            onClick={handleManageSubscription}
                            variant="primary"
                            className="rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] transition-all text-white px-8 py-4 h-auto text-base font-semibold"
                            disabled={isRedirecting}
                          >
                            {isRedirecting ? 'Processing...' : 'Manage Billing'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Usage Stats */}
                  <div className="space-y-8 lg:border-l lg:border-gray-50 lg:pl-12">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-green-600" />
                        <h2 className="text-[22px] font-bold text-black">Prompt Usage</h2>
                      </div>
                      
                      {usage ? (
                        <div className="space-y-8">
                          <div>
                            <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">Remaining for today</p>
                            <div className="flex items-baseline gap-2">
                              {usage.remainingEnhancements !== null ? (
                                <>
                                  <span className="text-5xl font-bold text-black tracking-tight">{usage.remainingEnhancements.toLocaleString()}</span>
                                  <span className="text-gray-400 text-xl font-medium">/ {usage.totalEnhancements.toLocaleString()}</span>
                                </>
                              ) : (
                                <span className="text-5xl font-bold text-black tracking-tight">Unlimited</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500 mb-1 font-medium">Quota Refresh</p>
                              <p className="text-base font-semibold text-black">
                                {usage.nextResetAt 
                                  ? `Next prompt available at ${formatDateTime(usage.nextResetAt).split(', ')[1]}`
                                  : 'Your daily quota is fully available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Usage data unavailable at the moment.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer: Lifetime Usage - visually less centered */}
              {usage && (
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 px-10 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span>Lifetime Prompts Optimized: <span className="font-semibold text-gray-700">{usage.totalUsage.toLocaleString()}</span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>

  );
}

