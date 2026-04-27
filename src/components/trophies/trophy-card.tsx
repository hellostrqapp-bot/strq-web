'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  type TrophyEvent,
  getTrophyTier,
  getTierStyle,
  tierLabelKey,
  sportLabelKey,
  formatTime,
} from '@/lib/trophies';
import { QCelebratingLarge } from '@/components/q-poses/q-celebrating-large';
import { QProud } from '@/components/q-poses/q-proud';
import { QWarmLarge } from '@/components/q-poses/q-warm-large';
import { QResting } from '@/components/dashboard/q-resting';
import { formatEventDate } from '@/components/dashboard/helpers';

// ═══════════════════════════════════════════════════════════
// TrophyCard
// One completed event as a card. Pose on the left, metadata
// on the right. Tier shows as a subtle pill. The whole card
// links to the detail page.
// ═══════════════════════════════════════════════════════════

const PL = '#A569BD';
const PD = '#4A235A';
const W = '#FFFFFF';

export function TrophyCard({ event }: { event: TrophyEvent }) {
  const t = useTranslations('trophies');
  const locale = useLocale();
  const tier = getTrophyTier(event);
  const tierStyle = getTierStyle(tier);

  const pose = (() => {
    switch (tier) {
      case 'gold':
        return <QCelebratingLarge size={120} />;
      case 'silver':
        return <QProud size={120} />;
      case 'bronze':
        // Bronze keeps the proud stance, so it stays distinct from warm.
        return <QProud size={120} />;
      case 'warm':
      default:
        return <QWarmLarge size={120} />;
    }
  })();

  const fallbackPose = !event.target_time_minutes ? <QResting size={120} /> : null;

  return (
    <Link
      href={`/app/trophies/${event.id}`}
      className="trophy-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 14,
        alignItems: 'center',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(108, 52, 131, 0.18)`,
        borderRadius: 16,
        padding: '16px 18px',
        textDecoration: 'none',
        color: W,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: tier === 'gold'
          ? '0 0 24px rgba(241, 196, 15, 0.18)'
          : '0 4px 14px rgba(0, 0, 0, 0.18)',
      }}
    >
      {/* Pose, with optional gold glow ring */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {tier === 'gold' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(241,196,15,0.28) 0%, rgba(241,196,15,0) 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
        {fallbackPose ?? pose}
      </div>

      {/* Metadata */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.06em',
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
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: W,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {event.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <span>{formatEventDate(event.event_date, locale)}</span>
          {event.sport_type && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{t(sportLabelKey(event.sport_type))}</span>
            </>
          )}
          {event.result_time_minutes != null && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: PL, fontWeight: 700 }}>
                {formatTime(event.result_time_minutes)}
              </span>
            </>
          )}
        </div>
      </div>

      <style>{`
        .trophy-card:hover {
          transform: translateY(-2px);
          border-color: rgba(165, 105, 189, 0.45) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
        }
      `}</style>
    </Link>
  );
}
