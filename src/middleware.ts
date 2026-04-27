import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication
const protectedPaths = ['/app'];

function isProtectedPath(pathname: string): boolean {
  // Strip locale prefix to check the actual path
  const pathWithoutLocale = pathname.replace(
    /^\/(nl|en|fr|de|es|pt|qu)/,
    ''
  );
  return protectedPaths.some((p) => pathWithoutLocale.startsWith(p));
}

function getLocale(pathname: string): string {
  const match = pathname.match(/^\/(nl|en|fr|de|es|pt|qu)/);
  return match ? match[1] : 'nl';
}

// Public launch (27 apr 2026): the beta whitelist gate has been removed.
// Anyone with a confirmed magic-link can use /app. allowed-testers.ts is
// kept for potential admin-only flags later.

export async function middleware(request: NextRequest) {
  // First: run i18n middleware for locale routing
  const response = intlMiddleware(request);

  // Auth-only gate on protected paths
  if (isProtectedPath(request.nextUrl.pathname)) {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const locale = getLocale(request.nextUrl.pathname);

    // Not authenticated → redirect to login
    if (!user) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  // Match all paths EXCEPT static files, api routes, and auth callback.
  // Needed because localePrefix: 'as-needed' strips /nl/ from URLs,
  // so /login (without prefix) must also hit the middleware.
  matcher: ['/((?!api|_next|auth|.*\\..*).*)', '/(nl|en|fr|de|es|pt|qu)/:path*'],
};
