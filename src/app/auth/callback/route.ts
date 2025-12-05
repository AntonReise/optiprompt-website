import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error_param = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');
    const origin = requestUrl.origin;

    console.log('[Auth Callback] URL:', request.url);
    console.log('[Auth Callback] Code present:', !!code);
    console.log('[Auth Callback] Error param:', error_param);
    console.log('[Auth Callback] Error description:', error_description);

    // If GitHub/Supabase returned an error, show it
    if (error_param) {
        console.error('[Auth Callback] OAuth error from provider:', error_param, error_description);
        return NextResponse.redirect(`${origin}/login?error=auth&message=${encodeURIComponent(error_description || error_param)}`);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.redirect(`${origin}/login?error=configuration`);
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options),
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing sessions.
                }
            },
        },
    });

    // If there's a code, exchange it for a session
    if (code) {
        console.log('[Auth Callback] Exchanging code for session...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log('[Auth Callback] Successfully exchanged code, user:', data.user?.email);
            return NextResponse.redirect(`${origin}/account`);
        }

        console.error('[Auth Callback] Exchange code error:', error.message, error.status);
    } else {
        console.log('[Auth Callback] No code provided, checking for existing session...');
    }

    // If no code or code exchange failed, check if user already has a valid session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log('[Auth Callback] Session check result:', session ? 'Session found' : 'No session');

    if (session) {
        console.log('[Auth Callback] User already authenticated:', session.user?.email);
        // User is already authenticated, redirect to account
        return NextResponse.redirect(`${origin}/account`);
    }

    // No valid session and no code - return to login with error
    console.log('[Auth Callback] No valid session, redirecting to login with error');
    return NextResponse.redirect(`${origin}/login?error=auth`);
};
