// ═══════════════════════════════════════════════════════════
// strQ — Auth Callback
// Handles magic link redirect from Supabase Auth
// Exchanges code for session, then redirects to app
// ═══════════════════════════════════════════════════════════

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/nl/app';

  if (code) {
    const response = NextResponse.redirect(new URL(redirect, request.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);

    return response;
  }

  // No code — redirect to landing
  return NextResponse.redirect(new URL('/', request.url));
}
