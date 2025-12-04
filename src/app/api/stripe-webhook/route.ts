/**
 * Stripe Webhook Handler
 * 
 * This endpoint handles Stripe webhook events to keep subscription status in sync.
 * 
 * Environment variables required:
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (for admin operations)
 * 
 * To set up the webhook in Stripe:
 * 1. Go to Stripe Dashboard > Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/stripe-webhook
 * 3. Select events: checkout.session.completed, customer.subscription.created, 
 *    customer.subscription.updated, customer.subscription.deleted
 * 4. Copy the webhook signing secret and add it to STRIPE_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

// Initialize Supabase with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase service role key is not set. Required for webhook operations.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Disable body parsing for webhook route - we need raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get the raw body for signature verification
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: `Webhook processing failed: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userId = session.metadata?.supabase_user_id;

  if (!userId) {
    console.error('No supabase_user_id in session metadata');
    return;
  }

  // Get the subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;

  // Determine plan based on price ID (you can extend this logic)
  let plan: 'free' | 'pro' | 'business' = 'pro';
  if (process.env.STRIPE_PRICE_ID_PRO && priceId === process.env.STRIPE_PRICE_ID_PRO) {
    plan = 'pro';
  }

  // Update or create subscription record in Supabase
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan: plan,
      status: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trialing' : 'active',
      current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Error updating subscription in Supabase:', error);
    throw error;
  }
}

/**
 * Handle subscription created/updated events
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  // Find user by customer ID
  const { data: existingSub, error: fetchError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (fetchError || !existingSub) {
    // Try to get user ID from customer metadata
    const customer = await stripe.customers.retrieve(customerId);
    if (typeof customer !== 'string' && !customer.deleted && customer.metadata?.supabase_user_id) {
      const userId = customer.metadata.supabase_user_id;

      const priceId = subscription.items.data[0]?.price.id;
      let plan: 'free' | 'pro' | 'business' = 'pro';
      if (process.env.STRIPE_PRICE_ID_PRO && priceId === process.env.STRIPE_PRICE_ID_PRO) {
        plan = 'pro';
      }

      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan: plan,
          status: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trialing' : subscription.status as any,
          current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        }, {
          onConflict: 'user_id',
        });
    } else {
      console.error('Could not find user for customer:', customerId);
    }
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  let plan: 'free' | 'pro' | 'business' = 'pro';
  if (process.env.STRIPE_PRICE_ID_PRO && priceId === process.env.STRIPE_PRICE_ID_PRO) {
    plan = 'pro';
  }

  // Update subscription in Supabase
  const { error } = await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscriptionId,
      plan: plan,
      status: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trialing' : subscription.status as any,
      current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    })
    .eq('user_id', existingSub.user_id);

  if (error) {
    console.error('Error updating subscription in Supabase:', error);
    throw error;
  }
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by customer ID
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!existingSub) {
    console.error('Could not find subscription for customer:', customerId);
    return;
  }

  // Update subscription status to canceled
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
    })
    .eq('user_id', existingSub.user_id);

  if (error) {
    console.error('Error updating subscription status in Supabase:', error);
    throw error;
  }
}


