'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  IconMultiplier,
  IconGift,
  IconSparkle,
  IconTraining,
  IconRest,
  IconCheck,
  IconEarnedRest,
} from '@/components/icons';
import { getLevelInfo, type LevelInfo } from '@/lib/levels';
import { LevelBadge } from '@/components/level-badge';
import {
  QMiniButton,
  QCelebrating,
  QResting,
  ConfettiOverlay,
  BatteryIndicator,
  DashboardStyles,
  P, PL, PD, PM, SK, SL, SD, BG, W, RB,
  daysUntil, formatEventDate,
} from '@/components/dashboard';
import { useDashboard } from '@/hooks/use-dashboard';

// ═══════════════════════════════════════════════════════════
// strQ — Dashboard
// Het streak-getal is het grootste element op het scherm.
// Weinig tekst. Veel gevoel.
// ═══════════════════════════════════════════════════════════

// Q mascotte components, ConfettiOverlay, BatteryIndicator,
// DashboardStyles, colors, and helpers are imported from
// @/components/dashboard/

export default function DashboardPage() {
  const t = useTranslations('app');
  const locale = useLocale();

  // All state + data logic lives in the hook
  const {
    state, streak, todayLogged, todayType,
    reveal, totalXp, showConfetti, event, error,
    logActivity, doReveal, clearError,
  } = useDashboard();

  // UI-only state (animation triggers)
  const [qSpinning, setQSpinning] = useState(false);
  const [qHover, setQHover] = useState(false);

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

      {/* Error toast — dismissible */}
      {error && (
        <div
          role="alert"
          onClick={clearError}
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            background: 'rgba(231,76,60,0.12)',
            border: '1px solid rgba(231,76,60,0.25)',
            borderRadius: 10,
            color: '#E74C3C',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <span>{t(`error_${error}`)}</span>
          <span style={{ opacity: 0.5, fontSize: 11, marginLeft: 12 }}>✕</span>
        </div>
      )}

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
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
        {/* Ambient glow behind the number */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${P}44 0%, ${PD}22 40%, transparent 70%)`,
          animation: 'streak-ambient 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow: `0 0 40px ${PL}66, 0 0 80px ${P}55, 0 0 120px ${P}33`,
            animation: 'streak-glow 3s ease-in-out infinite',
            position: 'relative',
          }}
        >
          {streak?.currentStreak || 0}
        </div>
        <div
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 700,
            marginTop: 6,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            position: 'relative',
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
      {event && (() => {
        const days = daysUntil(event.event_date);
        const urgency = days <= 7 ? 1 : days <= 14 ? 0.7 : days <= 21 ? 0.45 : 0.25;
        return (
        <div
          style={{
            background: `linear-gradient(135deg, rgba(108,52,131,${0.08 + urgency * 0.1}), rgba(74,35,90,${0.04 + urgency * 0.06}))`,
            border: `1px solid ${PL}${Math.round(20 + urgency * 30).toString(16)}`,
            borderRadius: 14,
            padding: '18px 20px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle urgency pulse on the right side */}
          <div style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PL}${Math.round(urgency * 20).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            animation: 'countdown-pulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 14, color: PL, fontWeight: 800, letterSpacing: '0.02em' }}>
              {event.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {formatEventDate(event.event_date, locale)}
            </div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{
              fontSize: 40,
              fontWeight: 900,
              color: W,
              lineHeight: 1,
              textShadow: `0 0 20px ${PL}55, 0 0 40px ${P}33`,
              letterSpacing: '-0.02em',
            }}>
              {days}
            </div>
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              {t('days_to_go')}
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── DAILY REVEAL ── */}
      {state === 'reveal' && reveal && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P}ee, ${PM})`,
            borderRadius: 20,
            padding: '36px 24px 32px',
            marginBottom: 24,
            textAlign: 'center',
            cursor: 'pointer',
            animation: 'reveal-breathe 2.5s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${PL}33`,
            boxShadow: `0 0 40px ${P}44, 0 0 80px ${PD}33, inset 0 1px 0 ${PL}22`,
          }}
          onClick={doReveal}
        >
          {/* Ambient light rings */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200, height: 200,
            borderRadius: '50%',
            border: `1px solid ${PL}15`,
            animation: 'reveal-ring 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 280, height: 280,
            borderRadius: '50%',
            border: `1px solid ${PL}0a`,
            animation: 'reveal-ring 3s ease-in-out 0.5s infinite',
            pointerEvents: 'none',
          }} />

          {/* Floating sparkle particles */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {[
              { x: 10, y: 20, d: 0, c: PL }, { x: 85, y: 15, d: 0.5, c: SK },
              { x: 15, y: 70, d: 1.0, c: W }, { x: 90, y: 65, d: 1.5, c: PL },
              { x: 50, y: 10, d: 2.0, c: SK }, { x: 5, y: 45, d: 2.5, c: PL },
              { x: 95, y: 40, d: 3.0, c: W }, { x: 40, y: 85, d: 3.5, c: SK },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                width: 3, height: 3,
                borderRadius: '50%',
                background: s.c,
                animation: `reveal-sparkle 4s ease-in-out ${s.d}s infinite`,
              }} />
            ))}
          </div>

          {/* Gift icon with glow */}
          <div style={{
            position: 'relative',
            marginBottom: 16,
            display: 'inline-block',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56, height: 56,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${PL}33 0%, transparent 70%)`,
              animation: 'reveal-icon-glow 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <IconGift size={36} />
          </div>

          {/* XP amount — the hero */}
          <div style={{
            fontSize: 44,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            textShadow: `0 0 24px ${PL}88, 0 0 48px ${P}55`,
            letterSpacing: '-0.02em',
            position: 'relative',
            animation: 'reveal-xp-glow 2.5s ease-in-out infinite',
          }}>
            +{reveal.baseXp + reveal.bonusXp} XP
          </div>

          {/* Surprise label */}
          {reveal.surprise && (
            <div
              style={{
                marginTop: 12,
                fontSize: 14,
                color: SL,
                fontWeight: 700,
                position: 'relative',
                textShadow: `0 0 12px ${SK}44`,
              }}
            >
              <IconSparkle size={16} /> {t(`surprise_${reveal.surprise}`)}
            </div>
          )}

          {/* Call to action — the pull */}
          <div
            style={{
              marginTop: 20,
              fontSize: 13,
              color: `${PL}cc`,
              fontWeight: 600,
              letterSpacing: '0.04em',
              position: 'relative',
              animation: 'reveal-cta-pulse 2s ease-in-out infinite',
            }}
          >
            {t('tap_to_reveal')}
          </div>

          <style>{`
            @keyframes reveal-breathe {
              0%, 100% { transform: scale(1); box-shadow: 0 0 40px ${P}44, 0 0 80px ${PD}33, inset 0 1px 0 ${PL}22; }
              50% { transform: scale(1.015); box-shadow: 0 0 50px ${P}55, 0 0 100px ${PD}44, inset 0 1px 0 ${PL}33; }
            }
            @keyframes reveal-ring {
              0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.95); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            }
            @keyframes reveal-sparkle {
              0%, 100% { opacity: 0; transform: scale(0.3) translateY(0); }
              30% { opacity: 0.8; transform: scale(1.1) translateY(-4px); }
              60% { opacity: 0.5; transform: scale(0.9) translateY(-2px); }
            }
            @keyframes reveal-icon-glow {
              0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
            }
            @keyframes reveal-xp-glow {
              0%, 100% { text-shadow: 0 0 24px ${PL}88, 0 0 48px ${P}55; }
              50% { text-shadow: 0 0 32px ${PL}aa, 0 0 64px ${P}66, 0 0 80px ${PL}33; }
            }
            @keyframes reveal-cta-pulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      {!todayLogged && state === 'idle' && (() => {
        const er = streak?.earnedRest;
        const restAvailable = er?.available ?? false;
        const restTier = er?.tier ?? 'locked';
        const restProgress = er?.progress ?? 0;
        const restXp = er?.xpReward ?? 0;
        const daysCharged = er?.trainingDaysSinceRest ?? 0;

        return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Primary: I trained! — with Q bouncing inside */}
          <button
            onClick={() => {
              setQSpinning(true);
              setTimeout(() => setQSpinning(false), 700);
              logActivity('training');
            }}
            onMouseEnter={() => setQHover(true)}
            onMouseLeave={() => setQHover(false)}
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: 17,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${P}, ${PM}, ${PL})`,
              color: W,
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: qHover
                ? `0 6px 28px ${P}77, 0 0 50px ${P}33`
                : `0 4px 20px ${P}55, 0 0 40px ${P}22`,
              letterSpacing: '0.02em',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transform: qHover ? 'translateY(-1px)' : 'none',
            }}
            className="train-btn"
          >
            {/* Q is alive in the button — calm idle, excited on hover, runs on tap */}
            <span style={{
              display: 'inline-flex',
              animation: qSpinning
                ? 'q-btn-dash 0.6s ease-out'
                : qHover
                ? 'q-btn-excited 0.4s ease-in-out infinite'
                : 'q-btn-bounce 2s ease-in-out infinite',
              flexShrink: 0,
            }}>
              <QMiniButton pose={qSpinning ? 'running' : 'ready'} size={38} excited={qHover} />
            </span>
            <span>{t('log_training')}</span>
          </button>

          {/* ── EARNED REST BUTTON ── */}
          {/* The star feature: rest charges up with each training day */}
          <button
            onClick={() => restAvailable && logActivity('rest')}
            disabled={!restAvailable}
            style={{
              width: '100%',
              padding: restAvailable ? '18px 20px' : '14px 20px',
              fontSize: restAvailable ? 15 : 14,
              fontWeight: restAvailable ? 800 : 600,
              background: restAvailable
                ? restTier === 'supercharged'
                  ? `linear-gradient(135deg, rgba(231,76,60,0.12), rgba(243,156,18,0.10), rgba(241,196,15,0.10), rgba(39,174,96,0.10), rgba(41,128,185,0.10), rgba(142,68,173,0.12))`
                  : restTier === 'charged'
                  ? `linear-gradient(135deg, rgba(165,105,189,0.12), rgba(123,200,140,0.10))`
                  : `linear-gradient(135deg, rgba(165,105,189,0.08), rgba(255,255,255,0.03))`
                : 'rgba(255,255,255,0.02)',
              color: restAvailable
                ? restTier === 'supercharged' ? W : PL
                : 'rgba(255,255,255,0.3)',
              border: restAvailable
                ? restTier === 'supercharged'
                  ? `1px solid rgba(241,196,15,0.3)`
                  : `1px solid ${PL}33`
                : `1px solid rgba(255,255,255,0.04)`,
              borderRadius: 14,
              cursor: restAvailable ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: restTier === 'supercharged'
                ? `0 0 24px rgba(241,196,15,0.15), 0 0 48px rgba(142,68,173,0.1)`
                : restTier === 'charged'
                ? `0 0 16px ${PL}22`
                : 'none',
              animation: restTier === 'supercharged' ? 'earned-rest-glow 3s ease-in-out infinite' : undefined,
            }}
            className={restAvailable ? 'earned-rest-btn' : 'rest-btn'}
          >
            {/* Fill-up liquid animation — shows charging progress visually */}
            {!restAvailable && restProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: 0, right: 0, bottom: 0,
                height: `${Math.min(restProgress * 100, 100)}%`,
                background: `linear-gradient(0deg, rgba(165,105,189,0.12) 0%, rgba(165,105,189,0.04) 100%)`,
                borderRadius: 14,
                transition: 'height 1s ease-out',
                pointerEvents: 'none',
              }}>
                {/* Subtle wave at the fill top */}
                <div style={{
                  position: 'absolute',
                  top: -4,
                  left: 0, right: 0,
                  height: 8,
                  background: `radial-gradient(ellipse at 50% 100%, ${PL}15 0%, transparent 70%)`,
                  animation: 'rest-wave 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              </div>
            )}

            {/* Rainbow shimmer for supercharged */}
            {restTier === 'supercharged' && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                animation: 'rest-shimmer 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            )}

            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' }}>
              <IconEarnedRest size={22} progress={restProgress} tier={restTier} />
              <span>
                {restAvailable ? t('earned_rest') : t('rest_charging')}
              </span>
              {restAvailable && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: restTier === 'supercharged' ? '#F1C40F' : SK,
                  marginLeft: 4,
                  textShadow: restTier === 'supercharged' ? '0 0 8px rgba(241,196,15,0.5)' : undefined,
                }}>
                  +{restXp} XP
                </span>
              )}
              {!restAvailable && daysCharged > 0 && (
                <span style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.2)',
                  marginLeft: 4,
                }}>
                  {daysCharged}/2
                </span>
              )}
            </span>
          </button>

          {/* Q whisper when rest is available */}
          {restAvailable && (
            <div style={{
              textAlign: 'center',
              fontSize: 12,
              color: `${PL}99`,
              fontStyle: 'italic',
              marginTop: 4,
              animation: 'reveal-cta-pulse 3s ease-in-out infinite',
            }}>
              Q: &ldquo;{t('q_rest_nudge')}&rdquo;
            </div>
          )}
        </div>
        );
      })()}

      {/* ── ALREADY LOGGED ── */}
      {todayLogged && state === 'idle' && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 20px 28px',
            background: todayType === 'rest'
              ? `linear-gradient(135deg, rgba(231,76,60,0.04), rgba(243,156,18,0.04), rgba(241,196,15,0.05), rgba(39,174,96,0.04), rgba(41,128,185,0.04), rgba(142,68,173,0.05))`
              : `linear-gradient(135deg, ${SK}14, ${SK}08)`,
            border: todayType === 'rest'
              ? `1px solid rgba(241,196,15,0.15)`
              : `1px solid ${SK}33`,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Twinkling stars — rainbow for rest, green/purple for training */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {todayType === 'rest' ? (
              /* Rainbow twinkling stars for earned rest */
              [
                { x: 5, y: 10, d: 0, s: 10 }, { x: 90, y: 8, d: 0.4, s: 8 },
                { x: 15, y: 50, d: 0.8, s: 12 }, { x: 85, y: 45, d: 1.2, s: 10 },
                { x: 50, y: 5, d: 1.6, s: 8 }, { x: 8, y: 80, d: 2.0, s: 10 },
                { x: 92, y: 75, d: 2.4, s: 8 }, { x: 40, y: 90, d: 2.8, s: 12 },
                { x: 65, y: 85, d: 3.2, s: 10 }, { x: 25, y: 15, d: 3.6, s: 8 },
              ].map((s, i) => (
                <svg key={i} width={s.s} height={s.s} viewBox="0 0 24 24" fill="none" style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animation: `star-twinkle 3s ease-in-out ${s.d}s infinite`,
                }}>
                  <path d="M12 2L13.5 9.5L20 12L13.5 14.5L12 22L10.5 14.5L4 12L10.5 9.5L12 2Z" fill={RB[i % RB.length]} />
                </svg>
              ))
            ) : (
              [
                { x: 8, y: 14, d: 0, s: 4 }, { x: 88, y: 10, d: 0.6, s: 3 },
                { x: 50, y: 8, d: 1.2, s: 3 }, { x: 92, y: 60, d: 1.8, s: 4 },
                { x: 6, y: 75, d: 2.4, s: 3 }, { x: 72, y: 82, d: 3.0, s: 3 },
                { x: 30, y: 88, d: 3.6, s: 4 },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.s,
                  height: s.s,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? SK : PL,
                  animation: `card-sparkle 3s ease-in-out ${s.d}s infinite`,
                }} />
              ))
            )}
          </div>

          {/* Rainbow bar across the top for rest days */}
          {todayType === 'rest' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              display: 'flex',
              height: 3,
              overflow: 'hidden',
              borderRadius: '16px 16px 0 0',
            }}>
              {RB.map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, opacity: 0.6 }} />
              ))}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                animation: 'rest-shimmer 4s ease-in-out infinite',
              }} />
            </div>
          )}

          {/* Ambient glow behind Q */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: todayType === 'rest'
              ? `radial-gradient(circle, rgba(165,105,189,0.12) 0%, rgba(241,196,15,0.06) 50%, transparent 70%)`
              : `radial-gradient(circle, ${SK}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {todayType === 'rest' ? (
            <>
              {/* Moon + Q side by side */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 12,
                position: 'relative',
              }}>
                <div style={{ animation: 'rest-orb-spin 8s linear infinite' }}>
                  <IconEarnedRest size={56} progress={1} tier="supercharged" />
                </div>
                <div style={{ animation: 'q-sway 4s ease-in-out infinite' }}>
                  <QResting size={90} />
                </div>
              </div>

              {/* Q's whisper */}
              <div style={{
                fontSize: 13,
                color: `${PL}bb`,
                fontStyle: 'italic',
                marginBottom: 10,
                position: 'relative',
              }}>
                Q: &ldquo;{t('q_rest_quote')}&rdquo;
              </div>

              <div style={{
                fontSize: 17,
                fontWeight: 800,
                color: PL,
                textShadow: `0 0 16px ${PL}44, 0 0 32px ${P}22`,
                position: 'relative',
              }}>
                {t('rest_celebrate')}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 12, position: 'relative' }}><QCelebrating size={110} /></div>
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: SK,
                textShadow: `0 0 16px ${SK}44, 0 0 32px ${SK}22`,
                position: 'relative',
              }}>
                {t('already_logged')}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                marginTop: 6,
                position: 'relative',
              }}>
                {t('come_back_tomorrow')}
              </div>

              {/* Rest charging indicator — shows progress toward earned rest */}
              <BatteryIndicator
                earnedRest={streak?.earnedRest}
                label={t('rest_charging')}
                availableLabel={t('earned_rest')}
              />
            </>
          )}
        </div>
      )}

      {/* ── STREAK HISTORY (last 7 days) ── */}
      {streak && (
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
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
                        ? `conic-gradient(from 180deg, #E74C3C, #E67E22, #F1C40F, #27AE60, #2980B9, #8E44AD, #E74C3C)`
                        : 'rgba(255,255,255,0.03)',
                      border: day.isToday
                        ? `2px solid ${PL}`
                        : isActive
                        ? `2px solid ${PL}55`
                        : isRest
                        ? '2px solid rgba(255,255,255,0.15)'
                        : '2px solid rgba(255,255,255,0.06)',
                      boxShadow: day.isToday && isActive
                        ? `0 0 18px ${PL}77, 0 0 6px ${P}55, 0 0 30px ${P}33`
                        : isActive
                        ? `0 0 14px ${P}66, 0 0 4px ${PL}44`
                        : isRest
                        ? `0 0 14px rgba(241,196,15,0.3), 0 0 28px rgba(142,68,173,0.2), 0 0 6px rgba(39,174,96,0.25)`
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px',
                      position: 'relative',
                      overflow: 'visible',
                      animation: day.isToday && isActive
                        ? 'day-pulse 2s ease-in-out infinite'
                        : isRest
                        ? 'rest-orb-spin 8s linear infinite'
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
                      <>
                        {/* Sparkle ring around rest orbs */}
                        {[0, 72, 144, 216, 288].map((angle, si) => {
                          const rad = (angle * Math.PI) / 180;
                          const dist = 24;
                          const sx = Math.cos(rad) * dist;
                          const sy = Math.sin(rad) * dist;
                          return (
                            <div
                              key={si}
                              style={{
                                position: 'absolute',
                                width: 3.5,
                                height: 3.5,
                                borderRadius: '50%',
                                background: RB[si % RB.length],
                                left: `calc(50% + ${sx}px - 1.75px)`,
                                top: `calc(50% + ${sy}px - 1.75px)`,
                                animation: `today-sparkle 2.5s ease-in-out ${si * 0.5}s infinite`,
                                pointerEvents: 'none',
                              }}
                            />
                          );
                        })}
                        {/* Counter-spin so moon stays still while rainbow rotates */}
                        <div style={{ animation: 'rest-orb-counterspin 8s linear infinite' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 8a5.5 5.5 0 1 1-5.5 7.5A4.2 4.2 0 0 0 15 8Z" fill={W} opacity="0.95" />
                            <text x="16" y="8" fill={W} fontSize="6" fontWeight="800" fontFamily="sans-serif" opacity="0.8">z</text>
                          </svg>
                        </div>
                      </>
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
                        ? undefined
                        : 'rgba(255,255,255,0.2)',
                      fontWeight: isActive || isRest ? 800 : 600,
                      letterSpacing: isActive || isRest ? '0.04em' : undefined,
                      ...(isRest ? {
                        background: 'linear-gradient(90deg, #E74C3C, #E67E22, #F1C40F, #27AE60, #2980B9, #8E44AD)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      } : {}),
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

      <DashboardStyles />
    </div>
  );
}

