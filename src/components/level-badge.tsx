// ═══════════════════════════════════════════════════════════
// strQ — Level Badge
// Q's schild evolueert met je level.
// De progress ring vult richting de volgende level-up.
// ═══════════════════════════════════════════════════════════

'use client';

import { type LevelInfo, LEVELS } from '@/lib/levels';
import { useTranslations } from 'next-intl';

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const SD = '#4F9962';
const W = '#FFFFFF';
const GOLD = '#D4A017';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  totalXp: number;
}

/**
 * Q's evolving shield as a level badge with progress ring.
 * Sits between streak counter and event countdown on the dashboard.
 */
export function LevelBadge({ levelInfo, totalXp }: LevelBadgeProps) {
  const t = useTranslations('level');
  const { current, next, progress, xpInLevel, xpForNext } = levelInfo;

  // Past levels (last 3, faded — already conquered)
  const pastLevels = LEVELS.filter((l) => l.level < current.level).slice(-3);
  // Next 3 upcoming levels (faded teasers)
  const upcomingLevels = LEVELS.filter((l) => l.level > current.level).slice(0, 3);

  // Progress ring geometry
  const ringSize = 80;
  const ringStroke = 4;
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
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 24,
      }}
    >
      {/* Shield with progress ring */}
      <div style={{ position: 'relative', width: ringSize, height: ringSize, flexShrink: 0 }}>
        {/* Background ring */}
        <svg
          width={ringSize}
          height={ringSize}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={ringStroke}
          />
          {/* Progress ring */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={next ? PL : GOLD}
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
            size={48}
          />
        </div>
      </div>

      {/* Level info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 2,
          }}
        >
          Level {current.level}
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: W,
            marginBottom: 6,
          }}
        >
          {t(current.nameKey)}
        </div>

        {/* XP progress bar */}
        {next ? (
          <div>
            <div
              style={{
                width: '100%',
                height: 6,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${P}, ${PL})`,
                  borderRadius: 3,
                  transition: 'width 0.6s ease-out',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 4,
                fontSize: 10,
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 600,
              }}
            >
              <span>{totalXp.toLocaleString()} XP</span>
              <span>{next.xpRequired.toLocaleString()} XP</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: 11,
              color: GOLD,
              fontWeight: 600,
            }}
          >
            {totalXp.toLocaleString()} XP — MAX
          </div>
        )}

        {/* Level lane — past (faded) → current → future (faded) */}
        {(pastLevels.length > 0 || upcomingLevels.length > 0) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
            }}
          >
            {/* Past levels — faded, already conquered */}
            {pastLevels.map((lvl, i) => {
              // More recent = less faded
              const fadeIndex = pastLevels.length - 1 - i;
              const opacity = fadeIndex === 0 ? 0.35 : fadeIndex === 1 ? 0.2 : 0.1;
              return (
                <div
                  key={lvl.level}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity,
                  }}
                >
                  <QShield
                    stripes={lvl.shieldStripes}
                    glow={false}
                    goldRim={lvl.shieldGoldRim}
                    sparkles={false}
                    size={18}
                  />
                  <div style={{ fontSize: 7, color: W, fontWeight: 600, marginTop: 1 }}>
                    {t(lvl.nameKey)}
                  </div>
                </div>
              );
            })}

            {/* Current level — highlighted */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 4px',
              }}
            >
              <div style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: PL,
                marginBottom: 2,
              }} />
              <QShield
                stripes={current.shieldStripes}
                glow={false}
                goldRim={current.shieldGoldRim}
                sparkles={false}
                size={22}
              />
              <div style={{ fontSize: 7, color: PL, fontWeight: 700, marginTop: 1 }}>
                {t(current.nameKey)}
              </div>
            </div>

            {/* Upcoming levels — progressively faded */}
            {upcomingLevels.map((lvl, i) => (
              <div
                key={lvl.level}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: i === 0 ? 0.35 : i === 1 ? 0.2 : 0.1,
                }}
              >
                <QShield
                  stripes={lvl.shieldStripes}
                  glow={false}
                  goldRim={lvl.shieldGoldRim}
                  sparkles={false}
                  size={18}
                />
                <div style={{ fontSize: 7, color: W, fontWeight: 600, marginTop: 1 }}>
                  {t(lvl.nameKey)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Q's Shield SVG ──
// Evolves from bare purple to full rainbow + gold + sparkles

interface QShieldProps {
  stripes: number;
  glow: boolean;
  goldRim: boolean;
  sparkles: boolean;
  size?: number;
}

function QShield({ stripes, glow, goldRim, sparkles, size = 48 }: QShieldProps) {
  const id = `shield-${stripes}-${glow ? 'g' : ''}-${goldRim ? 'r' : ''}`;

  return (
    <svg width={size} height={size} viewBox="0 0 60 68" fill="none">
      {/* Glow filter */}
      {glow && (
        <defs>
          <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}

      {/* Glow background */}
      {glow && (
        <ellipse
          cx="30"
          cy="34"
          rx="26"
          ry="30"
          fill={PL}
          opacity="0.15"
          filter={`url(#${id}-glow)`}
        />
      )}

      {/* Gold rim */}
      {goldRim && (
        <path
          d="M30 4 C12 4, 4 18, 4 34 C4 50, 18 64, 30 64 C42 64, 56 50, 56 34 C56 18, 48 4, 30 4Z"
          fill="none"
          stroke={GOLD}
          strokeWidth="2.5"
          opacity="0.7"
        />
      )}

      {/* Shield body */}
      <path
        d="M30 6 C14 6, 6 19, 6 34 C6 49, 19 62, 30 62 C41 62, 54 49, 54 34 C54 19, 46 6, 30 6Z"
        fill={P}
      />

      {/* Inner shell pattern */}
      <ellipse cx="30" cy="30" rx="14" ry="12" stroke={PD} strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="27" cy="28" rx="7" ry="5" fill={PL} opacity="0.08" />

      {/* Rainbow stripes — earned one by one */}
      {RB.slice(0, stripes).map((c, i) => (
        <path
          key={i}
          d={`M${14 + i * 1.2} ${36 + i * 2} Q30 ${22 + i * 2} ${46 - i * 1.2} ${36 + i * 2}`}
          stroke={c}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      {/* Aviator glasses reflection (subtle) */}
      <ellipse cx="23" cy="26" rx="7" ry="5" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <ellipse cx="37" cy="26" rx="7" ry="5" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />

      {/* Sparkle particles */}
      {sparkles && (
        <g>
          <QSparkle cx={8} cy={12} delay={0} />
          <QSparkle cx={52} cy={16} delay={0.4} />
          <QSparkle cx={10} cy={52} delay={0.8} />
          <QSparkle cx={50} cy={48} delay={1.2} />
        </g>
      )}

      {/* Inline keyframes for sparkle animation */}
      {sparkles && (
        <style>{`
          @keyframes shield-sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 0.8; transform: scale(1); }
          }
        `}</style>
      )}
    </svg>
  );
}

/** Small sparkle particle with animation */
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
        y1={cy - 3}
        x2={cx}
        y2={cy + 3}
        stroke={W}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1={cx - 3}
        y1={cy}
        x2={cx + 3}
        y2={cy}
        stroke={W}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}
