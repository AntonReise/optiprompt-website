/**
 * Subscription Helpers
 * 
 * TODO: Implement these functions once Stripe integration is set up.
 * 
 * Expected database schema:
 * - subscriptions table with columns: user_id, plan, status, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end
 * - usage table with columns: user_id, total_enhancements, used_enhancements, reset_date
 */

import { supabase, getSupabaseClient } from './supabaseClient';
import { isSupabaseConfigured } from './supabase';
import { getCurrentUser } from './auth';

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
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const client = getSupabaseClient();

    const { data, error } = await client
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

/**
 * Get user usage statistics
 */
export async function getUserUsage(): Promise<UsageData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching usage:', error);
      return null;
    }

    return {
      totalEnhancements: data.total_enhancements,
      usedEnhancements: data.used_enhancements,
      remainingEnhancements: data.total_enhancements === -1 ? null : data.total_enhancements - data.used_enhancements,
      resetDate: data.reset_date,
    };
  } catch (error) {
    console.error('Error fetching usage:', error);
    return null;
  }
}

/**
 * Create Stripe customer portal session
 */
export async function createStripePortalSession(): Promise<{ url: string | null; error: Error | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: new Error('Supabase is not configured') };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { url: null, error: new Error('User not authenticated') };
    }


    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      return { url: null, error: new Error('Failed to create portal session') };
    }

    const { url } = await response.json();
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: new Error(error.message || 'An error occurred') };
  }
}

