'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { RainbowRoad } from '@/components/rainbow-road';
import { useCoop } from '@/hooks/use-coop';
import {
  COOP_COLORS,
  COOP_HEX,
  MAX_MEMBERS,
  createSeason,
  createInvite,
  memberShareProgress,
  type CoopColor,
} from '@/lib/coop';
import { P, PL, PD, BG, W } from '@/components/dashboard';

// ═══════════════════════════════════════════════════════════
// strQ, Co-op gezamenlijk doel (Samen)
// Gepoold seizoensdoel met vrienden. De Rainbow Road draait op
// echte bijdragen uit de activities-tabel. Co-op, geen
// ranglijst, met een eindstreep.
// ═══════════════════════════════════════════════════════════

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function CoopPage() {
  const t = useTranslations('coop');
  const locale = useLocale();
  const { seasons, active, loading, error, reload, selectSeason } = useCoop();

  // create-form state
  const [name, setName] = useState('');
  const [goalDays, setGoalDays] = useState(60);
  const [endDate, setEndDate] = useState(plusDaysISO(90));
  const [color, setColor] = useState<CoopColor>('purple');
  const [displayName, setDisplayName] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // invite state
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !displayName.trim()) {
      setFormError(t('err_required'));
      return;
    }
    setCreating(true);
    setFormError(null);
    try {
      const id = await createSeason({
        name: name.trim(),
        goalDays,
        startDate: todayISO(),
        endDate,
        color,
        displayName: displayName.trim(),
      });
      reload();
      selectSeason(id);
    } catch (err) {
      console.error('[coop] create failed', err);
      setFormError(t('err_create'));
    } finally {
      setCreating(false);
    }
  }

  async function handleInvite() {
    if (!active) return;
    setInviting(true);
    try {
      const token = await createInvite(active.season_id);
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      // localePrefix is 'as-needed': the default locale (nl) has no prefix
      const prefix = locale === 'nl' ? '' : `/${locale}`;
      const link = `${origin}${prefix}/app/coop/join?token=${token}`;
      setInviteLink(link);
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard blocked: link stays visible to copy by hand
      }
    } catch (err) {
      console.error('[coop] invite failed', err);
    } finally {
      setInviting(false);
    }
  }

  // ── Loading ──
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

  // ── Not logged in ──
  if (error === 'not_logged_in') {
    return (
      <div style={{ textAlign: 'center', paddingTop: 100, padding: 24 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          {t('login_needed')}
        </p>
        <Link
          href="/login"
          style={{ color: PL, fontWeight: 700, textDecoration: 'none' }}
        >
          {t('login_cta')}
        </Link>
      </div>
    );
  }

  // ── Load error ──
  if (error === 'load_failed') {
    return (
      <div style={{ textAlign: 'center', paddingTop: 100, padding: 24 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          {t('load_failed')}
        </p>
        <button onClick={reload} style={primaryBtn}>
          {t('retry')}
        </button>
      </div>
    );
  }

  // ── Empty: create a season ──
  if (!active) {
    return (
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '24px 18px 120px' }}>
        <Header t={t} />

        <div style={card}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>
            {t('create_intro')}
          </p>

          <Label text={t('field_name')} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('field_name_ph')}
            style={inputStyle}
            maxLength={60}
          />

          <Label text={t('field_displayname')} />
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('field_displayname_ph')}
            style={inputStyle}
            maxLength={24}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Label text={t('field_goal')} />
              <input
                type="number"
                min={1}
                max={365}
                value={goalDays}
                onChange={(e) => setGoalDays(Math.max(1, Number(e.target.value) || 1))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label text={t('field_end')} />
              <input
                type="date"
                value={endDate}
                min={todayISO()}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <Label text={t('field_color')} />
          <ColorPicker selected={color} taken={[]} onPick={setColor} />

          {formError && (
            <p style={{ color: '#E74C3C', fontSize: 13, marginTop: 12 }}>{formError}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={creating}
            style={{ ...primaryBtn, width: '100%', marginTop: 18, opacity: creating ? 0.6 : 1 }}
          >
            {creating ? t('creating') : t('create_cta')}
          </button>
        </div>

        <p style={hint}>{t('coop_rules')}</p>
      </div>
    );
  }

  // ── Active season ──
  const memberCount = active.members.length;
  const pct = Math.min(100, Math.round((active.pooled_total / active.goal_days) * 100));
  const reached = active.pooled_total >= active.goal_days;

  const friends = active.members.map((m) => ({
    name: m.display_name,
    xp: memberShareProgress(m.moved_days, active.goal_days, memberCount),
  }));

  return (
    <div style={{ maxWidth: 460, margin: '0 auto', padding: '24px 18px 120px' }}>
      <Header t={t} />

      {seasons.length > 1 && (
        <select
          value={active.season_id}
          onChange={(e) => selectSeason(e.target.value)}
          style={{ ...inputStyle, marginBottom: 16 }}
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {/* Pooled progress headline */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: W, fontSize: 17, fontWeight: 800 }}>{active.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            {active.days_left} {t('days_left')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          <span style={{ color: PL, fontSize: 32, fontWeight: 800 }}>{active.pooled_total}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
            / {active.goal_days} {t('days_together')}
          </span>
        </div>

        <div style={{ height: 12, borderRadius: 7, background: '#23233f', overflow: 'hidden', marginTop: 10 }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              borderRadius: 7,
              background:
                'linear-gradient(90deg,#E74C3C,#E67E22,#27AE60,#1ABC9C,#2980B9,#8E44AD)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        {reached && (
          <p style={{ color: '#1ABC9C', fontSize: 13, fontWeight: 700, marginTop: 10, marginBottom: 0 }}>
            {t('reached')}
          </p>
        )}
      </div>

      {/* Rainbow Road on real data */}
      <div style={{ marginTop: 8 }}>
        <RainbowRoad
          eventName={active.name}
          daysToGo={active.days_left}
          friends={friends}
          strings={{
            header: t('road_header'),
            daysToGo: t('days_left'),
            count: t('road_count'),
            invite: inviting ? t('inviting') : t('invite_cta'),
          }}
          onInvite={handleInvite}
        />
      </div>

      {/* Invite link surfaced after generating */}
      {inviteLink && (
        <div style={{ ...card, marginTop: 8 }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 0, marginBottom: 8 }}>
            {copied ? t('invite_copied') : t('invite_share')}
          </p>
          <div
            style={{
              background: '#23233f',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 12,
              color: PL,
              wordBreak: 'break-all',
            }}
          >
            {inviteLink}
          </div>
        </div>
      )}

      {/* Member contributions, never a ranking */}
      <div style={{ ...card, marginTop: 8 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 0, marginBottom: 12 }}>
          {t('members_header')}
        </p>
        {active.members.map((m) => (
          <div
            key={m.color}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: COOP_HEX[m.color],
                flexShrink: 0,
              }}
            />
            <span style={{ color: W, fontSize: 14, fontWeight: m.is_me ? 800 : 500 }}>
              {m.display_name}
              {m.is_me && <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}> {t('you')}</span>}
            </span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              {m.moved_days} {t('days_short')}
            </span>
            {m.moved_today && (
              <span style={{ color: '#1ABC9C', fontSize: 11, fontWeight: 700 }}>
                {t('today')}
              </span>
            )}
          </div>
        ))}
        {memberCount < MAX_MEMBERS && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 0, marginTop: 10 }}>
            {t('room_left', { n: MAX_MEMBERS - memberCount })}
          </p>
        )}
      </div>

      <p style={hint}>{t('coop_rules')}</p>
    </div>
  );
}

// ── Small presentational helpers ───────────────────────────

function Header({ t }: { t: (k: string) => string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h1 style={{ color: W, fontSize: 22, fontWeight: 800, margin: 0 }}>{t('title')}</h1>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '4px 0 0' }}>
        {t('subtitle')}
      </p>
    </div>
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

function ColorPicker({
  selected,
  taken,
  onPick,
}: {
  selected: CoopColor;
  taken: CoopColor[];
  onPick: (c: CoopColor) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {COOP_COLORS.map((c) => {
        const isTaken = taken.includes(c);
        const isSel = selected === c;
        return (
          <button
            key={c}
            type="button"
            disabled={isTaken}
            onClick={() => onPick(c)}
            aria-label={c}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: COOP_HEX[c],
              border: isSel ? `3px solid ${W}` : '3px solid transparent',
              opacity: isTaken ? 0.25 : 1,
              cursor: isTaken ? 'not-allowed' : 'pointer',
              boxShadow: isSel ? `0 0 12px ${COOP_HEX[c]}88` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────

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
