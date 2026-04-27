'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';
import { IconSeedling } from '@/components/icons';
import { getLevelInfo } from '@/lib/levels';
import { LevelBadge } from '@/components/level-badge';

// ═══════════════════════════════════════════════════════════
// strQ — Profile Page
// User stats, XP history, member info, and sign out
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const PM = '#7D3C98';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

interface XPLogEntry {
  id: string;
  amount: number;
  reason: 'activity' | 'streak_bonus' | 'multiplier' | 'surprise' | 'fuzzy_bonus';
  created_at: string;
  activity_date: string;
}

interface StreakState {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  created_at: string;
}

export default function ProfilePage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const supabase = createBrowserClient();

  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [stats, setStats] = useState<StreakState | null>(null);
  const [xpHistory, setXpHistory] = useState<XPLogEntry[]>([]);
  const [email, setEmail] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // ── Load data ──
  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setEmail(user.email || '');

    const [statsRes, xpRes] = await Promise.all([
      supabase
        .from('streak_state')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('xp_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (statsRes.data) {
      setStats(statsRes.data);
    }
    if (xpRes.data) {
      setXpHistory(xpRes.data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Sign out ──
  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = '/' + locale;
  };

  // ── GDPR data export (art. 15 + 20) ──
  // Calls /api/export which returns the user's full dataset as JSON.
  // Server enforces auth via Supabase cookies; RLS scopes the rows.
  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const res = await fetch('/api/export', { credentials: 'include' });
      if (!res.ok) {
        throw new Error(`Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `strq-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExporting(false);
    }
  };

  // ── Render ──
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

  const memberSinceDate = stats?.created_at
    ? new Date(stats.created_at).toLocaleDateString(
        locale === 'nl' ? 'nl-NL' : locale,
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : '—';

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', paddingBottom: 40 }}>
      {/* Rainbow bar with shimmer */}
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

      {/* Title */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: W,
          marginBottom: 24,
          letterSpacing: '-0.02em',
          textShadow: `0 0 20px ${P}44`,
        }}
      >
        {t('title')}
      </div>

      {/* ── LEVEL BADGE ── */}
      {stats && (
        <div style={{ marginBottom: 24 }}>
          <LevelBadge levelInfo={getLevelInfo(stats.total_xp || 0)} totalXp={stats.total_xp || 0} />
        </div>
      )}

      {/* ── STATS GRID ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {/* Total XP */}
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P})`,
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
            border: `1px solid rgba(108, 52, 131, 0.3)`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: PL,
              fontWeight: 800,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
            }}
          >
            {t('total_xp')}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: W,
              lineHeight: 1,
              textShadow: `0 0 16px ${PL}44`,
            }}
          >
            {stats?.total_xp?.toLocaleString() || 0}
          </div>
        </div>

        {/* Current Streak */}
        <div
          style={{
            background: `linear-gradient(135deg, ${SK}22, ${SL}22)`,
            border: `2px solid ${SK}`,
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
            boxShadow: `0 0 12px ${SK}22`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: SK,
              fontWeight: 800,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
            }}
          >
            {t('current_streak')}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: SK,
              lineHeight: 1,
              textShadow: `0 0 12px ${SK}33`,
            }}
          >
            {stats?.current_streak || 0}
          </div>
        </div>

        {/* Longest Streak */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: PL,
              fontWeight: 800,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.7,
            }}
          >
            {t('longest_streak')}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: PL,
              lineHeight: 1,
            }}
          >
            {stats?.longest_streak || 0}
          </div>
        </div>

        {/* Member Since */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t('member_since')}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: W,
              lineHeight: 1.4,
            }}
          >
            {memberSinceDate}
          </div>
        </div>
      </div>

      {/* ── ACCOUNT INFO ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(108, 52, 131, 0.12)`,
          borderRadius: 14,
          padding: '16px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Account
        </div>
        <div
          style={{
            fontSize: 14,
            color: W,
            wordBreak: 'break-all',
            marginBottom: 12,
            fontFamily: 'monospace',
          }}
        >
          {email}
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: 14,
            fontWeight: 600,
            background: 'rgba(255,100,100,0.15)',
            color: '#FF6B6B',
            border: '1px solid rgba(255,100,100,0.2)',
            borderRadius: 8,
            cursor: signingOut ? 'not-allowed' : 'pointer',
            opacity: signingOut ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          {signingOut ? '...' : t('sign_out')}
        </button>
      </div>

      {/* ── DATA EXPORT (GDPR art. 15 + 20) ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid rgba(108, 52, 131, 0.12)`,
          borderRadius: 14,
          padding: '16px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {t('data_export_title')}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.55,
            marginBottom: 14,
          }}
        >
          {t('data_export_description')}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: 14,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${P}, ${PM})`,
            color: W,
            border: 'none',
            borderRadius: 8,
            cursor: exporting ? 'wait' : 'pointer',
            opacity: exporting ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {exporting ? t('data_export_loading') : t('data_export_button')}
        </button>
        {exportError && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: '#FF6B6B',
              lineHeight: 1.4,
            }}
          >
            {t('data_export_error')}
          </div>
        )}
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.5,
          }}
        >
          <a
            href={`/${locale}/privacy`}
            style={{
              color: 'rgba(165,105,189,0.7)',
              textDecoration: 'none',
            }}
          >
            {t('data_export_privacy_link')}
          </a>
        </div>
      </div>

      {/* ── XP HISTORY ── */}
      {xpHistory.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: W,
              marginBottom: 12,
            }}
          >
            {t('xp_history')}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {xpHistory.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(108, 52, 131, 0.1)`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: W,
                      marginBottom: 2,
                    }}
                  >
                    {getReasonLabel(entry.reason, t)}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {formatDate(entry.activity_date || entry.created_at, locale)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: SK,
                    textShadow: `0 0 8px ${SK}22`,
                  }}
                >
                  +{entry.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes rainbow-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>

      {/* ── EMPTY STATE ── */}
      {xpHistory.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
          }}
        >
          <div style={{ marginBottom: 12 }}><IconSeedling size={36} /></div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            No XP history yet. Start training to see your progress!
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──
function getReasonLabel(
  reason: 'activity' | 'streak_bonus' | 'multiplier' | 'surprise' | 'fuzzy_bonus',
  t: (key: string) => string
): string {
  const reasonMap: Record<typeof reason, string> = {
    activity: t('reason_activity'),
    streak_bonus: t('reason_streak_bonus'),
    multiplier: t('reason_multiplier'),
    surprise: t('reason_surprise'),
    fuzzy_bonus: t('reason_fuzzy_bonus'),
  };
  return reasonMap[reason];
}

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale, {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}
