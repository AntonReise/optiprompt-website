/**
 * Application Configuration
 * 
 * Feature flags and configuration constants.
 * These are tree-shakable and can be imported anywhere in the app.
 */

/**
 * Billing Feature Flag
 * 
 * Set NEXT_PUBLIC_BILLING_ENABLED=true in your .env.local to enable Stripe billing.
 * Defaults to false when the env var is missing.
 * 
 * When false:
 * - All payment/upgrade flows are disabled
 * - Pro plan shows as "Coming soon"
 * - No Stripe checkout sessions can be created
 * 
 * When true:
 * - Full Stripe integration is active
 * - Users can subscribe to Pro plan
 * - All billing features are enabled
 */
export const BILLING_ENABLED =
  process.env.NEXT_PUBLIC_BILLING_ENABLED === 'true';

