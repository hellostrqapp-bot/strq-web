'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';
import { IconEdit, IconDelete, IconFinish, IconSparkle } from '@/components/icons';
import { RainbowRoad } from '@/components/rainbow-road';
import { calculateFuzzyBonus } from '@/lib/streak-engine';
import { reportError } from '@/lib/error-reporting';

// ═══════════════════════════════════════════════════════════
// strQ — Event Page
// Add, edit, view, and delete upcoming events with countdown
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const PM = '#7D3C98';
const SK = '#7BC88C';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

type EventFormState = 'closed' | 'adding' | 'editing';

interface EventData {
  id: string;
  name: string;
  event_date: string;
  target_time_minutes: number | null;
  result_time_minutes: number | null;
  sport_type: 'hyrox' | 'running' | 'triathlon' | 'cycling' | 'other';
}

export default function EventPage() {
  const t = useTranslations('event');
  const locale = useLocale();
  const supabase = createBrowserClient();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [formState, setFormState] = useState<EventFormState>('closed');
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    target_time_minutes: '',
    sport_type: 'other' as EventData['sport_type'],
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [resultMinutes, setResultMinutes] = useState('');
  const [postRace, setPostRace] = useState<{
    tier: 'gold' | 'silver' | 'bronze' | 'warm';
    xp: number;
    message: string;
  } | null>(null);
  const [submittingResult, setSubmittingResult] = useState(false);

  // ── Load event ──
  const loadEvent = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(1)
      .single();

    if (!err && data) {
      setEvent(data);
      setFormData({
        name: data.name,
        event_date: data.event_date,
        target_time_minutes: data.target_time_minutes?.toString() || '',
        sport_type: data.sport_type || 'other',
      });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  // ── Save event ──
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const eventPayload = {
      user_id: user.id,
      name: formData.name.trim(),
      event_date: formData.event_date,
      target_time_minutes: formData.target_time_minutes
        ? parseInt(formData.target_time_minutes, 10)
        : null,
      sport_type: formData.sport_type,
      status: 'upcoming' as const,
    };

    if (event?.id) {
      // Update
      const { error: err } = await supabase
        .from('events')
        .update(eventPayload)
        .eq('id', event.id);

      if (err) {
        console.error('Event update error:', err.message, err.code);
        setError(`Failed to update event: ${err.message}`);
        return;
      }
    } else {
      // Insert
      const { error: err } = await supabase.from('events').insert([eventPayload]);

      if (err) {
        console.error('Event insert error:', err.message, err.code);
        setError(`Failed to create event: ${err.message}`);
        return;
      }
    }

    await loadEvent();
    setFormState('closed');
  };

  // ── Delete event ──
  const deleteEvent = async () => {
    if (!event?.id) return;

    const { error: err } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id);

    if (err) {
      setError('Failed to delete event');
      return;
    }

    setEvent(null);
    setFormState('closed');
    setConfirmDelete(false);
  };

  // ── Submit race result ──
  const submitResult = async () => {
    if (!event?.id || !resultMinutes) return;
    setSubmittingResult(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const actual = parseInt(resultMinutes, 10);
      if (isNaN(actual) || actual <= 0) {
        setError('Invalid time');
        setSubmittingResult(false);
        return;
      }

      // Calculate fuzzy bonus
      const bonus = event.target_time_minutes
        ? calculateFuzzyBonus(event.target_time_minutes, actual)
        : { xp: 100, message: 'fuzzy_warm', tier: 'warm' as const };

      // Update event with result
      const { error: updateErr } = await supabase
        .from('events')
        .update({
          result_time_minutes: actual,
          status: 'completed',
        })
        .eq('id', event.id);

      if (updateErr) throw updateErr;

      // Award XP
      await supabase.from('xp_log').insert({
        user_id: user.id,
        amount: bonus.xp,
        reason: 'fuzzy_bonus',
        activity_date: event.event_date,
        metadata: {
          event_name: event.name,
          target: event.target_time_minutes,
          actual,
          tier: bonus.tier,
        },
      });

      // Update total XP in streak_state
      const { data: streakData } = await supabase
        .from('streak_state')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();

      if (streakData) {
        await supabase
          .from('streak_state')
          .update({ total_xp: (streakData.total_xp || 0) + bonus.xp })
          .eq('user_id', user.id);
      }

      setPostRace(bonus);
    } catch (err) {
      console.error('[event] submitResult failed:', err);
      reportError(err instanceof Error ? err : new Error(String(err)), { action: 'submitResult' });
      setError('Something went wrong');
    } finally {
      setSubmittingResult(false);
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

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', paddingBottom: 40 }}>
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

      {/* ── TWO-COLUMN LAYOUT: event + rainbow road ── */}
      {event && formState === 'closed' && (
        <div style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>

        {/* ── EVENT DISPLAY ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P})`,
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
            border: `1px solid rgba(108, 52, 131, 0.3)`,
            position: 'relative',
            overflow: 'hidden',
            flex: '1 1 340px',
            minWidth: 280,
          }}
        >
          {/* Subtle sparkle dots */}
          {[
            { x: 90, y: 10, d: 0 }, { x: 95, y: 45, d: 1.2 },
            { x: 88, y: 80, d: 2.4 },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: PL,
              animation: `event-sparkle 3s ease-in-out ${s.d}s infinite`,
              pointerEvents: 'none',
            }} />
          ))}
          <div style={{ fontSize: 20, fontWeight: 900, color: W, marginBottom: 8, textShadow: `0 0 16px ${PL}33` }}>
            {event.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 16,
            }}
          >
            {formatEventDate(event.event_date, locale)}
          </div>

          {/* Countdown */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              padding: '16px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 36, fontWeight: 900, color: W, textShadow: `0 0 20px ${PL}55` }}>
                {daysUntil(event.event_date)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                {t('days_to_go')}
              </div>
            </div>
            {event.target_time_minutes && (
              <div>
                <div style={{ fontSize: 30, fontWeight: 900, color: SK, textShadow: `0 0 12px ${SK}33` }}>
                  {event.target_time_minutes}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  {t('minutes')}
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            Sport: <span style={{ fontWeight: 600 }}>{event.sport_type}</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button
              onClick={() => {
                setFormState('editing');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.15)',
                color: W,
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <IconEdit size={16} /> {t('add_event')}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(255,0,0,0.15)',
                color: '#FF6B6B',
                border: '1px solid rgba(255,0,0,0.2)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <IconDelete size={16} /> {t('delete')}
            </button>
          </div>
        </div>

        {/* ── RAINBOW ROAD — samen onderweg ── */}
        <div style={{ flex: '1 1 340px', minWidth: 280 }}>
          <RainbowRoad
            eventName={event.name}
            daysToGo={daysUntil(event.event_date)}
            friends={[
              // TODO: replace with Supabase event_friends data when social feature ships
              { name: 'Arnoud', xp: 0.40 },
              { name: 'Sharon', xp: 0.20 },
            ]}
            strings={{
              header: t('road_header'),
              daysToGo: t('road_days_to_go'),
              count: t('road_count'),
              invite: t('road_invite'),
            }}
            onInvite={() => {
              // TODO: open invite modal → email input → magic link → auto-join event
            }}
          />
        </div>

        </div>
      )}

      {/* ── POST-RACE CELEBRATION ── */}
      {postRace && event && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P})`,
            borderRadius: 16,
            padding: '32px 24px',
            marginBottom: 24,
            border: `1px solid ${PL}44`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Confetti particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: -10,
              width: 6, height: 6,
              borderRadius: i % 3 === 0 ? '50%' : 1,
              background: RB[i % RB.length],
              animation: `result-confetti ${2 + Math.random() * 3}s ease-out ${Math.random() * 1.5}s forwards`,
              opacity: 0,
              pointerEvents: 'none',
            }} />
          ))}

          <div style={{ fontSize: 56, marginBottom: 12 }}>
            {postRace.tier === 'gold' ? '🏆' :
             postRace.tier === 'silver' ? '🥈' :
             postRace.tier === 'bronze' ? '🥉' : '🐢'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: W, marginBottom: 8 }}>
            {t(`result_${postRace.tier}_title`)}
          </div>
          <div style={{ fontSize: 15, color: PL, marginBottom: 20, lineHeight: 1.5 }}>
            {t(`result_${postRace.tier}_body`)}
          </div>

          {/* Result vs target */}
          {event.target_time_minutes && (
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 32,
              marginBottom: 20,
              padding: '16px 0',
              borderTop: `1px solid ${PL}22`,
              borderBottom: `1px solid ${PL}22`,
            }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: SK }}>
                  {resultMinutes}
                </div>
                <div style={{ fontSize: 11, color: `${W}88` }}>{t('your_time')}</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: `${W}66` }}>
                  {event.target_time_minutes}
                </div>
                <div style={{ fontSize: 11, color: `${W}88` }}>{t('target')}</div>
              </div>
            </div>
          )}

          {/* XP earned */}
          <div style={{
            display: 'inline-block',
            background: `${SK}22`,
            border: `1px solid ${SK}44`,
            borderRadius: 20,
            padding: '8px 20px',
            fontSize: 16,
            fontWeight: 700,
            color: SK,
          }}>
            +{postRace.xp} XP
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => {
                setPostRace(null);
                loadEvent();
              }}
              style={{
                padding: '12px 32px',
                fontSize: 14,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${P}, ${PL})`,
                color: W,
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              {t('result_continue')}
            </button>
          </div>
        </div>
      )}

      {/* ── POST-RACE INPUT (event passed, no result yet) ── */}
      {event && !postRace && formState === 'closed' && daysUntil(event.event_date) === 0 && !event.result_time_minutes && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, #2D1B4E)`,
            borderRadius: 16,
            padding: '24px',
            marginBottom: 24,
            border: `1px solid ${PL}33`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏁</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: W, marginBottom: 6 }}>
            {t('result_title')}
          </div>
          <div style={{ fontSize: 13, color: PL, marginBottom: 20 }}>
            {t('result_subtitle', { name: event.name })}
          </div>

          {error && (
            <div style={{ marginBottom: 12, fontSize: 13, color: '#FF6B6B' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 12, maxWidth: 320, margin: '0 auto' }}>
            <input
              type="number"
              placeholder={t('result_placeholder')}
              value={resultMinutes}
              onChange={(e) => setResultMinutes(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: 16,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${PL}44`,
                borderRadius: 10,
                color: W,
                fontFamily: 'Inter, sans-serif',
                textAlign: 'center',
              }}
            />
            <button
              onClick={submitResult}
              disabled={submittingResult || !resultMinutes}
              style={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 700,
                background: submittingResult
                  ? `${P}88`
                  : `linear-gradient(135deg, ${P}, ${PL})`,
                color: W,
                border: 'none',
                borderRadius: 10,
                cursor: submittingResult ? 'default' : 'pointer',
              }}
            >
              {submittingResult ? '...' : t('result_submit')}
            </button>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirmDelete && (
        <div
          style={{
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.2)',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: W, marginBottom: 12 }}>
            {t('confirm_delete')}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: 13,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                color: W,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={deleteEvent}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: 13,
                fontWeight: 600,
                background: '#FF6B6B',
                color: W,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ── NO EVENT / FORM ── */}
      {(!event || formState === 'editing') && formState !== 'closed' && (
        <form
          onSubmit={saveEvent}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
            padding: '20px',
            marginBottom: 24,
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: '12px',
                background: 'rgba(255,0,0,0.1)',
                border: '1px solid rgba(255,0,0,0.2)',
                borderRadius: 8,
                fontSize: 13,
                color: '#FF6B6B',
              }}
            >
              {error}
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: PL,
                marginBottom: 6,
              }}
            >
              {t('event_name')}
            </label>
            <input
              type="text"
              placeholder={t('event_name_placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: W,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: PL,
                marginBottom: 6,
              }}
            >
              {t('event_date')}
            </label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: W,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Target time */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: PL,
                marginBottom: 6,
              }}
            >
              {t('target_time')}
            </label>
            <input
              type="number"
              placeholder={t('target_time_placeholder')}
              value={formData.target_time_minutes}
              onChange={(e) =>
                setFormData({ ...formData, target_time_minutes: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: W,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Sport type */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: PL,
                marginBottom: 6,
              }}
            >
              {t('sport_type')}
            </label>
            <select
              value={formData.sport_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sport_type: e.target.value as 'hyrox' | 'running' | 'triathlon' | 'cycling' | 'other',
                })
              }
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: W,
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
            >
              <option value="hyrox">Hyrox</option>
              <option value="running">Running</option>
              <option value="triathlon">Triathlon</option>
              <option value="cycling">Cycling</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => {
                setFormState('closed');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                color: W,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                fontSize: 14,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${P}, ${PL})`,
                color: W,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {t('save')}
            </button>
          </div>
        </form>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes rainbow-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes event-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        @keyframes result-confetti {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(400px) rotate(720deg); }
        }
      `}</style>

      {/* ── EMPTY STATE ── */}
      {!event && formState === 'closed' && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(108, 52, 131, 0.12)`,
            borderRadius: 14,
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 12 }}><IconFinish size={36} /></div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: W,
              marginBottom: 8,
            }}
          >
            {t('no_event')}
          </div>
          <button
            onClick={() => {
              setFormState('adding');
              setFormData({ name: '', event_date: '', target_time_minutes: '', sport_type: 'other' });
              setError(null);
            }}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${P}, ${PL})`,
              color: W,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <IconSparkle size={16} /> {t('add_event')}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──
function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatEventDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
