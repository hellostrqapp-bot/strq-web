'use client';

import { PL } from './colors';
import { IconEarnedRest } from '@/components/icons';
import type { EarnedRestInfo } from '@/lib/streak-engine';

// ═══════════════════════════════════════════════════════════
// Battery Indicator — vertical battery that fills like water
// Shows progress toward an earned rest day.
// ═══════════════════════════════════════════════════════════

interface BatteryIndicatorProps {
  earnedRest: EarnedRestInfo | undefined;
  label: string;         // t('rest_charging')
  availableLabel: string; // t('earned_rest')
}

export function BatteryIndicator({ earnedRest, label, availableLabel }: BatteryIndicatorProps) {
  const progress = earnedRest?.progress ?? 0;
  const daysCharged = earnedRest?.trainingDaysSinceRest ?? 0;
  const available = earnedRest?.available ?? false;

  if (daysCharged === 0 && !available) return null;

  const fillPct = Math.min(progress * 100, 100);

  return (
    <div style={{
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    }}>
      {/* Vertical battery cell */}
      <div style={{
        width: 28,
        height: 48,
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Battery cap (top nub) */}
        <div style={{
          position: 'absolute',
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 4,
          borderRadius: '3px 3px 0 0',
          background: available ? PL : 'rgba(255,255,255,0.15)',
          transition: 'background 0.5s',
        }} />
        {/* Battery body */}
        <div style={{
          position: 'absolute',
          top: 4, left: 0, right: 0, bottom: 0,
          borderRadius: 5,
          border: `1.5px solid ${available ? PL + '60' : 'rgba(255,255,255,0.12)'}`,
          background: 'rgba(255,255,255,0.03)',
          overflow: 'hidden',
          animation: available ? 'rest-charge-glow 2s ease-in-out infinite' : undefined,
        }}>
          {/* Water fill — rises from bottom */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            height: `${fillPct}%`,
            background: available
              ? `linear-gradient(0deg, rgba(231,76,60,0.6), rgba(243,156,18,0.5), rgba(241,196,15,0.5), rgba(39,174,96,0.5), rgba(41,128,185,0.5), rgba(142,68,173,0.6))`
              : `linear-gradient(0deg, ${PL}50, ${PL}30)`,
            transition: 'height 1.2s ease-out',
            animation: 'rest-charge-pulse 2.5s ease-in-out infinite',
            borderRadius: '0 0 3px 3px',
          }}>
            {/* Water surface wave */}
            <div style={{
              position: 'absolute',
              top: -3, left: -4, right: -4, height: 8,
              background: available
                ? `radial-gradient(ellipse at 50% 100%, rgba(142,68,173,0.4) 0%, transparent 70%)`
                : `radial-gradient(ellipse at 50% 100%, ${PL}30 0%, transparent 70%)`,
              animation: 'rest-water-wobble 2s ease-in-out infinite',
              borderRadius: '50%',
            }} />
            {/* Rising shimmer */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0, top: 0,
              background: 'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              animation: 'rest-charge-shimmer-v 3.5s ease-in-out infinite',
            }} />
          </div>
          {/* Subtle bubbles */}
          {!available && fillPct > 0 && (
            <>
              <div style={{
                position: 'absolute', bottom: '10%', left: '25%',
                width: 3, height: 3, borderRadius: '50%',
                background: `${PL}30`,
                animation: 'rest-bubble 2.8s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', bottom: '5%', left: '60%',
                width: 2, height: 2, borderRadius: '50%',
                background: `${PL}25`,
                animation: 'rest-bubble 3.4s ease-in-out infinite 0.8s',
              }} />
            </>
          )}
        </div>
      </div>
      {/* Label below battery */}
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: available ? PL : 'rgba(255,255,255,0.30)',
      }}>
        {available ? availableLabel : label}
      </span>
    </div>
  );
}
