// ═══════════════════════════════════════════════════════════
// strQ — Paywall Gate Component
// Wrap premium features (Twin) with this component.
// Shows upgrade prompt for free users, children for premium.
//
// Usage:
//   <Paywall isPremium={sub.isPremium}>
//     <TwinDashboard />
//   </Paywall>
// ═══════════════════════════════════════════════════════════

'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { PREMIUM_PRICE_EUR } from '@/lib/stripe';

interface PaywallProps {
  isPremium: boolean;
  children: ReactNode;
  /** Optional: which feature is being gated (for analytics) */
  feature?: string;
}

// Brand colors
const P = '#6C3483';
const PL = '#A569BD';
const BG = '#1A1A2E';

export default function Paywall({ isPremium, children, feature }: PaywallProps) {
  const t = useTranslations();

  if (isPremium) return <>{children}</>;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${BG} 0%, #2D1B4E 100%)`,
        border: `1px solid ${P}`,
        borderRadius: 16,
        padding: '32px 24px',
        textAlign: 'center',
        maxWidth: 400,
        margin: '24px auto',
      }}
    >
      {/* Lock icon */}
      <div style={{ fontSize: 48, marginBottom: 16 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="20" width="32" height="24" rx="4" fill={P} />
          <path
            d="M16 20V14C16 9.58 19.58 6 24 6C28.42 6 32 9.58 32 14V20"
            stroke={PL}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="32" r="3" fill={PL} />
        </svg>
      </div>

      <h3
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          margin: '0 0 8px',
        }}
      >
        {t('paywall_title')}
      </h3>

      <p
        style={{
          color: PL,
          fontSize: 14,
          margin: '0 0 24px',
          lineHeight: 1.5,
        }}
      >
        {t('paywall_description')}
      </p>

      <button
        onClick={() => {
          // TODO: Create Stripe Checkout session via API route
          // fetch('/api/stripe/checkout', { method: 'POST' })
          //   .then(r => r.json())
          //   .then(({ url }) => window.location.href = url);
          console.log('[strQ] Upgrade clicked', { feature });
        }}
        style={{
          background: `linear-gradient(135deg, ${P}, ${PL})`,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '14px 32px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          width: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = `0 0 20px ${P}80`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {t('paywall_cta', { price: PREMIUM_PRICE_EUR.toFixed(2).replace('.', ',') })}
      </button>

      <p
        style={{
          color: '#ffffff60',
          fontSize: 11,
          marginTop: 12,
        }}
      >
        {t('paywall_cancel')}
      </p>
    </div>
  );
}
