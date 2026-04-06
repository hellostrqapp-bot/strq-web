'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';
import { IconEdit, IconDelete, IconFinish, IconSparkle } from '@/components/icons';

// ═══════════════════════════════════════════════════════════
// strQ — Event Page
// Add, edit, view, and delete upcoming events with countdown
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
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
      status: 'upcoming',
      created_at: event?.id ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (event?.id) {
      // Update
      const { error: err } = await supabase
        .from('events')
        .update(eventPayload)
        .eq('id', event.id);

      if (err) {
        setError('Failed to update event');
        return;
      }
    } else {
      // Insert
      const { error: err } = await supabase.from('events').insert([eventPayload]);

      if (err) {
        setError('Failed to create event');
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
    <div style={{ maxWidth: 420, margin: '0 auto', paddingBottom: 40 }}>
      {/* Rainbow bar */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 24,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {RB.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: c }} />
        ))}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: W,
          marginBottom: 24,
          letterSpacing: '-0.02em',
        }}
      >
        {t('title')}
      </div>

      {/* ── EVENT DISPLAY ── */}
      {event && formState === 'closed' && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P})`,
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: W, marginBottom: 8 }}>
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
              <div style={{ fontSize: 32, fontWeight: 900, color: W }}>
                {daysUntil(event.event_date)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                {t('days_to_go')}
              </div>
            </div>
            {event.target_time_minutes && (
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: SK }}>
                  {event.target_time_minutes}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
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
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
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

      {/* ── EMPTY STATE ── */}
      {!event && formState === 'closed' && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
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
