'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import {
  calculateStreak,
  getBaseXP,
  getStreakBonus,
  rollSurprise,
  type StreakResult,
} from '@/lib/streak-engine';
import { today } from '@/components/dashboard/helpers';
import { reportError } from '@/lib/error-reporting';

// ═══════════════════════════════════════════════════════════
// useDashboard — all data fetching and business logic
// for the strQ dashboard. Keeps page.tsx purely visual.
// ═══════════════════════════════════════════════════════════

export type DashState = 'loading' | 'reveal' | 'idle' | 'logging';

/** Error codes — translated in the UI layer, not here */
export type DashError =
  | 'load_failed'       // loadData() failed
  | 'not_logged_in'     // no auth session
  | 'save_failed'       // activity upsert failed
  | 'unknown';          // catch-all

export interface RevealData {
  baseXp: number;
  bonusXp: number;
  surprise: string | null;
}

export interface EventData {
  name: string;
  event_date: string;
  target_time_minutes: number | null;
  result_time_minutes: number | null;
}

export interface ProfileData {
  sport_type: string;
  onboarded: boolean;
}

export function useDashboard() {
  const [state, setState] = useState<DashState>('loading');
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [todayType, setTodayType] = useState<'training' | 'rest' | null>(null);
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<DashError | null>(null);

  const supabase = createBrowserClient();

  // ── Load user data ──
  const loadData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const [activitiesRes, streakStateRes, revealRes, eventRes, profileRes] =
        await Promise.all([
          supabase
            .from('activities')
            .select('activity_date, activity_type')
            .eq('user_id', user.id)
            .gte('activity_date', sixtyDaysAgo.toISOString().split('T')[0])
            .order('activity_date', { ascending: false }),
          supabase
            .from('streak_state')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('daily_reveals')
            .select('*')
            .eq('user_id', user.id)
            .eq('reveal_date', today())
            .single(),
          supabase
            .from('events')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'upcoming')
            .order('event_date', { ascending: true })
            .limit(1)
            .single(),
          supabase
            .from('profiles')
            .select('sport_type, onboarded')
            .eq('id', user.id)
            .single(),
        ]);

      const activities = activitiesRes.data || [];
      const upcomingEvent = eventRes.data || null;
      const streakResult = calculateStreak(activities, upcomingEvent);
      setStreak(streakResult);
      setTotalXp(streakStateRes.data?.total_xp || 0);
      setEvent(upcomingEvent);
      setProfile(profileRes.data || null);

      // Check if today is already logged
      const todayEntry = activities.find(
        (a) => a.activity_date === today()
      );
      setTodayLogged(!!todayEntry);
      setTodayType(
        todayEntry
          ? (todayEntry.activity_type as 'training' | 'rest')
          : null
      );

      // Check Daily Reveal
      if (revealRes.data && !revealRes.data.revealed && todayEntry) {
        setState('reveal');
        setReveal({
          baseXp: revealRes.data.base_xp,
          bonusXp: revealRes.data.bonus_xp,
          surprise: revealRes.data.surprise_type,
        });
      } else {
        setState('idle');
      }
    } catch (err) {
      console.error('[useDashboard] loadData failed:', err);
      reportError(err instanceof Error ? err : new Error(String(err)), { action: 'loadData' });
      setError('load_failed');
      setState('idle');
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Log activity ──
  const logActivity = async (type: 'training' | 'rest') => {
    setState('logging');
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('not_logged_in');
        setState('idle');
        return;
      }

      // Insert activity
      const { error: upsertError } = await supabase
        .from('activities')
        .upsert(
          {
            user_id: user.id,
            activity_date: today(),
            activity_type: type,
            source: 'manual',
          },
          { onConflict: 'user_id,activity_date' }
        );

      if (upsertError) {
        console.error('[useDashboard] upsert failed:', upsertError);
        setError('save_failed');
        setState('idle');
        return;
      }

      // Calculate new streak + XP
      const { data: activities } = await supabase
        .from('activities')
        .select('activity_date, activity_type')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })
        .limit(60);

      const newStreak = calculateStreak(activities || [], event);
      const baseXp = getBaseXP(type);
      // Spoor A: rest yields 0 XP — no streak bonus, no surprise.
      // Multiplier and surprise are exclusive to TRAIN.
      const streakBonus = type === 'training' ? getStreakBonus(newStreak) : 0;
      const surprise = type === 'training' ? rollSurprise() : null;
      const totalEarned = baseXp + streakBonus + (surprise?.xp || 0);

      // Create daily reveal
      await supabase.from('daily_reveals').upsert(
        {
          user_id: user.id,
          reveal_date: today(),
          revealed: false,
          base_xp: baseXp,
          bonus_xp: streakBonus + (surprise?.xp || 0),
          surprise_type: surprise?.type || null,
          surprise_data: surprise ? { xp: surprise.xp } : null,
        },
        { onConflict: 'user_id,reveal_date' }
      );

      // Update streak state
      await supabase.from('streak_state').upsert(
        {
          user_id: user.id,
          current_streak: newStreak.currentStreak,
          longest_streak: Math.max(
            newStreak.currentStreak,
            newStreak.longestStreak
          ),
          last_activity_date: today(),
          streak_multiplier: newStreak.multiplier,
          total_xp: totalXp + totalEarned,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      // Log XP entries
      const xpEntries = [
        {
          user_id: user.id,
          amount: baseXp,
          reason: 'activity',
          activity_date: today(),
        },
      ];
      if (streakBonus > 0) {
        xpEntries.push({
          user_id: user.id,
          amount: streakBonus,
          reason:
            newStreak.multiplier >= 2 ? 'multiplier' : 'streak_bonus',
          activity_date: today(),
        });
      }
      if (surprise) {
        xpEntries.push({
          user_id: user.id,
          amount: surprise.xp,
          reason: 'surprise',
          activity_date: today(),
        });
      }
      await supabase.from('xp_log').insert(xpEntries);

      // Update local state → trigger reveal
      setStreak(newStreak);
      setTodayLogged(true);
      setTodayType(type);
      setTotalXp((prev) => prev + totalEarned);
      setReveal({
        baseXp,
        bonusXp: streakBonus + (surprise?.xp || 0),
        surprise: surprise?.type || null,
      });
      setState('reveal');
    } catch (err) {
      console.error('[useDashboard] logActivity failed:', err);
      reportError(err instanceof Error ? err : new Error(String(err)), { action: 'logActivity' });
      setError('unknown');
      setState('idle');
    }
  };

  // ── Reveal animation ──
  const doReveal = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('daily_reveals')
        .update({ revealed: true, revealed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('reveal_date', today());

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setState('idle');
      }, 3000);
    } catch (err) {
      console.error('[useDashboard] doReveal failed:', err);
      reportError(err instanceof Error ? err : new Error(String(err)), { action: 'doReveal' });
      setState('idle');
    }
  };

  // ── Dismiss error ──
  const clearError = () => setError(null);

  // ── Onboarding: persist sport choice + flip onboarded flag ──
  const completeOnboarding = async (sportType: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error: upErr } = await supabase
        .from('profiles')
        .update({ sport_type: sportType, onboarded: true })
        .eq('id', user.id);
      if (upErr) {
        console.warn('[useDashboard] completeOnboarding failed:', upErr);
        return;
      }
      setProfile({ sport_type: sportType, onboarded: true });
    } catch (err) {
      console.warn('[useDashboard] completeOnboarding error:', err);
    }
  };

  return {
    // State
    state,
    streak,
    todayLogged,
    todayType,
    reveal,
    totalXp,
    showConfetti,
    event,
    profile,
    error,
    // Actions
    logActivity,
    doReveal,
    clearError,
    completeOnboarding,
  };
}
