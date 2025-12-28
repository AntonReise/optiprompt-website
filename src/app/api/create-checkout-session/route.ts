/**
 * Create Stripe Checkout Session
 * 
 * This endpoint creates a Stripe Checkout session for subscription.
 * Requires authentication via Supabase.
 * 
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_PRICE_ID_PRO: The Stripe Price ID for the Pro plan
 * - NEXT_PUBLIC_APP_URL: Your application URL (e.g., https://yourdomain.com)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { BILLING_ENABLED } from '@/lib/config';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials are not set in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  // Check billing feature flag
  if (!BILLING_ENABLED) {
    return NextResponse.json(
      { error: 'Billing is currently disabled' },
      { status: 403 }
    );
  }

  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide a valid authentication token.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or expired session.' },
        { status: 401 }
      );
    }

    // Get user's email
    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found.' },
        { status: 400 }
      );
    }

    // Get the price ID from environment variables
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID is not configured.' },
        { status: 500 }
      );
    }

    // Get the app URL for redirects
    let appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        appUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      } else {
        appUrl = 'http://localhost:4028';
      }
    }

    // Check if user already has a Stripe customer ID
    let customerId: string | undefined;
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (subscriptionData?.stripe_customer_id) {
      customerId = subscriptionData.stripe_customer_id;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to Supabase
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          plan: 'free',
          status: 'active',
        }, {
          onConflict: 'user_id',
        });
    }

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscription`,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

