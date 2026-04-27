'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { reportError } from '@/lib/error-reporting';
import type { TrophyEvent } from '@/lib/trophies';

// ═══════════════════════════════════════════════════════════
// useTrophies
// Lightweight hook that loads the user's completed events,
// newest first. Used by the /app/trophies overview and by
// the profile preview. RLS scopes the rows to auth.uid().
// ═══════════════════════════════════════════════════════════

export type TrophiesError = 'load_failed' | 'not_logged_in';

export interface UseTrophiesResult {
  trophies: TrophyEvent[];
  loading: boolean;
  error: TrophiesError | null;
  reload: () => void;
}

export function useTrophies(): UseTrophiesResult {
  const [trophies, setTrophies] = useState<TrophyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TrophiesError | null>(null);
  const supabase = createBrowserClient();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('not_logged_in');
        setTrophies([]);
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from('events')
        .select(
          'id, user_id, name, sport_type, event_date, target_time_minutes, result_time_minutes, status, created_at'
        )
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('result_time_minutes', 'is', null)
        .order('event_date', { ascending: false });

      if (queryError) {
        console.error('[useTrophies] query failed:', queryError);
        setError('load_failed');
        setTrophies([]);
        setLoading(false);
        return;
      }

      setTrophies((data || []) as TrophyEvent[]);
      setLoading(false);
    } catch (err) {
      console.error('[useTrophies] load failed:', err);
      reportError(
        err instanceof Error ? err : new Error(String(err)),
        { action: 'useTrophies.load' }
      );
      setError('load_failed');
      setTrophies([]);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  return { trophies, loading, error, reload: load };
}
