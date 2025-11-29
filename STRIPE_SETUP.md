# Stripe Subscription Setup Guide

This guide explains how to set up Stripe subscriptions for OptiPrompt.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key (from Stripe Dashboard > Developers > API keys)
STRIPE_PUBLISHABLE_KEY=pk_test_...              # Your Stripe publishable key (optional, for future frontend use)
STRIPE_PRICE_ID_PRO=price_...                    # The Stripe Price ID for your Pro plan subscription
STRIPE_WEBHOOK_SECRET=whsec_...                  # Your Stripe webhook signing secret (from webhook endpoint settings)

# Application URL (for redirects)
NEXT_PUBLIC_APP_URL=https://yourdomain.com      # Your production domain, or http://localhost:4028 for local development

# Supabase (if not already set)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Required for webhook operations (from Supabase Dashboard > Settings > API)
```

## Stripe Setup Steps

### 1. Create a Product and Price in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) > Products
2. Click "Add product"
3. Create a product named "OptiPrompt Pro" (or similar)
4. Set up a recurring price (monthly or yearly)
5. Copy the **Price ID** (starts with `price_...`) and add it to `STRIPE_PRICE_ID_PRO` in your `.env.local`

### 2. Set Up Webhook Endpoint

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   - **Production**: `https://yourdomain.com/api/stripe-webhook`
   - **Local testing**: Use Stripe CLI (see below)
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_...`) and add it to `STRIPE_WEBHOOK_SECRET` in your `.env.local`

### 3. Local Webhook Testing (Optional)

For local development, use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:4028/api/stripe-webhook
```

This will give you a webhook signing secret (e.g., `whsec_...`) that you can use for local testing.

## Supabase Database Schema

Run the following SQL in your Supabase SQL Editor to create the required tables:

### 1. Create Subscriptions Table

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');
```

### 2. Create Usage Table (Optional - for tracking usage)

```sql
-- Create usage table
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_enhancements INTEGER NOT NULL DEFAULT 3,  -- -1 for unlimited
  used_enhancements INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS usage_user_id_idx ON usage(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own usage
CREATE POLICY "Users can view own usage"
  ON usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything
CREATE POLICY "Service role can manage usage"
  ON usage
  FOR ALL
  USING (auth.role() = 'service_role');
```

### 3. Create Function to Update Updated At Timestamp

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for usage table
CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Testing the Integration

### 1. Test Checkout Flow

1. Start your development server: `npm run dev`
2. Log in to your application
3. Navigate to `/subscription`
4. Click "Upgrade to Pro"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete the checkout
7. You should be redirected to `/success` and then to `/subscription` with an active subscription

### 2. Test Webhook Events

1. Use Stripe CLI to forward webhooks locally (see above)
2. Or use Stripe Dashboard > Webhooks > Send test webhook
3. Check your application logs to ensure webhooks are being processed
4. Verify that subscription status is updated in Supabase

### 3. Test Customer Portal

1. With an active subscription, click "Manage Subscription"
2. You should be redirected to Stripe Customer Portal
3. Test canceling/reactivating subscription
4. Verify that changes are reflected in your application

## Troubleshooting

### Webhook Not Receiving Events

- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check that webhook endpoint URL is accessible
- For local development, use Stripe CLI
- Check application logs for webhook processing errors

### Subscription Not Updating

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
- Check Supabase logs for database errors
- Verify RLS policies allow service role operations
- Ensure webhook events are being received (check Stripe Dashboard)

### Checkout Session Not Creating

- Verify `STRIPE_SECRET_KEY` is correct
- Check that `STRIPE_PRICE_ID_PRO` matches your Stripe price ID
- Verify user is authenticated (check authorization header)
- Check application logs for API errors

## Production Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Create webhook endpoint in Stripe Dashboard pointing to your production URL
3. Update `STRIPE_WEBHOOK_SECRET` with production webhook secret
4. Switch to live Stripe keys (replace `sk_test_` with `sk_live_`)
5. Test the full flow in production with a real payment method

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all Stripe keys
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (it has admin access)
- Regularly rotate webhook secrets
- Monitor webhook events in Stripe Dashboard for suspicious activity

