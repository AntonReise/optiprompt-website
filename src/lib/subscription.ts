/**
 * Subscription Helpers
 *
 * TODO: Implement these functions once Stripe integration is set up.
 *
 * Expected database schema:
 * - subscriptions table with columns: user_id, plan, status, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end
 * - usage table with columns: user_id, total_usage (lifetime count)
 * - tool_calls table with columns: id, user_id, tool_name, created_at (for rolling 24-hour window tracking)
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
  usedEnhancements: number; // Calls in last 24 hours
  remainingEnhancements: number | null; // null for unlimited
  totalUsage: number; // Lifetime usage count
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

    // Count calls in the last 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { count: callsInLast24Hours, error: callsError } = await supabase
      .from('tool_calls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', twentyFourHoursAgo.toISOString());

    // Fetch total lifetime usage
    const { data: usageData, error: usageError } = await supabase
      .from('usage')
      .select('total_usage')
      .eq('user_id', user.id)
      .single();

    // If no usage entry exists yet, return default values
    if ((callsError && callsError.code !== 'PGRST116') || usageError) {
      return {
        totalEnhancements: dailyLimit,
        usedEnhancements: 0,
        remainingEnhancements: dailyLimit,
        totalUsage: 0,
      };
    }

    const usedEnhancements = callsInLast24Hours || 0;
    const totalUsage = usageData?.total_usage || 0;
    const remainingEnhancements = Math.max(0, dailyLimit - usedEnhancements);

    return {
      totalEnhancements: dailyLimit,
      usedEnhancements,
      remainingEnhancements,
      totalUsage,
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
