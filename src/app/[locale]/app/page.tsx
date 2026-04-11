'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase-browser';
import {
  calculateStreak,
  getBaseXP,
  getStreakBonus,
  rollSurprise,
  type StreakResult,
} from '@/lib/streak-engine';
import {
  IconMultiplier,
  IconGift,
  IconSparkle,
  IconTraining,
  IconRest,
  IconCheck,
  IconEarnedRest,
} from '@/components/icons';
import { getLevelInfo, type LevelInfo } from '@/lib/levels';
import { LevelBadge } from '@/components/level-badge';

// ═══════════════════════════════════════════════════════════
// strQ — Dashboard
// Het streak-getal is het grootste element op het scherm.
// Weinig tekst. Veel gevoel.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const PM = '#7D3C98';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const SD = '#4F9962';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

// ── Q Mini — lives inside the train button ──
function QMiniButton({ pose = 'ready', size = 36, excited = false }: { pose?: 'ready' | 'running'; size?: number; excited?: boolean }) {
  if (pose === 'running') {
    // Running Q: leaning forward, neck stretched, speedlines, dynamic legs
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ display: 'block' }}>
        {/* Speedlines */}
        <line x1="4" y1="24" x2="14" y2="24" stroke={PL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.4s" repeatCount="indefinite" />
        </line>
        <line x1="2" y1="32" x2="16" y2="32" stroke={PL} strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.15;0.6;0.15" dur="0.35s" repeatCount="indefinite" />
        </line>
        <line x1="6" y1="40" x2="15" y2="40" stroke={PL} strokeWidth="1.5" strokeLinecap="round" opacity="0.35">
          <animate attributeName="opacity" values="0.1;0.45;0.1" dur="0.45s" repeatCount="indefinite" />
        </line>
        {/* Legs — dynamic stride */}
        <path d="M27 44 L20 50 L16 48" stroke={SK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="15" cy="49" rx="2.5" ry="1.3" fill={SD} />
        <path d="M35 44 L42 50 L48 51" stroke={SK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="49" cy="52" rx="2.5" ry="1.3" fill={SD} />
        {/* Shell — leaning forward */}
        <g transform="rotate(-12 32 34)">
          <ellipse cx="32" cy="34" rx="13" ry="11" fill={P} />
          {RB.map((c, i) => (
            <path key={i} d={`M${20 + i * 0.5} ${35 + i * 0.6} Q32 ${28 + i * 0.6} ${44 - i * 0.5} ${35 + i * 0.6}`}
              stroke={c} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.7" />
          ))}
        </g>
        {/* Belly */}
        <ellipse cx="32" cy="38" rx="6" ry="5.5" fill={SL} transform="rotate(-12 32 38)" />
        {/* Arms — one forward pumping, one back */}
        <path d="M21 32 C18 36, 18 42, 20 46" stroke={SK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="20" cy="47" rx="2" ry="1.5" fill={SD} />
        <path d="M42 30 C48 26, 52 24, 54 26" stroke={SK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="55" cy="27" rx="2" ry="1.5" fill={SD} />
        {/* Neck — stretched forward! */}
        <path d="M30 24 C32 20, 35 16, 37 13" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        {/* Head — tilted forward */}
        <ellipse cx="38" cy="10" rx="7.5" ry="6.5" fill={SK} transform="rotate(-10 38 10)" />
        {/* Glasses */}
        <rect x="31" y="7.5" width="5.5" height="4" rx="1.3" stroke={W} strokeWidth="0.7" fill="rgba(255,255,255,0.08)" transform="rotate(-10 33.5 9.5)" />
        <rect x="39" y="7" width="5.5" height="4" rx="1.3" stroke={W} strokeWidth="0.7" fill="rgba(255,255,255,0.08)" transform="rotate(-10 41.5 9)" />
        <path d="M36.5 9 C37 8.3, 38.5 8.2, 39 9" stroke={W} strokeWidth="0.5" fill="none" />
        {/* Eyes — determined */}
        <ellipse cx="34" cy="9.5" rx="1.2" ry="1.4" fill={W} />
        <ellipse cx="41.5" cy="9" rx="1.2" ry="1.4" fill={W} />
        <ellipse cx="34.5" cy="9.3" rx="0.7" ry="0.9" fill={PD} />
        <ellipse cx="42" cy="8.8" rx="0.7" ry="0.9" fill={PD} />
        {/* Grin */}
        <path d="M35 14 C37 16, 41 16, 43 14" stroke={PD} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        {/* Sweat drop */}
        <path d="M44 5 C44.5 3, 44 2, 43.5 4" fill="#88C9DD" opacity="0.6" />
      </svg>
    );
  }

  // Default: ready Q — waving arm, gets hyper when excited (hover)
  const waveDur = excited ? '0.35s' : '1.2s';
  const headDur = excited ? '0.35s' : '1.2s';

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ display: 'block' }}>
      {/* Shell */}
      <ellipse cx="30" cy="33" rx="14" ry="12" fill={P} />
      {RB.map((c, i) => (
        <path key={i} d={`M${17 + i * 0.6} ${34 + i * 0.7} Q30 ${27 + i * 0.7} ${43 - i * 0.6} ${34 + i * 0.7}`}
          stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity={excited ? '0.9' : '0.7'} />
      ))}
      {/* Belly */}
      <ellipse cx="30" cy="37" rx="7" ry="6.5" fill={SL} />
      {/* Legs — bounce when excited */}
      <g>
        {excited && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.25s" repeatCount="indefinite" />
        )}
        <path d="M26 42 L24 48" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 42 L36 48" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="23" cy="49" rx="3" ry="1.5" fill={SD} />
        <ellipse cx="37" cy="49" rx="3" ry="1.5" fill={SD} />
      </g>
      {/* Left arm — animated wave (fast when excited!) */}
      <g>
        <path d="M17 33 C13 28, 10 20, 9 14" stroke={SK} strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d"
            values={excited
              ? "M17 33 C13 28, 10 20, 9 14;M17 33 C8 22, 2 16, 1 12;M17 33 C13 28, 10 20, 9 14"
              : "M17 33 C13 28, 10 20, 9 14;M17 33 C11 26, 6 20, 4 16;M17 33 C13 28, 10 20, 9 14"}
            dur={waveDur} repeatCount="indefinite" />
        </path>
        <ellipse cx="8.5" cy="13" rx="2.5" ry="2" fill={SD}>
          <animate attributeName="cx" values={excited ? "8.5;0.5;8.5" : "8.5;3.5;8.5"} dur={waveDur} repeatCount="indefinite" />
          <animate attributeName="cy" values={excited ? "13;11;13" : "13;15;13"} dur={waveDur} repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* Right arm — also waves when excited! */}
      {excited ? (
        <g>
          <path d="M43 33 C47 28, 50 20, 51 14" stroke={SK} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d"
              values="M43 33 C47 28, 50 20, 51 14;M43 33 C49 22, 54 16, 56 12;M43 33 C47 28, 50 20, 51 14"
              dur="0.4s" repeatCount="indefinite" />
          </path>
          <ellipse cx="51.5" cy="13" rx="2.5" ry="2" fill={SD}>
            <animate attributeName="cx" values="51.5;57;51.5" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values="13;11;13" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : (
        <>
          <path d="M43 34 C46 37, 46 42, 44 45" stroke={SK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="44" cy="46" rx="2" ry="1.5" fill={SD} />
        </>
      )}
      {/* Neck */}
      <path d="M30 24 L30 20" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
      {/* Head — subtle tilt, frantic when excited */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values={excited
            ? "0 30 15;5 30 15;-4 30 15;6 30 15;-3 30 15;0 30 15"
            : "0 30 15;3 30 15;0 30 15;-2 30 15;0 30 15"}
          dur={headDur} repeatCount="indefinite" />
        <ellipse cx="30" cy="15" rx="8" ry="7" fill={SK} />
        {/* Glasses */}
        <rect x="22.5" y="12" width="6" height="4.5" rx="1.5" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
        <rect x="31.5" y="12" width="6" height="4.5" rx="1.5" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
        <path d="M28.5 13.5 C29 12.8, 31 12.8, 31.5 13.5" stroke={W} strokeWidth="0.6" fill="none" />
        {/* Eyes — bigger when excited */}
        <ellipse cx="25.8" cy="13.8" rx={excited ? 1.6 : 1.3} ry={excited ? 1.8 : 1.5} fill={W} />
        <ellipse cx="34.2" cy="13.8" rx={excited ? 1.6 : 1.3} ry={excited ? 1.8 : 1.5} fill={W} />
        <ellipse cx="26.2" cy="13.5" rx={excited ? 1 : 0.8} ry={excited ? 1.2 : 1} fill={PD} />
        <ellipse cx="34.6" cy="13.5" rx={excited ? 1 : 0.8} ry={excited ? 1.2 : 1} fill={PD} />
        {/* Mouth — big open grin when excited, warm smile when calm */}
        {excited ? (
          <path d="M26 18.5 C28 22, 32 22, 34 18.5" stroke={PD} strokeWidth="0.8" fill={SD} strokeLinecap="round" />
        ) : (
          <path d="M27 19 C29 21, 31 21, 33 19" stroke={PD} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        )}
      </g>
      {/* Sparkles when excited */}
      {excited && (
        <>
          <circle cx="12" cy="8" r="1.5" fill={PL}>
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="6" r="1.2" fill="#F1C40F">
            <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="28" r="1" fill={SK}>
            <animate attributeName="opacity" values="0;0.8;0" dur="0.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

// ── Q Mascotte (small celebrating pose) ──
function QCelebrating({ size = 64 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
      {/* Legs */}
      <path d="M106 250 L102 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <path d="M134 250 L138 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="98" cy="280" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="142" cy="280" rx="11" ry="5.5" fill={SD} />
      {/* Shell */}
      <g>
        <ellipse cx={120} cy={204} rx={52} ry={44} fill={P} />
        <ellipse cx={120} cy={194} rx={25} ry={21} stroke={PM} strokeWidth="1.8" fill="none" opacity="0.45" />
        <ellipse cx={112} cy={190} rx={12} ry={8} fill={PL} opacity="0.12" />
        {RB.map((c, i) => (
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
        ))}
      </g>
      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      {/* Arms raised celebrating */}
      <path d="M72 204 C56 188, 48 170, 56 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C184 188, 192 170, 184 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Hands */}
      <ellipse cx="54" cy="152" rx="9" ry="7" fill={SD} />
      <ellipse cx="186" cy="152" rx="9" ry="7" fill={SD} />
      {/* Neck + Head */}
      <path d="M120 168 L120 154" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="120" cy="140" rx="28" ry="24" fill={SK} />
      <circle cx="98" cy="146" r="4.5" fill={SL} opacity="0.35" />
      {/* Glasses */}
      <g>
        <rect x={98} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={122} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M118 134 C119 132, 121 132, 122 134" stroke={W} strokeWidth="2" fill="none" />
        <line x1="98" y1="134" x2="92" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="142" y1="134" x2="148" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Eyes */}
      <ellipse cx="109" cy="131" rx="4" ry="5" fill={W} />
      <ellipse cx="131" cy="132" rx="4" ry="5" fill={W} />
      <ellipse cx="110" cy="129.5" rx="2.5" ry="3.2" fill={PD} />
      <ellipse cx="132" cy="130.5" rx="2.5" ry="3.2" fill={PD} />
      <circle cx="111.5" cy="128" r="1.3" fill={W} />
      <circle cx="133.5" cy="129" r="1.3" fill={W} />
      {/* Big smile */}
      <path d="M106 150 C114 162, 128 162, 136 150" stroke={PD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Sparkles */}
      <g opacity="0.55">
        <line x1="48" y1="142" x2="48" y2="130" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="136" x2="54" y2="136" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="196" cy="140" r="2.5" fill={PL} />
        <line x1="192" y1="162" x2="192" y2="154" stroke={PL} strokeWidth="2" strokeLinecap="round" />
        <line x1="188" y1="158" x2="196" y2="158" stroke={PL} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ── Q Mascotte (resting pose — eyes closed, peaceful) ──
function QResting({ size = 64 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
      {/* Legs — relaxed */}
      <path d="M106 250 L100 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <path d="M134 250 L140 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="96" cy="280" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="144" cy="280" rx="11" ry="5.5" fill={SD} />
      {/* Shell — rainbow stripes glow stronger during rest */}
      <g>
        <ellipse cx={120} cy={204} rx={52} ry={44} fill={P} />
        <ellipse cx={120} cy={194} rx={25} ry={21} stroke={PM} strokeWidth="1.8" fill="none" opacity="0.45" />
        <ellipse cx={112} cy={190} rx={12} ry={8} fill={PL} opacity="0.12" />
        {RB.map((c, i) => (
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
      </g>
      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      {/* Arms resting at sides — peaceful */}
      <path d="M72 204 C60 218, 58 240, 66 254" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C180 218, 182 240, 174 254" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Hands resting */}
      <ellipse cx="66" cy="258" rx="8" ry="6" fill={SD} />
      <ellipse cx="174" cy="258" rx="8" ry="6" fill={SD} />
      {/* Neck + Head — slightly tilted */}
      <path d="M120 168 L118 154" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="118" cy="140" rx="28" ry="24" fill={SK} />
      <circle cx="96" cy="146" r="4.5" fill={SL} opacity="0.35" />
      {/* Glasses — slightly tilted with head */}
      <g transform="rotate(-3 118 134)">
        <rect x={96} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={120} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M116 134 C117 132, 119 132, 120 134" stroke={W} strokeWidth="2" fill="none" />
        <line x1="96" y1="134" x2="90" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="140" y1="134" x2="146" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Eyes — closed, peaceful curved lines */}
      <path d="M103 132 C106 128, 112 128, 115 132" stroke={PD} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M123 133 C126 129, 132 129, 135 133" stroke={PD} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Peaceful smile — gentle */}
      <path d="M108 150 C114 158, 124 158, 130 150" stroke={PD} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blush — warm glow on cheeks */}
      <circle cx="100" cy="145" r="5" fill="#E74C3C" opacity="0.12" />
      <circle cx="136" cy="146" r="5" fill="#E74C3C" opacity="0.12" />
      {/* Z's floating up — rest is happening */}
      <text x="150" y="120" fill={PL} fontSize="18" fontWeight="800" fontFamily="sans-serif" opacity="0.6">z</text>
      <text x="162" y="105" fill={PL} fontSize="14" fontWeight="800" fontFamily="sans-serif" opacity="0.45">z</text>
      <text x="170" y="92" fill={PL} fontSize="10" fontWeight="800" fontFamily="sans-serif" opacity="0.3">z</text>
    </svg>
  );
}

type DashState = 'loading' | 'reveal' | 'idle' | 'logging';

export default function DashboardPage() {
  const t = useTranslations('app');
  const locale = useLocale();
  const [state, setState] = useState<DashState>('loading');
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [todayType, setTodayType] = useState<'training' | 'rest' | null>(null);
  const [qSpinning, setQSpinning] = useState(false);
  const [qHover, setQHover] = useState(false);
  const [reveal, setReveal] = useState<{
    baseXp: number;
    bonusXp: number;
    surprise: string | null;
  } | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [event, setEvent] = useState<{
    name: string;
    event_date: string;
    target_time_minutes: number | null;
  } | null>(null);

  const supabase = createBrowserClient();

  // ── Load user data ──
  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch activities (last 60 days is enough for streak calc)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [activitiesRes, streakStateRes, revealRes, eventRes] =
      await Promise.all([
        supabase
          .from('activities')
          .select('activity_date, activity_type')
          .eq('user_id', user.id)
          .gte('activity_date', sixtyDaysAgo.toISOString().split('T')[0])
          .order('activity_date', { ascending: false }),
        supabase
          .from('streak_state')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('daily_reveals')
          .select('*')
          .eq('user_id', user.id)
          .eq('reveal_date', today())
          .single(),
        supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'upcoming')
          .order('event_date', { ascending: true })
          .limit(1)
          .single(),
      ]);

    const activities = activitiesRes.data || [];
    const streakResult = calculateStreak(activities);
    setStreak(streakResult);
    setTotalXp(streakStateRes.data?.total_xp || 0);
    setEvent(eventRes.data || null);

    // Check if today is already logged
    const todayEntry = activities.find(
      (a) => a.activity_date === today()
    );
    setTodayLogged(!!todayEntry);
    setTodayType(todayEntry ? (todayEntry.activity_type as 'training' | 'rest') : null);

    // Check Daily Reveal
    if (revealRes.data && !revealRes.data.revealed && todayEntry) {
      // Activity logged but not yet revealed — show reveal!
      setState('reveal');
      setReveal({
        baseXp: revealRes.data.base_xp,
        bonusXp: revealRes.data.bonus_xp,
        surprise: revealRes.data.surprise_type,
      });
    } else {
      setState('idle');
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Log activity ──
  const logActivity = async (type: 'training' | 'rest') => {
    setState('logging');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Insert activity
    const { error } = await supabase.from('activities').upsert(
      {
        user_id: user.id,
        activity_date: today(),
        activity_type: type,
        source: 'manual',
      },
      { onConflict: 'user_id,activity_date' }
    );

    if (error) {
      setState('idle');
      return;
    }

    // Calculate new streak + XP
    const { data: activities } = await supabase
      .from('activities')
      .select('activity_date, activity_type')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(60);

    const newStreak = calculateStreak(activities || []);
    const baseXp = getBaseXP(type, type === 'rest' ? streak?.earnedRest : undefined);
    const streakBonus = getStreakBonus(newStreak);
    const surprise = rollSurprise();
    const totalEarned = baseXp + streakBonus + (surprise?.xp || 0);

    // Create daily reveal
    await supabase.from('daily_reveals').upsert(
      {
        user_id: user.id,
        reveal_date: today(),
        revealed: false,
        base_xp: baseXp,
        bonus_xp: streakBonus + (surprise?.xp || 0),
        surprise_type: surprise?.type || null,
        surprise_data: surprise ? { xp: surprise.xp } : null,
      },
      { onConflict: 'user_id,reveal_date' }
    );

    // Update streak state
    await supabase.from('streak_state').upsert(
      {
        user_id: user.id,
        current_streak: newStreak.currentStreak,
        longest_streak: Math.max(
          newStreak.currentStreak,
          newStreak.longestStreak
        ),
        last_activity_date: today(),
        streak_multiplier: newStreak.multiplier,
        total_xp: totalXp + totalEarned,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    // Log XP entries
    const xpEntries = [
      { user_id: user.id, amount: baseXp, reason: 'activity', activity_date: today() },
    ];
    if (streakBonus > 0) {
      xpEntries.push({
        user_id: user.id,
        amount: streakBonus,
        reason: newStreak.multiplier >= 2 ? 'multiplier' : 'streak_bonus',
        activity_date: today(),
      });
    }
    if (surprise) {
      xpEntries.push({
        user_id: user.id,
        amount: surprise.xp,
        reason: 'surprise',
        activity_date: today(),
      });
    }
    await supabase.from('xp_log').insert(xpEntries);

    // Show reveal
    setStreak(newStreak);
    setTodayLogged(true);
    setTodayType(type);
    setTotalXp((prev) => prev + totalEarned);
    setReveal({
      baseXp,
      bonusXp: streakBonus + (surprise?.xp || 0),
      surprise: surprise?.type || null,
    });
    setState('reveal');
  };

  // ── Reveal animation ──
  const doReveal = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Mark as revealed
    await supabase
      .from('daily_reveals')
      .update({ revealed: true, revealed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('reveal_date', today());

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setState('idle');
    }, 3000);
  };

  // ── Render ──
  if (state === 'loading') {
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
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* Confetti overlay */}
      {showConfetti && <ConfettiOverlay />}

      {/* Rainbow bar — with subtle traveling shimmer */}
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

      {/* XP counter removed — now shown in LevelBadge below streak */}

      {/* ── STREAK COUNTER ── (het grootste element) */}
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
        {/* Ambient glow behind the number */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${P}44 0%, ${PD}22 40%, transparent 70%)`,
          animation: 'streak-ambient 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            textShadow: `0 0 40px ${PL}66, 0 0 80px ${P}55, 0 0 120px ${P}33`,
            animation: 'streak-glow 3s ease-in-out infinite',
            position: 'relative',
          }}
        >
          {streak?.currentStreak || 0}
        </div>
        <div
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 700,
            marginTop: 6,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            position: 'relative',
          }}
        >
          {t('streak_label')}
        </div>
        {streak && streak.multiplier >= 2 && (
          <div
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '4px 12px',
              background: `${SK}22`,
              border: `1px solid ${SK}44`,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              color: SK,
            }}
          >
            <IconMultiplier /> {streak.multiplier}x {t('multiplier')}
          </div>
        )}
      </div>

      {/* ── LEVEL BADGE ── */}
      <LevelBadge levelInfo={getLevelInfo(totalXp)} totalXp={totalXp} />

      {/* ── EVENT COUNTDOWN ── */}
      {event && (() => {
        const days = daysUntil(event.event_date);
        const urgency = days <= 7 ? 1 : days <= 14 ? 0.7 : days <= 21 ? 0.45 : 0.25;
        return (
        <div
          style={{
            background: `linear-gradient(135deg, rgba(108,52,131,${0.08 + urgency * 0.1}), rgba(74,35,90,${0.04 + urgency * 0.06}))`,
            border: `1px solid ${PL}${Math.round(20 + urgency * 30).toString(16)}`,
            borderRadius: 14,
            padding: '18px 20px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle urgency pulse on the right side */}
          <div style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PL}${Math.round(urgency * 20).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            animation: 'countdown-pulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 14, color: PL, fontWeight: 800, letterSpacing: '0.02em' }}>
              {event.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {formatEventDate(event.event_date, locale)}
            </div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{
              fontSize: 40,
              fontWeight: 900,
              color: W,
              lineHeight: 1,
              textShadow: `0 0 20px ${PL}55, 0 0 40px ${P}33`,
              letterSpacing: '-0.02em',
            }}>
              {days}
            </div>
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              {t('days_to_go')}
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── DAILY REVEAL ── */}
      {state === 'reveal' && reveal && (
        <div
          style={{
            background: `linear-gradient(135deg, ${PD}, ${P}ee, ${PM})`,
            borderRadius: 20,
            padding: '36px 24px 32px',
            marginBottom: 24,
            textAlign: 'center',
            cursor: 'pointer',
            animation: 'reveal-breathe 2.5s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${PL}33`,
            boxShadow: `0 0 40px ${P}44, 0 0 80px ${PD}33, inset 0 1px 0 ${PL}22`,
          }}
          onClick={doReveal}
        >
          {/* Ambient light rings */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200, height: 200,
            borderRadius: '50%',
            border: `1px solid ${PL}15`,
            animation: 'reveal-ring 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 280, height: 280,
            borderRadius: '50%',
            border: `1px solid ${PL}0a`,
            animation: 'reveal-ring 3s ease-in-out 0.5s infinite',
            pointerEvents: 'none',
          }} />

          {/* Floating sparkle particles */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {[
              { x: 10, y: 20, d: 0, c: PL }, { x: 85, y: 15, d: 0.5, c: SK },
              { x: 15, y: 70, d: 1.0, c: W }, { x: 90, y: 65, d: 1.5, c: PL },
              { x: 50, y: 10, d: 2.0, c: SK }, { x: 5, y: 45, d: 2.5, c: PL },
              { x: 95, y: 40, d: 3.0, c: W }, { x: 40, y: 85, d: 3.5, c: SK },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                width: 3, height: 3,
                borderRadius: '50%',
                background: s.c,
                animation: `reveal-sparkle 4s ease-in-out ${s.d}s infinite`,
              }} />
            ))}
          </div>

          {/* Gift icon with glow */}
          <div style={{
            position: 'relative',
            marginBottom: 16,
            display: 'inline-block',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56, height: 56,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${PL}33 0%, transparent 70%)`,
              animation: 'reveal-icon-glow 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <IconGift size={36} />
          </div>

          {/* XP amount — the hero */}
          <div style={{
            fontSize: 44,
            fontWeight: 900,
            color: W,
            lineHeight: 1,
            textShadow: `0 0 24px ${PL}88, 0 0 48px ${P}55`,
            letterSpacing: '-0.02em',
            position: 'relative',
            animation: 'reveal-xp-glow 2.5s ease-in-out infinite',
          }}>
            +{reveal.baseXp + reveal.bonusXp} XP
          </div>

          {/* Surprise label */}
          {reveal.surprise && (
            <div
              style={{
                marginTop: 12,
                fontSize: 14,
                color: SL,
                fontWeight: 700,
                position: 'relative',
                textShadow: `0 0 12px ${SK}44`,
              }}
            >
              <IconSparkle size={16} /> {t(`surprise_${reveal.surprise}`)}
            </div>
          )}

          {/* Call to action — the pull */}
          <div
            style={{
              marginTop: 20,
              fontSize: 13,
              color: `${PL}cc`,
              fontWeight: 600,
              letterSpacing: '0.04em',
              position: 'relative',
              animation: 'reveal-cta-pulse 2s ease-in-out infinite',
            }}
          >
            {t('tap_to_reveal')}
          </div>

          <style>{`
            @keyframes reveal-breathe {
              0%, 100% { transform: scale(1); box-shadow: 0 0 40px ${P}44, 0 0 80px ${PD}33, inset 0 1px 0 ${PL}22; }
              50% { transform: scale(1.015); box-shadow: 0 0 50px ${P}55, 0 0 100px ${PD}44, inset 0 1px 0 ${PL}33; }
            }
            @keyframes reveal-ring {
              0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.95); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            }
            @keyframes reveal-sparkle {
              0%, 100% { opacity: 0; transform: scale(0.3) translateY(0); }
              30% { opacity: 0.8; transform: scale(1.1) translateY(-4px); }
              60% { opacity: 0.5; transform: scale(0.9) translateY(-2px); }
            }
            @keyframes reveal-icon-glow {
              0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
            }
            @keyframes reveal-xp-glow {
              0%, 100% { text-shadow: 0 0 24px ${PL}88, 0 0 48px ${P}55; }
              50% { text-shadow: 0 0 32px ${PL}aa, 0 0 64px ${P}66, 0 0 80px ${PL}33; }
            }
            @keyframes reveal-cta-pulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      {!todayLogged && state === 'idle' && (() => {
        const er = streak?.earnedRest;
        const restAvailable = er?.available ?? false;
        const restTier = er?.tier ?? 'locked';
        const restProgress = er?.progress ?? 0;
        const restXp = er?.xpReward ?? 0;
        const daysCharged = er?.trainingDaysSinceRest ?? 0;

        return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Primary: I trained! — with Q bouncing inside */}
          <button
            onClick={() => {
              setQSpinning(true);
              setTimeout(() => setQSpinning(false), 700);
              logActivity('training');
            }}
            onMouseEnter={() => setQHover(true)}
            onMouseLeave={() => setQHover(false)}
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: 17,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${P}, ${PM}, ${PL})`,
              color: W,
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: qHover
                ? `0 6px 28px ${P}77, 0 0 50px ${P}33`
                : `0 4px 20px ${P}55, 0 0 40px ${P}22`,
              letterSpacing: '0.02em',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transform: qHover ? 'translateY(-1px)' : 'none',
            }}
            className="train-btn"
          >
            {/* Q is alive in the button — calm idle, excited on hover, runs on tap */}
            <span style={{
              display: 'inline-flex',
              animation: qSpinning
                ? 'q-btn-dash 0.6s ease-out'
                : qHover
                ? 'q-btn-excited 0.4s ease-in-out infinite'
                : 'q-btn-bounce 2s ease-in-out infinite',
              flexShrink: 0,
            }}>
              <QMiniButton pose={qSpinning ? 'running' : 'ready'} size={38} excited={qHover} />
            </span>
            <span>{t('log_training')}</span>
          </button>

          {/* ── EARNED REST BUTTON ── */}
          {/* The star feature: rest charges up with each training day */}
          <button
            onClick={() => restAvailable && logActivity('rest')}
            disabled={!restAvailable}
            style={{
              width: '100%',
              padding: restAvailable ? '18px 20px' : '14px 20px',
              fontSize: restAvailable ? 15 : 14,
              fontWeight: restAvailable ? 800 : 600,
              background: restAvailable
                ? restTier === 'supercharged'
                  ? `linear-gradient(135deg, rgba(231,76,60,0.12), rgba(243,156,18,0.10), rgba(241,196,15,0.10), rgba(39,174,96,0.10), rgba(41,128,185,0.10), rgba(142,68,173,0.12))`
                  : restTier === 'charged'
                  ? `linear-gradient(135deg, rgba(165,105,189,0.12), rgba(123,200,140,0.10))`
                  : `linear-gradient(135deg, rgba(165,105,189,0.08), rgba(255,255,255,0.03))`
                : 'rgba(255,255,255,0.02)',
              color: restAvailable
                ? restTier === 'supercharged' ? W : PL
                : 'rgba(255,255,255,0.3)',
              border: restAvailable
                ? restTier === 'supercharged'
                  ? `1px solid rgba(241,196,15,0.3)`
                  : `1px solid ${PL}33`
                : `1px solid rgba(255,255,255,0.04)`,
              borderRadius: 14,
              cursor: restAvailable ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: restTier === 'supercharged'
                ? `0 0 24px rgba(241,196,15,0.15), 0 0 48px rgba(142,68,173,0.1)`
                : restTier === 'charged'
                ? `0 0 16px ${PL}22`
                : 'none',
              animation: restTier === 'supercharged' ? 'earned-rest-glow 3s ease-in-out infinite' : undefined,
            }}
            className={restAvailable ? 'earned-rest-btn' : 'rest-btn'}
          >
            {/* Fill-up liquid animation — shows charging progress visually */}
            {!restAvailable && restProgress > 0 && (
              <div style={{
                position: 'absolute',
                left: 0, right: 0, bottom: 0,
                height: `${Math.min(restProgress * 100, 100)}%`,
                background: `linear-gradient(0deg, rgba(165,105,189,0.12) 0%, rgba(165,105,189,0.04) 100%)`,
                borderRadius: 14,
                transition: 'height 1s ease-out',
                pointerEvents: 'none',
              }}>
                {/* Subtle wave at the fill top */}
                <div style={{
                  position: 'absolute',
                  top: -4,
                  left: 0, right: 0,
                  height: 8,
                  background: `radial-gradient(ellipse at 50% 100%, ${PL}15 0%, transparent 70%)`,
                  animation: 'rest-wave 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              </div>
            )}

            {/* Rainbow shimmer for supercharged */}
            {restTier === 'supercharged' && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                animation: 'rest-shimmer 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            )}

            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' }}>
              <IconEarnedRest size={22} progress={restProgress} tier={restTier} />
              <span>
                {restAvailable ? t('earned_rest') : t('rest_charging')}
              </span>
              {restAvailable && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: restTier === 'supercharged' ? '#F1C40F' : SK,
                  marginLeft: 4,
                  textShadow: restTier === 'supercharged' ? '0 0 8px rgba(241,196,15,0.5)' : undefined,
                }}>
                  +{restXp} XP
                </span>
              )}
              {!restAvailable && daysCharged > 0 && (
                <span style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.2)',
                  marginLeft: 4,
                }}>
                  {daysCharged}/2
                </span>
              )}
            </span>
          </button>

          {/* Q whisper when rest is available */}
          {restAvailable && (
            <div style={{
              textAlign: 'center',
              fontSize: 12,
              color: `${PL}99`,
              fontStyle: 'italic',
              marginTop: 4,
              animation: 'reveal-cta-pulse 3s ease-in-out infinite',
            }}>
              Q: &ldquo;{t('q_rest_nudge')}&rdquo;
            </div>
          )}
        </div>
        );
      })()}

      {/* ── ALREADY LOGGED ── */}
      {todayLogged && state === 'idle' && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 20px 28px',
            background: todayType === 'rest'
              ? `linear-gradient(135deg, rgba(231,76,60,0.04), rgba(243,156,18,0.04), rgba(241,196,15,0.05), rgba(39,174,96,0.04), rgba(41,128,185,0.04), rgba(142,68,173,0.05))`
              : `linear-gradient(135deg, ${SK}14, ${SK}08)`,
            border: todayType === 'rest'
              ? `1px solid rgba(241,196,15,0.15)`
              : `1px solid ${SK}33`,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Twinkling stars — rainbow for rest, green/purple for training */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {todayType === 'rest' ? (
              /* Rainbow twinkling stars for earned rest */
              [
                { x: 5, y: 10, d: 0, s: 10 }, { x: 90, y: 8, d: 0.4, s: 8 },
                { x: 15, y: 50, d: 0.8, s: 12 }, { x: 85, y: 45, d: 1.2, s: 10 },
                { x: 50, y: 5, d: 1.6, s: 8 }, { x: 8, y: 80, d: 2.0, s: 10 },
                { x: 92, y: 75, d: 2.4, s: 8 }, { x: 40, y: 90, d: 2.8, s: 12 },
                { x: 65, y: 85, d: 3.2, s: 10 }, { x: 25, y: 15, d: 3.6, s: 8 },
              ].map((s, i) => (
                <svg key={i} width={s.s} height={s.s} viewBox="0 0 24 24" fill="none" style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animation: `star-twinkle 3s ease-in-out ${s.d}s infinite`,
                }}>
                  <path d="M12 2L13.5 9.5L20 12L13.5 14.5L12 22L10.5 14.5L4 12L10.5 9.5L12 2Z" fill={RB[i % RB.length]} />
                </svg>
              ))
            ) : (
              [
                { x: 8, y: 14, d: 0, s: 4 }, { x: 88, y: 10, d: 0.6, s: 3 },
                { x: 50, y: 8, d: 1.2, s: 3 }, { x: 92, y: 60, d: 1.8, s: 4 },
                { x: 6, y: 75, d: 2.4, s: 3 }, { x: 72, y: 82, d: 3.0, s: 3 },
                { x: 30, y: 88, d: 3.6, s: 4 },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.s,
                  height: s.s,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? SK : PL,
                  animation: `card-sparkle 3s ease-in-out ${s.d}s infinite`,
                }} />
              ))
            )}
          </div>

          {/* Rainbow bar across the top for rest days */}
          {todayType === 'rest' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              display: 'flex',
              height: 3,
              overflow: 'hidden',
              borderRadius: '16px 16px 0 0',
            }}>
              {RB.map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, opacity: 0.6 }} />
              ))}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                animation: 'rest-shimmer 4s ease-in-out infinite',
              }} />
            </div>
          )}

          {/* Ambient glow behind Q */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: todayType === 'rest'
              ? `radial-gradient(circle, rgba(165,105,189,0.12) 0%, rgba(241,196,15,0.06) 50%, transparent 70%)`
              : `radial-gradient(circle, ${SK}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {todayType === 'rest' ? (
            <>
              {/* Moon + Q side by side */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 12,
                position: 'relative',
              }}>
                <div style={{ animation: 'rest-orb-spin 8s linear infinite' }}>
                  <IconEarnedRest size={56} progress={1} tier="supercharged" />
                </div>
                <div style={{ animation: 'q-sway 4s ease-in-out infinite' }}>
                  <QResting size={90} />
                </div>
              </div>

              {/* Q's whisper */}
              <div style={{
                fontSize: 13,
                color: `${PL}bb`,
                fontStyle: 'italic',
                marginBottom: 10,
                position: 'relative',
              }}>
                Q: &ldquo;{t('q_rest_quote')}&rdquo;
              </div>

              <div style={{
                fontSize: 17,
                fontWeight: 800,
                color: PL,
                textShadow: `0 0 16px ${PL}44, 0 0 32px ${P}22`,
                position: 'relative',
              }}>
                {t('rest_celebrate')}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 12, position: 'relative' }}><QCelebrating size={110} /></div>
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: SK,
                textShadow: `0 0 16px ${SK}44, 0 0 32px ${SK}22`,
                position: 'relative',
              }}>
                {t('already_logged')}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                marginTop: 6,
                position: 'relative',
              }}>
                {t('come_back_tomorrow')}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STREAK HISTORY (last 7 days) ── */}
      {streak && (
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {t('last_7_days')}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              justifyContent: 'space-between',
            }}
          >
            {streak.last7Days.map((day, i) => {
              const isActive = day.type === 'training';
              const isRest = day.type === 'rest';
              const isEmpty = !isActive && !isRest;

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {/* The day orb */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: isActive
                        ? day.isToday
                          ? `linear-gradient(135deg, ${PM}, ${PL})`
                          : `linear-gradient(135deg, ${P}, ${PL})`
                        : isRest
                        ? `conic-gradient(from 180deg, #E74C3C, #E67E22, #F1C40F, #27AE60, #2980B9, #8E44AD, #E74C3C)`
                        : 'rgba(255,255,255,0.03)',
                      border: day.isToday
                        ? `2px solid ${PL}`
                        : isActive
                        ? `2px solid ${PL}55`
                        : isRest
                        ? '2px solid rgba(255,255,255,0.15)'
                        : '2px solid rgba(255,255,255,0.06)',
                      boxShadow: day.isToday && isActive
                        ? `0 0 18px ${PL}77, 0 0 6px ${P}55, 0 0 30px ${P}33`
                        : isActive
                        ? `0 0 14px ${P}66, 0 0 4px ${PL}44`
                        : isRest
                        ? `0 0 14px rgba(241,196,15,0.3), 0 0 28px rgba(142,68,173,0.2), 0 0 6px rgba(39,174,96,0.25)`
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px',
                      position: 'relative',
                      overflow: 'visible',
                      animation: day.isToday && isActive
                        ? 'day-pulse 2s ease-in-out infinite'
                        : isRest
                        ? 'rest-orb-spin 8s linear infinite'
                        : undefined,
                    }}
                  >
                    {/* Today sparkle ring */}
                    {day.isToday && isActive && (
                      <>
                        {[0, 60, 120, 180, 240, 300].map((angle, si) => {
                          const rad = (angle * Math.PI) / 180;
                          const dist = 24;
                          const sx = Math.cos(rad) * dist;
                          const sy = Math.sin(rad) * dist;
                          return (
                            <div
                              key={si}
                              style={{
                                position: 'absolute',
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                background: W,
                                left: `calc(50% + ${sx}px - 1.5px)`,
                                top: `calc(50% + ${sy}px - 1.5px)`,
                                animation: `today-sparkle 2.5s ease-in-out ${si * 0.4}s infinite`,
                                pointerEvents: 'none',
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                    {isActive && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {/* Bold checkmark — "done, crushed it" */}
                        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                        <path
                          d="M7.5 12.5L10.5 15.5L16.5 9"
                          stroke={W}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {isRest && (
                      <>
                        {/* Sparkle ring around rest orbs */}
                        {[0, 72, 144, 216, 288].map((angle, si) => {
                          const rad = (angle * Math.PI) / 180;
                          const dist = 24;
                          const sx = Math.cos(rad) * dist;
                          const sy = Math.sin(rad) * dist;
                          return (
                            <div
                              key={si}
                              style={{
                                position: 'absolute',
                                width: 3.5,
                                height: 3.5,
                                borderRadius: '50%',
                                background: RB[si % RB.length],
                                left: `calc(50% + ${sx}px - 1.75px)`,
                                top: `calc(50% + ${sy}px - 1.75px)`,
                                animation: `today-sparkle 2.5s ease-in-out ${si * 0.5}s infinite`,
                                pointerEvents: 'none',
                              }}
                            />
                          );
                        })}
                        {/* Counter-spin so moon stays still while rainbow rotates */}
                        <div style={{ animation: 'rest-orb-counterspin 8s linear infinite' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 8a5.5 5.5 0 1 1-5.5 7.5A4.2 4.2 0 0 0 15 8Z" fill={W} opacity="0.95" />
                            <text x="16" y="8" fill={W} fontSize="6" fontWeight="800" fontFamily="sans-serif" opacity="0.8">z</text>
                          </svg>
                        </div>
                      </>
                    )}
                    {isEmpty && (
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                      }} />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: isActive
                        ? PL
                        : isRest
                        ? undefined
                        : 'rgba(255,255,255,0.2)',
                      fontWeight: isActive || isRest ? 800 : 600,
                      letterSpacing: isActive || isRest ? '0.04em' : undefined,
                      ...(isRest ? {
                        background: 'linear-gradient(90deg, #E74C3C, #E67E22, #F1C40F, #27AE60, #2980B9, #8E44AD)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      } : {}),
                    }}
                  >
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confetti component ──
function ConfettiOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            background: RB[i % RB.length],
            left: `${Math.random() * 100}%`,
            top: -10,
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
        @keyframes rainbow-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes streak-glow {
          0%, 100% { filter: brightness(1); text-shadow: 0 0 40px #A569BD66, 0 0 80px #6C348355, 0 0 120px #6C348333; }
          50% { filter: brightness(1.08); text-shadow: 0 0 50px #A569BD88, 0 0 100px #6C348366, 0 0 140px #6C348344; }
        }
        @keyframes streak-ambient {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -55%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -55%) scale(1.08); }
        }
        @keyframes countdown-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes card-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        @keyframes day-pulse {
          0%, 100% { box-shadow: 0 0 18px #A569BD77, 0 0 6px #6C348355, 0 0 30px #6C348333; }
          50% { box-shadow: 0 0 24px #A569BD99, 0 0 10px #6C348377, 0 0 40px #6C348344; }
        }
        @keyframes today-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          40% { opacity: 0.9; transform: scale(1.2); }
          60% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes q-btn-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes q-btn-excited {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          15% { transform: translateY(-5px) rotate(-6deg) scale(1.08); }
          30% { transform: translateY(0) rotate(4deg) scale(1); }
          45% { transform: translateY(-4px) rotate(-5deg) scale(1.06); }
          60% { transform: translateY(1px) rotate(3deg) scale(1); }
          75% { transform: translateY(-6px) rotate(-4deg) scale(1.1); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes q-btn-dash {
          0% { transform: translateX(0) scale(1); }
          40% { transform: translateX(4px) scale(1.05); }
          100% { transform: translateX(0) scale(1); }
        }
        .train-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px #6C348377, 0 0 50px #6C348333 !important;
        }
        .train-btn:active {
          transform: translateY(1px) scale(0.98);
        }
        .rest-btn:hover {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.6) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .earned-rest-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.15);
        }
        .earned-rest-btn:active {
          transform: translateY(1px) scale(0.98);
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          30% { opacity: 0.9; transform: scale(1.1) rotate(20deg); }
          50% { opacity: 0.7; transform: scale(0.9) rotate(-10deg); }
          70% { opacity: 0.5; transform: scale(1.0) rotate(15deg); }
        }
        @keyframes q-sway {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          25% { transform: rotate(1deg) translateY(-2px); }
          50% { transform: rotate(-1deg) translateY(0); }
          75% { transform: rotate(2deg) translateY(-1px); }
        }
        @keyframes rest-orb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rest-orb-counterspin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes earned-rest-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(241,196,15,0.15), 0 0 48px rgba(142,68,173,0.1); }
          50% { box-shadow: 0 0 32px rgba(241,196,15,0.25), 0 0 64px rgba(142,68,173,0.15), 0 0 80px rgba(39,174,96,0.08); }
        }
        @keyframes rest-shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes rest-wave {
          0%, 100% { transform: translateX(0) scaleY(1); opacity: 0.6; }
          50% { transform: translateX(8px) scaleY(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Helpers ──
function today(): string {
  return new Date().toISOString().split('T')[0];
}

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
  });
}
