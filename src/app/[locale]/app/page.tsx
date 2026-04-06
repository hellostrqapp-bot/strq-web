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
import { getLevelInfo, type LevelInfo } from '@/lib/levels';
import { LevelBadge } from '@/components/level-badge';

// ═══════════════════════════════════════════════════════════
// strQ — Dashboard
// Het streak-getal is het grootste element op het scherm.
// Weinig tekst. Veel gevoel.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const PM = '#7D3C98';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const SD = '#4F9962';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

// ── Q Mascotte (small celebrating pose) ──
function QCelebrating({ size = 64 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
      {/* Legs */}
      <path d="M106 250 L102 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <path d="M134 250 L138 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="98" cy="280" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="142" cy="280" rx="11" ry="5.5" fill={SD} />
      {/* Shell */}
      <g>
        <ellipse cx={120} cy={204} rx={52} ry={44} fill={P} />
        <ellipse cx={120} cy={194} rx={25} ry={21} stroke={PM} strokeWidth="1.8" fill="none" opacity="0.45" />
        <ellipse cx={112} cy={190} rx={12} ry={8} fill={PL} opacity="0.12" />
        {RB.map((c, i) => (
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
        ))}
      </g>
      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      {/* Arms raised celebrating */}
      <path d="M72 204 C56 188, 48 170, 56 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C184 188, 192 170, 184 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Hands */}
      <ellipse cx="54" cy="152" rx="9" ry="7" fill={SD} />
      <ellipse cx="186" cy="152" rx="9" ry="7" fill={SD} />
      {/* Neck + Head */}
      <path d="M120 168 L120 154" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="120" cy="140" rx="28" ry="24" fill={SK} />
      <circle cx="98" cy="146" r="4.5" fill={SL} opacity="0.35" />
      {/* Glasses */}
      <g>
        <rect x={98} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={122} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M118 134 C119 132, 121 132, 122 134" stroke={W} strokeWidth="2" fill="none" />
        <line x1="98" y1="134" x2="92" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="142" y1="134" x2="148" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Eyes */}
      <ellipse cx="109" cy="131" rx="4" ry="5" fill={W} />
      <ellipse cx="131" cy="132" rx="4" ry="5" fill={W} />
      <ellipse cx="110" cy="129.5" rx="2.5" ry="3.2" fill={PD} />
      <ellipse cx="132" cy="130.5" rx="2.5" ry="3.2" fill={PD} />
      <circle cx="111.5" cy="128" r="1.3" fill={W} />
      <circle cx="133.5" cy="129" r="1.3" fill={W} />
      {/* Big smile */}
      <path d="M106 150 C114 162, 128 162, 136 150" stroke={PD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Sparkles */}
      <g opacity="0.55">
        <line x1="48" y1="142" x2="48" y2="130" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="136" x2="54" y2="136" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="196" cy="140" r="2.5" fill={PL} />
        <line x1="192" y1="162" x2="192" y2="154" stroke={PL} strokeWidth="2" strokeLinecap="round" />
        <line x1="188" y1="158" x2="196" y2="158" stroke={PL} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

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

      {/* Rainbow bar — with subtle traveling shimmer */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 24,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {RB.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: c }} />
        ))}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
          animation: 'rainbow-shimmer 4s ease-in-out infinite',
        }} />
      </div>

      {/* XP counter removed — now shown in LevelBadge below streak */}

      {/* ── STREAK COUNTER ── (het grootste element) */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow: `0 0 60px ${P}88, 0 0 120px ${P}33`,
            animation: 'streak-glow 3s ease-in-out infinite',
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

      {/* ── LEVEL BADGE ── */}
      <LevelBadge levelInfo={getLevelInfo(totalXp)} totalXp={totalXp} />

      {/* ── EVENT COUNTDOWN ── */}
      {event && (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: PL, fontWeight: 700 }}>
              {event.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {formatEventDate(event.event_date, locale)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 28,
              fontWeight: 900,
              color: W,
              textShadow: `0 0 16px ${PL}44`,
            }}>
              {daysUntil(event.event_date)}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
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
            padding: '28px 20px',
            background: `${SK}11`,
            border: `1px solid ${SK}33`,
            borderRadius: 14,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle sparkle particles in the card */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {[
              { x: 12, y: 18, d: 0 }, { x: 85, y: 12, d: 0.8 },
              { x: 45, y: 80, d: 1.6 }, { x: 92, y: 65, d: 2.4 },
              { x: 8, y: 70, d: 3.2 },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: SK,
                animation: `card-sparkle 3s ease-in-out ${s.d}s infinite`,
              }} />
            ))}
          </div>
          <div style={{ marginBottom: 8 }}><QCelebrating size={100} /></div>
          <div style={{ fontSize: 16, fontWeight: 700, color: SK, textShadow: `0 0 12px ${SK}33` }}>
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
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 14,
            }}
          >
            {t('last_7_days')}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              justifyContent: 'space-between',
            }}
          >
            {streak.last7Days.map((day, i) => {
              const isActive = day.type === 'training';
              const isRest = day.type === 'rest';
              const isEmpty = !isActive && !isRest;

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {/* The day orb */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: isActive
                        ? day.isToday
                          ? `linear-gradient(135deg, ${PM}, ${PL})`
                          : `linear-gradient(135deg, ${P}, ${PL})`
                        : isRest
                        ? `linear-gradient(135deg, ${SK}22, ${SK}33)`
                        : 'rgba(255,255,255,0.03)',
                      border: day.isToday
                        ? `2px solid ${PL}`
                        : isActive
                        ? `2px solid ${PL}55`
                        : isRest
                        ? `2px solid ${SK}44`
                        : '2px solid rgba(255,255,255,0.06)',
                      boxShadow: day.isToday && isActive
                        ? `0 0 18px ${PL}77, 0 0 6px ${P}55, 0 0 30px ${P}33`
                        : isActive
                        ? `0 0 14px ${P}66, 0 0 4px ${PL}44`
                        : isRest
                        ? `0 0 8px ${SK}22`
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px',
                      position: 'relative',
                      overflow: 'visible',
                      animation: day.isToday && isActive
                        ? 'day-pulse 2s ease-in-out infinite'
                        : undefined,
                    }}
                  >
                    {/* Today sparkle ring */}
                    {day.isToday && isActive && (
                      <>
                        {[0, 60, 120, 180, 240, 300].map((angle, si) => {
                          const rad = (angle * Math.PI) / 180;
                          const dist = 24;
                          const sx = Math.cos(rad) * dist;
                          const sy = Math.sin(rad) * dist;
                          return (
                            <div
                              key={si}
                              style={{
                                position: 'absolute',
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                background: W,
                                left: `calc(50% + ${sx}px - 1.5px)`,
                                top: `calc(50% + ${sy}px - 1.5px)`,
                                animation: `today-sparkle 2.5s ease-in-out ${si * 0.4}s infinite`,
                                pointerEvents: 'none',
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                    {isActive && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {/* Bold checkmark — "done, crushed it" */}
                        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                        <path
                          d="M7.5 12.5L10.5 15.5L16.5 9"
                          stroke={W}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {isRest && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        {/* Zen circle — rest is earned */}
                        <circle cx="12" cy="12" r="8" fill="none" stroke={SK} strokeWidth="1.5" opacity="0.6" />
                        <path d="M9 12h6" stroke={SK} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                      </svg>
                    )}
                    {isEmpty && (
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                      }} />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: isActive
                        ? PL
                        : isRest
                        ? `${SK}99`
                        : 'rgba(255,255,255,0.2)',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: isActive ? '0.04em' : undefined,
                    }}
                  >
                    {day.label}
                  </div>
                </div>
              );
            })}
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
        @keyframes rainbow-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes streak-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.06); }
        }
        @keyframes card-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        @keyframes day-pulse {
          0%, 100% { box-shadow: 0 0 18px #A569BD77, 0 0 6px #6C348355, 0 0 30px #6C348333; }
          50% { box-shadow: 0 0 24px #A569BD99, 0 0 10px #6C348377, 0 0 40px #6C348344; }
        }
        @keyframes today-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          40% { opacity: 0.9; transform: scale(1.2); }
          60% { opacity: 0.7; transform: scale(1); }
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
