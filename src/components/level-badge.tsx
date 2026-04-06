// ═══════════════════════════════════════════════════════════
// strQ — Level Badge
// Q's schild evolueert met je level.
// De progress ring vult richting de volgende level-up.
// 5% stoerder. Subtiel sparkle. Geen paasei.
// ═══════════════════════════════════════════════════════════

'use client';

import { type LevelInfo, LEVELS } from '@/lib/levels';
import { useTranslations } from 'next-intl';

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const PM = '#7D3C98';
const W = '#FFFFFF';
const GOLD = '#D4A017';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  totalXp: number;
}

export function LevelBadge({ levelInfo, totalXp }: LevelBadgeProps) {
  const t = useTranslations('level');
  const { current, next, progress } = levelInfo;

  // Next upcoming levels (for teaser lane)
  const upcomingLevels = LEVELS.filter((l) => l.level > current.level).slice(0, 3);

  // Progress ring geometry — dikker, meer presence
  const ringSize = 84;
  const ringStroke = 5.5;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(108, 52, 131, 0.15)`,
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      {/* Shield with progress ring */}
      <div style={{ position: 'relative', width: ringSize, height: ringSize, flexShrink: 0 }}>
        <svg
          width={ringSize}
          height={ringSize}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Gradient for the progress ring */}
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={PL} />
              <stop offset="100%" stopColor={PM} />
            </linearGradient>
          </defs>

          {/* Background ring — more visible */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={ringStroke}
          />
          {/* Progress ring — gradient, not flat */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={next ? 'url(#ring-grad)' : GOLD}
            strokeWidth={ringStroke}
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>

        {/* Q's Shield */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <QShield
            stripes={current.shieldStripes}
            glow={current.shieldGlow}
            goldRim={current.shieldGoldRim}
            sparkles={current.shieldSparkles}
            size={50}
          />
        </div>
      </div>

      {/* Level info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: PL,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 2,
            opacity: 0.7,
          }}
        >
          Level {current.level}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: W,
            marginBottom: 8,
            textShadow: `0 0 20px ${P}44`,
          }}
        >
          {t(current.nameKey)}
        </div>

        {/* XP progress bar — dikker, meer punch */}
        {next ? (
          <div>
            <div
              style={{
                width: '100%',
                height: 8,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${P}, ${PL}, ${PM})`,
                  borderRadius: 4,
                  transition: 'width 0.6s ease-out',
                  position: 'relative',
                }}
              >
                {/* Shimmer animation on the bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    animation: 'bar-shimmer 2.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 4,
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 700,
              }}
            >
              <span>{totalXp.toLocaleString()} XP</span>
              <span>{next.xpRequired.toLocaleString()} XP</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: GOLD,
              fontWeight: 700,
              textShadow: `0 0 12px ${GOLD}33`,
            }}
          >
            {totalXp.toLocaleString()} XP — MAX
          </div>
        )}

        {/* Next level teaser */}
        {next && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 10,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <rect x="2" y="4" width="12" height="10" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <path d="M5.5 4V2.5a2.5 2.5 0 0 1 5 0V4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
              {t(next.nameKey)}
            </span>
            {upcomingLevels.slice(1).map((lvl) => (
              <span
                key={lvl.level}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.15)',
                  letterSpacing: '0.04em',
                }}
              >
                → {t(lvl.nameKey)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes bar-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

// ── Q's Shield SVG ──
// Diepere gradient, scherper contrast, meer stoer

interface QShieldProps {
  stripes: number;
  glow: boolean;
  goldRim: boolean;
  sparkles: boolean;
  size?: number;
}

function QShield({ stripes, glow, goldRim, sparkles, size = 50 }: QShieldProps) {
  const id = `shield-${stripes}-${glow ? 'g' : ''}-${goldRim ? 'r' : ''}`;

  return (
    <svg width={size} height={size} viewBox="0 0 60 68" fill="none">
      <defs>
        {/* Shield gradient — donker boven, lichter onder = diepte */}
        <linearGradient id={`${id}-body`} x1="30" y1="6" x2="30" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={PD} />
          <stop offset="50%" stopColor={P} />
          <stop offset="100%" stopColor={PM} />
        </linearGradient>

        {/* Glow filter */}
        {glow && (
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Glow aura */}
      {glow && (
        <ellipse
          cx="30"
          cy="34"
          rx="28"
          ry="32"
          fill={PL}
          opacity="0.18"
          filter={`url(#${id}-glow)`}
        />
      )}

      {/* Gold rim */}
      {goldRim && (
        <path
          d="M30 3 C11 3, 3 17, 3 34 C3 51, 17 65, 30 65 C43 65, 57 51, 57 34 C57 17, 49 3, 30 3Z"
          fill="none"
          stroke={GOLD}
          strokeWidth="2.5"
          opacity="0.75"
        />
      )}

      {/* Shield body — gradient voor diepte */}
      <path
        d="M30 6 C14 6, 6 19, 6 34 C6 49, 19 62, 30 62 C41 62, 54 49, 54 34 C54 19, 46 6, 30 6Z"
        fill={`url(#${id}-body)`}
      />

      {/* Highlight glans — subtiele lichtreflectie linksboven */}
      <ellipse cx="22" cy="20" rx="12" ry="8" fill="rgba(255,255,255,0.06)" />

      {/* Inner shell pattern */}
      <ellipse cx="30" cy="30" rx="14" ry="12" stroke={PD} strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* Rainbow stripes — earned one by one, iets dikker */}
      {RB.slice(0, stripes).map((c, i) => (
        <path
          key={i}
          d={`M${14 + i * 1.2} ${36 + i * 2} Q30 ${22 + i * 2} ${46 - i * 1.2} ${36 + i * 2}`}
          stroke={c}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}

      {/* Aviator glasses reflection */}
      <ellipse cx="23" cy="26" rx="7" ry="5" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
      <ellipse cx="37" cy="26" rx="7" ry="5" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />

      {/* Sparkle particles */}
      {sparkles && (
        <g>
          <QSparkle cx={6} cy={10} delay={0} />
          <QSparkle cx={54} cy={14} delay={0.5} />
          <QSparkle cx={8} cy={54} delay={1.0} />
          <QSparkle cx={52} cy={50} delay={1.5} />
        </g>
      )}

      {sparkles && (
        <style>{`
          @keyframes shield-sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 0.85; transform: scale(1.1); }
          }
        `}</style>
      )}
    </svg>
  );
}

function QSparkle({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <g
      style={{
        animation: `shield-sparkle 2s ease-in-out ${delay}s infinite`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <line
        x1={cx}
        y1={cy - 3.5}
        x2={cx}
        y2={cy + 3.5}
        stroke={W}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1={cx - 3.5}
        y1={cy}
        x2={cx + 3.5}
        y2={cy}
        stroke={W}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}
