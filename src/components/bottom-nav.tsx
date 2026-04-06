// ═══════════════════════════════════════════════════════════
// strQ — Bottom Navigation
// Active tab glows. Inactive fades. Home pulses.
// ═══════════════════════════════════════════════════════════

'use client';

import { usePathname } from 'next/navigation';
import { IconStreak, IconFinish, IconProfile } from '@/components/icons';

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const SK = '#7BC88C';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

interface NavTab {
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  /** Match exact path (for home) or startsWith */
  exact?: boolean;
}

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();

  const tabs: NavTab[] = [
    {
      href: `/${locale}/app`,
      icon: <IconStreak size={22} />,
      activeIcon: <IconStreak size={26} />,
      label: 'strQ',
      exact: true,
    },
    {
      href: `/${locale}/app/event`,
      icon: <IconFinish size={22} />,
      activeIcon: <IconFinish size={26} />,
      label: 'Event',
    },
    {
      href: `/${locale}/app/profile`,
      icon: <IconProfile size={22} />,
      activeIcon: <IconProfile size={26} />,
      label: 'Profiel',
    },
  ];

  const isActive = (tab: NavTab) =>
    tab.exact
      ? pathname === tab.href
      : pathname.startsWith(tab.href);

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(20, 20, 38, 0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {/* Rainbow line on top */}
      <div
        style={{
          display: 'flex',
          height: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {RB.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c, opacity: 0.5 }} />
        ))}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          animation: 'nav-shimmer 4s ease-in-out infinite',
        }} />
      </div>

      {/* Tab items */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 68,
        }}
      >
        {tabs.map((tab, idx) => {
          const active = isActive(tab);
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`nav-tab ${active ? 'nav-tab-active' : 'nav-tab-inactive'}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                textDecoration: 'none',
                padding: '6px 20px',
                minWidth: 72,
                position: 'relative',
              }}
            >
              {/* Active glow behind icon */}
              {active && (
                <div style={{
                  position: 'absolute',
                  top: 4,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${PL}33 0%, transparent 70%)`,
                  animation: 'nav-glow 2s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Icon */}
              <div className="nav-icon" style={{
                position: 'relative',
                transform: active ? 'scale(1)' : 'scale(0.9)',
                opacity: active ? 1 : 0.4,
                filter: active ? `drop-shadow(0 0 6px ${PL}66)` : 'none',
              }}>
                {active ? tab.activeIcon : tab.icon}
              </div>

              {/* Label */}
              <span className="nav-label" style={{
                fontSize: active ? 11 : 10,
                fontWeight: active ? 800 : 600,
                color: active ? PL : 'rgba(255,255,255,0.35)',
                letterSpacing: active ? '0.04em' : undefined,
              }}>
                {tab.label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <div style={{
                  position: 'absolute',
                  bottom: -2,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: PL,
                  boxShadow: `0 0 6px ${PL}88`,
                }} />
              )}
            </a>
          );
        })}
      </div>

      <style>{`
        @keyframes nav-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes nav-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .nav-tab {
          transition: all 0.2s ease;
        }
        .nav-tab .nav-icon,
        .nav-tab .nav-label {
          transition: all 0.2s ease;
        }
        .nav-tab-inactive:hover .nav-icon {
          opacity: 0.75 !important;
          transform: scale(0.95) !important;
          filter: drop-shadow(0 0 4px ${PL}44) !important;
        }
        .nav-tab-inactive:hover .nav-label {
          color: rgba(255,255,255,0.6) !important;
        }
      `}</style>
    </nav>
  );
}
