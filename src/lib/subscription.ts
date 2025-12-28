/**
 * Subscription Helpers
 *
 * TODO: Implement these functions once Stripe integration is set up.
 *
 * Expected database schema:
 * - subscriptions table with columns: user_id, plan, status, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end
 * - usage table with columns: user_id, total_enhancements, used_enhancements, reset_date
 */

import { createClient } from '@/lib/supabase/client';
import { getCurrentUser, getSession } from './auth';
import { BILLING_ENABLED } from '@/lib/config';

export interface SubscriptionData {
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface UsageData {
  totalEnhancements: number; // -1 for unlimited
  usedEnhancements: number;
  remainingEnhancements: number | null; // null for unlimited
  resetDate: string;
}

/**
 * Get user subscription
 */
export async function getUserSubscription(): Promise<SubscriptionData | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return {
      plan: data.plan,
      status: data.status,
      currentPeriodEnd: data.current_period_end,
      cancelAtPeriodEnd: data.cancel_at_period_end,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Daily usage limits by plan
const DAILY_LIMITS = {
  free: 3,
  pro: 100,
  business: 100, // Same as pro for now
};

/**
 * Get user usage statistics
 */
export async function getUserUsage(): Promise<UsageData | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = createClient();

    // First, get the user's subscription to determine their daily limit
    const subscriptionData = await getUserSubscription();
    const plan = subscriptionData?.plan || 'free';
    const dailyLimit = DAILY_LIMITS[plan] || DAILY_LIMITS.free;

    // Fetch usage data
    const { data, error } = await supabase
      .from('usage')
      .select('used_enhancements, reset_date')
      .eq('user_id', user.id)
      .single();

    // Calculate reset date (end of current day in user's timezone)
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // If no usage entry exists yet, return default values
    if (error || !data) {
      return {
        totalEnhancements: dailyLimit,
        usedEnhancements: 0,
        remainingEnhancements: dailyLimit,
        resetDate: endOfDay.toISOString(),
      };
    }

    // Check if the reset_date has passed (new day), meaning usage should be reset
    const resetDate = new Date(data.reset_date);
    const usedEnhancements = now > resetDate ? 0 : data.used_enhancements;
    const remainingEnhancements = Math.max(0, dailyLimit - usedEnhancements);

    return {
      totalEnhancements: dailyLimit,
      usedEnhancements,
      remainingEnhancements,
      resetDate: now > resetDate ? endOfDay.toISOString() : data.reset_date,
    };
  } catch (error) {
    console.error('Error fetching usage:', error);
    return null;
  }
}

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession(): Promise<{
  url: string | null;
  error: Error | null;
}> {
  // Check billing feature flag
  if (!BILLING_ENABLED) {
    console.warn('Billing is disabled; ignoring checkout session creation.');
    return { url: null, error: new Error('Billing is currently disabled') };
  }

  try {
    const session = await getSession();
    if (!session?.access_token) {
      return { url: null, error: new Error('User not authenticated') };
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        url: null,
        error: new Error(errorData.error || 'Failed to create checkout session'),
      };
    }

    const { url } = await response.json();
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: new Error(error.message || 'An error occurred') };
  }
}

/**
 * Create Stripe customer portal session
 */
export async function createStripePortalSession(): Promise<{
  url: string | null;
  error: Error | null;
}> {
  // Check billing feature flag
  if (!BILLING_ENABLED) {
    console.warn('Billing is disabled; ignoring portal session creation.');
    return { url: null, error: new Error('Billing is currently disabled') };
  }

  try {
    const session = await getSession();
    if (!session?.access_token) {
      return { url: null, error: new Error('User not authenticated') };
    }

    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        url: null,
        error: new Error(errorData.error || 'Failed to create portal session'),
      };
    }

    const { url } = await response.json();
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: new Error(error.message || 'An error occurred') };
  }
}
