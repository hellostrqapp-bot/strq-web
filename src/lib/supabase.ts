// ═══════════════════════════════════════════════════════════
// strQ — Supabase Client Setup
// Browser client for client components (auth + realtime)
// Server client for API routes and server components
// ═══════════════════════════════════════════════════════════

export { createBrowserClient } from './supabase-browser';
export { createServerClient } from './supabase-server';

// Legacy export for waitlist (anonymous, no auth needed)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
