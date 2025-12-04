'use server';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.redirect(`${origin}/login?error=configuration`);
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}/account`);
        }
    }

    // Return the user to the login page with an error if code exchange fails
    return NextResponse.redirect(`${origin}/login?error=auth`);
};
