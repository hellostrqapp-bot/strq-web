'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';
import {
  calculateStreak,
  getBaseXP,
  getStreakBonus,
  rollSurprise,
  type StreakResult,
} from '@/lib/streak-engine';
import {
  IconMultiplier,
  IconGift,
  IconSparkle,
  IconTraining,
  IconRest,
  IconCheck,
} from '@/components/icons';

// ═══════════════════════════════════════════════════════════
// strQ — Dashboard
// Het streak-getal is het grootste element op het scherm.
// Weinig tekst. Veel gevoel.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

type DashState = 'loading' | 'reveal' | 'idle' | 'logging';

export default function DashboardPage() {
  const t = useTranslations('app');
  const locale = useLocale();
  const [state, setState] = useState<DashState>('loading');
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [reveal, setReveal] = useState<{
    baseXp: number;
    bonusXp: number;
    surprise: string | null;
  } | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [event, setEvent] = useState<{
    name: string;
    event_date: string;
    target_time_minutes: number | null;
  } | null>(null);

  const supabase = createBrowserClient();

  // ── Load user data ──
  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch activities (last 60 days is enough for streak calc)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [activitiesRes, streakStateRes, revealRes, eventRes] =
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
      ]);

    const activities = activitiesRes.data || [];
    const streakResult = calculateStreak(activities);
    setStreak(streakResult);
    setTotalXp(streakStateRes.data?.total_xp || 0);
    setEvent(eventRes.data || null);

    // Check if today is already logged
    const todayEntry = activities.find(
      (a) => a.activity_date === today()
    );
    setTodayLogged(!!todayEntry);

    // Check Daily Reveal
    if (revealRes.data && !revealRes.data.revealed && todayEntry) {
      // Activity logged but not yet revealed — show reveal!
      setState('reveal');
      setReveal({
        baseXp: revealRes.data.base_xp,
        bonusXp: revealRes.data.bonus_xp,
        surprise: revealRes.data.surprise_type,
      });
    } else {
      setState('idle');
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Log activity ──
  const logActivity = async (type: 'training' | 'rest') => {
    setState('logging');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Insert activity
    const { error } = await supabase.from('activities').upsert(
      {
        user_id: user.id,
        activity_date: today(),
        activity_type: type,
        source: 'manual',
      },
      { onConflict: 'user_id,activity_date' }
    );

    if (error) {
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

    const newStreak = calculateStreak(activities || []);
    const baseXp = getBaseXP(type);
    const streakBonus = getStreakBonus(newStreak);
    const surprise = rollSurprise();
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
      { user_id: user.id, amount: baseXp, reason: 'activity', activity_date: today() },
    ];
    if (streakBonus > 0) {
      xpEntries.push({
        user_id: user.id,
        amount: streakBonus,
        reason: newStreak.multiplier >= 2 ? 'multiplier' : 'streak_bonus',
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

    // Show reveal
    setStreak(newStreak);
    setTodayLogged(true);
    setTotalXp((prev) => prev + totalEarned);
    setReveal({
      baseXp,
      bonusXp: streakBonus + (surprise?.xp || 0),
      surprise: surprise?.type || null,
    });
    setState('reveal');
  };

  // ── Reveal animation ──
  const doReveal = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Mark as revealed
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
  };

  // ── Render ──
  if (state === 'loading') {
    return (
      <div style={{ textAlign: 'center', paddingTop: 120 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${PD}`,
            borderTopColor: PL,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* Confetti overlay */}
      {showConfetti && <ConfettiOverlay />}

      {/* Rainbow bar */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 24,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {RB.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: c }} />
        ))}
      </div>

      {/* XP counter */}
      <div
        style={{
          textAlign: 'right',
          fontSize: 13,
          color: PL,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        {totalXp.toLocaleString()} XP
      </div>

      {/* ── STREAK COUNTER ── (het grootste element) */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow: `0 0 60px ${P}66`,
          }}
        >
          {streak?.currentStreak || 0}
        </div>
        <div
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          {t('streak_label')}
        </div>
        {streak && streak.multiplier >= 2 && (
          <div
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '4px 12px',
              background: `${SK}22`,
              border: `1px solid ${SK}44`,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              color: SK,
            }}
          >
            <IconMultiplier /> {streak.multiplier}x {t('multiplier')}
          </div>
        )}
      </div>

      {/* ── EVENT COUNTDOWN ── */}
      {event && (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: PL, fontWeight: 600 }}>
              {event.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {formatEventDate(event.event_date, locale)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: W }}>
              {daysUntil(event.event_date)}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              {t('days_to_go')}
            </div>
          </div>
        </div>
      )}

      {/* ── DAILY REVEAL ── */}
      {state === 'reveal' && reveal && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P})`,
            borderRadius: 16,
            padding: '28px 24px',
            marginBottom: 24,
            textAlign: 'center',
            cursor: 'pointer',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
          onClick={doReveal}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}><IconGift size={32} /></div>
          <div style={{ fontSize: 24, fontWeight: 800, color: W }}>
            +{reveal.baseXp + reveal.bonusXp} XP
          </div>
          {reveal.surprise && (
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                color: SL,
                fontWeight: 600,
              }}
            >
              <IconSparkle size={16} /> {t(`surprise_${reveal.surprise}`)}
            </div>
          )}
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {t('tap_to_reveal')}
          </div>
          <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }`}</style>
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      {!todayLogged && state === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Primary: I trained! */}
          <button
            onClick={() => logActivity('training')}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: 17,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${P}, ${PL})`,
              color: W,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
          >
            <IconTraining size={20} /> {t('log_training')}
          </button>

          {/* Secondary: Rest day */}
          <button
            onClick={() => logActivity('rest')}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 14,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            <IconRest size={18} /> {t('log_rest')}
          </button>
        </div>
      )}

      {/* ── ALREADY LOGGED ── */}
      {todayLogged && state === 'idle' && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: `${SK}11`,
            border: `1px solid ${SK}33`,
            borderRadius: 12,
          }}
        >
          <div style={{ marginBottom: 8 }}><IconCheck size={28} /></div>
          <div style={{ fontSize: 15, fontWeight: 600, color: SK }}>
            {t('already_logged')}
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 4,
            }}
          >
            {t('come_back_tomorrow')}
          </div>
        </div>
      )}

      {/* ── STREAK HISTORY (last 7 days) ── */}
      {streak && (
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 12,
            }}
          >
            {t('last_7_days')}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 6,
              justifyContent: 'space-between',
            }}
          >
            {streak.last7Days.map((day, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background:
                      day.type === 'training'
                        ? P
                        : day.type === 'rest'
                        ? `${SK}33`
                        : 'rgba(255,255,255,0.04)',
                    border:
                      day.isToday
                        ? `2px solid ${PL}`
                        : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 4px',
                    fontSize: 14,
                  }}
                >
                  {day.type === 'training'
                    ? <IconTraining size={16} />
                    : day.type === 'rest'
                    ? <IconRest size={16} />
                    : null}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.3)',
                    fontWeight: 600,
                  }}
                >
                  {day.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confetti component ──
function ConfettiOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            background: RB[i % RB.length],
            left: `${Math.random() * 100}%`,
            top: -10,
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Helpers ──
function today(): string {
  return new Date().toISOString().split('T')[0];
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatEventDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale, {
    day: 'numeric',
    month: 'long',
  });
}
