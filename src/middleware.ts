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

export async function middleware(request: NextRequest) {
  // First: run i18n middleware for locale routing
  const response = intlMiddleware(request);

  // If this is a protected route, check auth
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

    if (!user) {
      // Detect locale from URL or default to 'nl'
      const localeMatch = request.nextUrl.pathname.match(
        /^\/(nl|en|fr|de|es|pt|qu)/
      );
      const locale = localeMatch ? localeMatch[1] : 'nl';

      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/(nl|en|fr|de|es|pt|qu)/:path*'],
};
