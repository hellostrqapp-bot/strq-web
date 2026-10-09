'use client';

import { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import {
  COOP_COLORS,
  COOP_HEX,
  getInvite,
  joinSeason,
  type CoopColor,
  type CoopInvitePreview,
} from '@/lib/coop';
import { P, PL, PD, BG, W } from '@/components/dashboard';

// ═══════════════════════════════════════════════════════════
// strQ, Co-op join
// Komt binnen via de deelbare invite-link. Toont een preview
// van het seizoen, laat een vrije kleur en weergavenaam kiezen,
// en vraagt expliciete toestemming voordat je meedoet.
// ═══════════════════════════════════════════════════════════

function JoinInner() {
  const t = useTranslations('coop');
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [preview, setPreview] = useState<CoopInvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState<CoopColor | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [consent, setConsent] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const p = await getInvite(token);
        if (cancelled) return;
        setPreview(p);
        if (p.valid && p.taken_colors) {
          const free = COOP_COLORS.find((c) => !p.taken_colors!.includes(c));
          if (free) setColor(free);
        }
      } catch (err) {
        console.error('[coop join] preview failed', err);
        if (!cancelled) setPreview({ valid: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleJoin() {
    if (!color || !displayName.trim() || !consent) {
      setJoinError(t('join_incomplete'));
      return;
    }
    setJoining(true);
    setJoinError(null);
    try {
      await joinSeason(token, color, displayName.trim());
      router.push('/app/coop');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('color_taken')) setJoinError(t('err_color_taken'));
      else if (msg.includes('season_full')) setJoinError(t('err_full'));
      else if (msg.includes('invalid_invite')) setJoinError(t('err_invalid'));
      else setJoinError(t('err_join'));
      setJoining(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  if (!token || !preview || !preview.valid) {
    return (
      <Centered>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          {t('invite_invalid')}
        </p>
        <Link href="/app/coop" style={{ color: PL, fontWeight: 700, textDecoration: 'none' }}>
          {t('to_coop')}
        </Link>
      </Centered>
    );
  }

  if (preview.already_member) {
    return (
      <Centered>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          {t('already_member')}
        </p>
        <Link href="/app/coop" style={{ color: PL, fontWeight: 700, textDecoration: 'none' }}>
          {t('to_coop')}
        </Link>
      </Centered>
    );
  }

  if (preview.is_full) {
    return (
      <Centered>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t('err_full')}</p>
      </Centered>
    );
  }

  const taken = preview.taken_colors ?? [];

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '32px 18px 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
          {t('join_invited')}
        </p>
        <h1 style={{ color: PL, fontSize: 24, fontWeight: 800, margin: '6px 0 0' }}>
          {preview.name}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '8px 0 0' }}>
          {t('join_goal', { n: preview.goal_days ?? 0 })}
        </p>
      </div>

      <div style={card}>
        <Label text={t('field_displayname')} />
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t('field_displayname_ph')}
          style={inputStyle}
          maxLength={24}
        />

        <Label text={t('field_color')} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {COOP_COLORS.map((c) => {
            const isTaken = taken.includes(c);
            const isSel = color === c;
            return (
              <button
                key={c}
                type="button"
                disabled={isTaken}
                onClick={() => setColor(c)}
                aria-label={c}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: COOP_HEX[c],
                  border: isSel ? `3px solid ${W}` : '3px solid transparent',
                  opacity: isTaken ? 0.2 : 1,
                  cursor: isTaken ? 'not-allowed' : 'pointer',
                  boxShadow: isSel ? `0 0 12px ${COOP_HEX[c]}88` : 'none',
                }}
              />
            );
          })}
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginTop: 20,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ marginTop: 3, accentColor: P, width: 18, height: 18, flexShrink: 0 }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>
            {t('consent')}
          </span>
        </label>

        {joinError && (
          <p style={{ color: '#E74C3C', fontSize: 13, marginTop: 12 }}>{joinError}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={joining || !consent || !color || !displayName.trim()}
          style={{
            ...primaryBtn,
            width: '100%',
            marginTop: 18,
            opacity: joining || !consent || !color || !displayName.trim() ? 0.5 : 1,
          }}
        >
          {joining ? t('joining') : t('join_cta')}
        </button>
      </div>

      <p style={hint}>{t('consent_note')}</p>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <JoinInner />
    </Suspense>
  );
}

// ── helpers ──

function Spinner() {
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

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 100, padding: 24 }}>{children}</div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <label
      style={{
        display: 'block',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 700,
        margin: '14px 0 6px',
      }}
    >
      {text}
    </label>
  );
}

const card: React.CSSProperties = {
  background: BG,
  border: '0.5px solid rgba(165,105,189,0.2)',
  borderRadius: 16,
  padding: '16px 18px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#23233f',
  border: '0.5px solid rgba(165,105,189,0.25)',
  borderRadius: 10,
  padding: '10px 12px',
  color: W,
  fontSize: 14,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const primaryBtn: React.CSSProperties = {
  padding: '11px 24px',
  fontSize: 14,
  fontWeight: 700,
  background: `linear-gradient(135deg, ${P}, ${PL})`,
  color: W,
  border: 'none',
  borderRadius: 22,
  cursor: 'pointer',
};

const hint: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: 12,
  lineHeight: 1.6,
  textAlign: 'center',
  marginTop: 20,
  padding: '0 12px',
};
