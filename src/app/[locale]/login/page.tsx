'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';

// ═══════════════════════════════════════════════════════════
// strQ — Login Page
// Magic link only. No passwords. Simple.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createBrowserClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/${locale}/app`,
        data: { locale },
      },
    });

    setLoading(false);

    if (authError) {
      setError(t('error'));
    } else {
      setSent(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Rainbow bar */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderRadius: 3, overflow: 'hidden' }}>
          {RB.map((c, i) => (
            <div key={i} style={{ flex: 1, height: 3, background: c }} />
          ))}
        </div>

        {/* Logo */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: W,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          str<span style={{ color: PL }}>Q</span>
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 15,
            marginBottom: 32,
          }}
        >
          {t('subtitle')}
        </p>

        {sent ? (
          // ── Success state ──
          <div
            style={{
              background: 'rgba(123,200,140,0.1)',
              border: '1.5px solid rgba(123,200,140,0.3)',
              borderRadius: 12,
              padding: '24px 20px',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
            <p style={{ color: '#7BC88C', fontSize: 15, fontWeight: 600 }}>
              {t('sent_title')}
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13,
                marginTop: 8,
              }}
            >
              {t('sent_description')}
            </p>
          </div>
        ) : (
          // ── Login form ──
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: W,
                outline: 'none',
                marginBottom: 12,
              }}
            />

            {error && (
              <p
                style={{
                  color: '#E74C3C',
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                background: loading ? PL : P,
                color: W,
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'wait' : 'pointer',
                opacity: !email ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? t('sending') : t('cta')}
            </button>
          </form>
        )}

        {/* Back to landing */}
        <a
          href={`/${locale}`}
          style={{
            display: 'inline-block',
            marginTop: 24,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          ← {t('back')}
        </a>
      </div>
    </div>
  );
}
