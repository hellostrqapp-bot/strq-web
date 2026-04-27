'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  type TrophyEvent,
  getTrophyTier,
  getTierStyle,
  tierLabelKey,
  tierQuoteKey,
  sportLabelKey,
  formatTime,
} from '@/lib/trophies';
import { QCelebratingLarge } from '@/components/q-poses/q-celebrating-large';
import { QProud } from '@/components/q-poses/q-proud';
import { QWarmLarge } from '@/components/q-poses/q-warm-large';
import { formatEventDate } from '@/components/dashboard/helpers';

// ═══════════════════════════════════════════════════════════
// TrophyDetail
// Big Q in tier pose at the top. Two-column fact grid below.
// Q quote at the bottom. Back link to the gallery.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

export function TrophyDetail({ event }: { event: TrophyEvent }) {
  const t = useTranslations('trophies');
  const locale = useLocale();
  const tier = getTrophyTier(event);
  const tierStyle = getTierStyle(tier);

  const heroPose = (() => {
    switch (tier) {
      case 'gold':
        return <QCelebratingLarge size={220} />;
      case 'silver':
      case 'bronze':
        return <QProud size={220} />;
      case 'warm':
      default:
        return <QWarmLarge size={220} />;
    }
  })();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 40 }}>
      {/* Back link */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/app/trophies"
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span aria-hidden="true">←</span>
          {t('back')}
        </Link>
      </div>

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

      {/* Hero pose with optional gold halo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {tier === 'gold' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 55%, rgba(241,196,15,0.32) 0%, rgba(241,196,15,0) 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
        {heroPose}
      </div>

      {/* Tier pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: 999,
            background: tierStyle.pillBackground,
            color: tierStyle.pillText,
            border: tierStyle.pillBorder
              ? `1.5px solid ${tierStyle.pillBorder}`
              : 'none',
          }}
        >
          {t(tierLabelKey(tier))}
        </span>
      </div>

      {/* Event name */}
      <h1
        style={{
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: W,
          letterSpacing: '-0.02em',
          margin: '0 0 6px',
          lineHeight: 1.15,
        }}
      >
        {event.name}
      </h1>
      <div
        style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 28,
        }}
      >
        {formatEventDate(event.event_date, locale)}
      </div>

      {/* Two-column fact grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <FactBox
          label={t('detail_sport')}
          value={t(sportLabelKey(event.sport_type))}
        />
        <FactBox
          label={t('detail_date')}
          value={formatEventDate(event.event_date, locale)}
        />
        <FactBox
          label={t('detail_target')}
          value={
            event.target_time_minutes != null
              ? formatTime(event.target_time_minutes)
              : '...'
          }
        />
        <FactBox
          label={t('detail_finish')}
          value={
            event.result_time_minutes != null
              ? formatTime(event.result_time_minutes)
              : '...'
          }
          highlight
        />
        {event.fuzzy_bonus_xp != null && event.fuzzy_bonus_xp > 0 && (
          <FactBox
            label={t('detail_bonus')}
            value={`+${event.fuzzy_bonus_xp} XP`}
            wide
          />
        )}
      </div>

      {/* Q quote */}
      <div
        style={{
          background: `linear-gradient(135deg, ${PD}, ${P})`,
          borderRadius: 16,
          padding: '20px 22px',
          border: '1px solid rgba(165, 105, 189, 0.25)',
          textAlign: 'center',
          fontSize: 16,
          fontStyle: 'italic',
          fontWeight: 500,
          color: W,
          lineHeight: 1.5,
          textShadow: '0 1px 0 rgba(0,0,0,0.2)',
        }}
      >
        “{t(tierQuoteKey(tier))}”
      </div>
    </div>
  );
}

function FactBox({
  label,
  value,
  highlight = false,
  wide = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(108, 52, 131, 0.18)`,
        borderRadius: 14,
        padding: '14px 16px',
        gridColumn: wide ? '1 / -1' : undefined,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: PL,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.8,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: highlight ? 22 : 16,
          fontWeight: highlight ? 900 : 700,
          color: highlight ? PL : W,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}
