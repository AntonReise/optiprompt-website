# Supabase Setup Guide

This document explains how to set up Supabase for the OptiPrompt website.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your friend will create the Supabase project and provide you with credentials

## Step 1: Get Your Supabase Credentials

Once your friend creates the Supabase project, they will provide you with:

1. **Project URL** - Found in Settings > API > Project URL
2. **Anon Key** - Found in Settings > API > Project API keys > `anon` `public`

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root of this project (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Replace `your-project-url-here` and `your-anon-key-here` with the actual values
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the browser

## Step 3: Restart Your Development Server

After adding the environment variables:

1. Stop your current development server (Ctrl+C)
2. Start it again: `npm run dev` or `pnpm dev`

The app will automatically detect that Supabase is configured and enable authentication.

## Step 4: Verify Setup

Once configured, you should be able to:

- Sign up for a new account at `/signup`
- Log in at `/login`
- See your account status in the header (shows "Account" and "Sign Out" when logged in)
- Access protected pages like `/account` and `/subscription`

## What's Already Set Up

The following features are ready to use once Supabase is configured:

### ✅ Authentication
- Sign up with email/password
- Sign in with email/password
- Sign out
- Password reset
- Auth state management (automatically syncs across the app)

### ✅ User Profile
- View and update profile information
- Change password
- Account settings

### ✅ Subscription & Usage
- View subscription status
- View usage statistics
- Manage subscription via Stripe (when Stripe is integrated)

### 🔜 Future Features (Ready for Implementation)
- Saved prompts (`src/lib/prompts.ts`)
- User settings (`src/lib/user.ts`)
- Subscription management (`src/lib/subscription.ts`)

## Database Schema (To Be Created)

Once Supabase is set up, you'll need to create the following database tables:

### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `subscriptions` table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  plan TEXT CHECK (plan IN ('free', 'pro', 'business')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `usage` table
```sql
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  total_enhancements INTEGER DEFAULT 3,
  used_enhancements INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `saved_prompts` table
```sql
CREATE TABLE saved_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

### "Supabase is not configured" error
- Check that `.env.local` exists and contains both variables
- Verify the variable names are exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding/changing environment variables

### Authentication not working
- Check the browser console for errors
- Verify your Supabase project is active
- Ensure email authentication is enabled in Supabase (Settings > Authentication > Providers > Email)

### Can't access protected pages
- Make sure you're logged in
- Check that the AuthProvider is wrapping your app (it's in `src/app/layout.tsx`)

## Next Steps

Once Supabase is configured:

1. Test authentication (sign up, sign in, sign out)
2. Create the database tables listed above
3. Test profile updates
4. Set up Stripe integration for subscriptions (when ready)
5. Uncomment and implement the TODO sections in:
   - `src/lib/user.ts`
   - `src/lib/subscription.ts`
   - `src/lib/prompts.ts`

## Support

If you encounter issues, check:
- Supabase dashboard for project status
- Browser console for error messages
- Network tab for failed API requests

