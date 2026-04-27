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

    // Persist age confirmation: copy raw_user_meta_data.age_confirmed_at
    // into profiles. Only sets the column when it is still NULL, so the
    // first confirmation timestamp is preserved as audit trail.
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const ts = user?.user_metadata?.age_confirmed_at;
      if (user && typeof ts === "string") {
        await supabase
          .from("profiles")
          .update({ age_confirmed_at: ts })
          .eq("id", user.id)
          .is("age_confirmed_at", null);
      }
    } catch (err) {
      // Non-fatal: do not block the login flow if the profile update fails
      console.warn("[auth/callback] age confirmation update failed:", err);
    }

    return response;
  }

  // No code — redirect to landing
  return NextResponse.redirect(new URL('/', request.url));
}
