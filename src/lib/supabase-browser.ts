// ═══════════════════════════════════════════════════════════
// strQ — Browser Supabase Client
// Used in client components for auth state and realtime
// ═══════════════════════════════════════════════════════════

import { createBrowserClient as createClient } from '@supabase/ssr';

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
