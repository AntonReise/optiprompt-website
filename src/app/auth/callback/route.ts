import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const originParam = searchParams.get('origin');
    // If "next" is in param, use it as the redirect URL
    let next = searchParams.get('next') ?? '/account';

    if (!next.startsWith('/')) {
        // if "next" is not a relative URL, use the default
        next = '/account';
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development' || originParam === 'local' || origin.includes('localhost');
            const appUrl = process.env.NEXT_PUBLIC_APP_URL;

            if (isLocalEnv) {
                // In local development, we want to ensure we redirect back to the local server
                // even if the callback request somehow came through the production domain
                const localOrigin = origin.includes('localhost') ? origin : 'http://localhost:4028';
                return NextResponse.redirect(`${localOrigin}${next}`);
            } else if (appUrl && !appUrl.includes('vercel.app')) {
                // If we have a specific app URL configured and it's not a vercel link, use it
                return NextResponse.redirect(`${appUrl}${next}`);
            } else if (forwardedHost && !forwardedHost.includes('vercel.app')) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                // Final fallback, use the origin of the request but try to avoid vercel.app if known
                return NextResponse.redirect(`${origin}${next}`);
            }
        }

        console.error('[Auth Callback] Exchange code error:', error.message);
    }

    // return the user to an error page with instructions
    const isLocalEnv = process.env.NODE_ENV === 'development' || originParam === 'local' || origin.includes('localhost');
    const finalOrigin = isLocalEnv && !origin.includes('localhost') ? 'http://localhost:4028' : origin;
    return NextResponse.redirect(`${finalOrigin}/login?error=auth`);
}
