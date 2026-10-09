'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { reportError } from '@/lib/error-reporting';
import {
  getMySeasons,
  getProgress,
  type CoopSeasonSummary,
  type CoopProgress,
} from '@/lib/coop';

// ═══════════════════════════════════════════════════════════
// useCoop
// Loads the signed-in user's co-op seasons and the full
// progress of the currently selected one. RLS plus the
// security-definer RPCs keep every read scoped to seasons the
// user actually belongs to.
// ═══════════════════════════════════════════════════════════

export type CoopError = 'load_failed' | 'not_logged_in';

export interface UseCoopResult {
  seasons: CoopSeasonSummary[];
  active: CoopProgress | null;
  activeId: string | null;
  loading: boolean;
  error: CoopError | null;
  reload: () => void;
  selectSeason: (id: string) => void;
}

export function useCoop(): UseCoopResult {
  const [seasons, setSeasons] = useState<CoopSeasonSummary[]>([]);
  const [active, setActive] = useState<CoopProgress | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CoopError | null>(null);

  const load = useCallback(
    async (preferId?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError('not_logged_in');
          setSeasons([]);
          setActive(null);
          setLoading(false);
          return;
        }

        const list = await getMySeasons();
        setSeasons(list);

        // Pick the season to show: an explicit choice, else the
        // first still-active one, else the most recent.
        const chosen =
          (preferId && list.find((s) => s.id === preferId)) ||
          list.find((s) => s.status === 'active') ||
          list[0] ||
          null;

        if (chosen) {
          setActiveId(chosen.id);
          const progress = await getProgress(chosen.id);
          setActive(progress);
        } else {
          setActiveId(null);
          setActive(null);
        }
        setLoading(false);
      } catch (err) {
        console.error('[useCoop] load failed:', err);
        reportError(
          err instanceof Error ? err : new Error(String(err)),
          { action: 'useCoop.load' }
        );
        setError('load_failed');
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const selectSeason = useCallback(
    (id: string) => {
      load(id);
    },
    [load]
  );

  return {
    seasons,
    active,
    activeId,
    loading,
    error,
    reload: () => load(activeId),
    selectSeason,
  };
}
