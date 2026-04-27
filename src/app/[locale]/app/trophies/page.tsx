'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useTrophies } from '@/hooks/use-trophies';
import { TrophyCard } from '@/components/trophies/trophy-card';
import { QResting } from '@/components/dashboard/q-resting';

// ═══════════════════════════════════════════════════════════
// strQ, Trophy Cabinet (overview)
// Lists all completed events of the signed-in user, newest
// first. Empty state nudges towards planning a first event.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

export default function TrophiesPage() {
  const t = useTranslations('trophies');
  const { trophies, loading, error } = useTrophies();

  if (loading) {
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
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 40 }}>
      {/* Rainbow bar */}
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
            animation: 'rainbow-shimmer 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Title and subtitle */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: W,
          letterSpacing: '-0.02em',
          textShadow: `0 0 20px ${P}44`,
          marginBottom: 4,
        }}
      >
        {t('title')}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 24,
        }}
      >
        {t('subtitle')}
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '14px 16px',
            border: '1px solid rgba(255, 100, 100, 0.25)',
            background: 'rgba(255, 100, 100, 0.08)',
            color: '#FF8A8A',
            borderRadius: 12,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {t('error_load_failed')}
        </div>
      )}

      {/* Empty state */}
      {!error && trophies.length === 0 && (
        <EmptyState />
      )}

      {/* Trophy grid */}
      {trophies.length > 0 && (
        <div
          className="trophy-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 14,
          }}
        >
          {trophies.map((trophy, idx) => (
            <FadeInOnView key={trophy.id} index={idx}>
              <TrophyCard event={trophy} />
            </FadeInOnView>
          ))}
        </div>
      )}

      <style>{`
        @keyframes rainbow-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes trophy-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 720px) {
          .trophy-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────
function EmptyState() {
  const t = useTranslations('trophies');
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '32px 24px 40px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(108, 52, 131, 0.18)`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          opacity: 0.5,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <QResting size={140} />
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: W,
          marginBottom: 6,
          letterSpacing: '-0.01em',
        }}
      >
        {t('empty_title')}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 18,
          lineHeight: 1.5,
          maxWidth: 320,
          marginInline: 'auto',
        }}
      >
        {t('empty_subtitle')}
      </div>
      <Link
        href="/app/event"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${P}, ${PL})`,
          color: W,
          borderRadius: 10,
          textDecoration: 'none',
          boxShadow: `0 4px 14px ${P}55`,
        }}
      >
        {t('empty_cta')}
      </Link>
    </div>
  );
}

// ── Scroll-triggered fade and lift ─────────────────────────
function FadeInOnView({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.animationDelay = `${index * 60}ms`;
            el.style.animation = 'trophy-fade-up 0.45s ease-out forwards';
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(8px)' }}>
      {children}
    </div>
  );
}
