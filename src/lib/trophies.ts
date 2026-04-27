// ═══════════════════════════════════════════════════════════
// strQ, Trophies helpers
// Pure utilities for the trophy gallery feature.
// Tier derivation, label keys, and Q quote mapping per tier.
// No I/O, no React. Safe to import from server and client.
// ═══════════════════════════════════════════════════════════

import { calculateFuzzyBonus } from '@/lib/streak-engine';

export type TrophyTier = 'gold' | 'silver' | 'bronze' | 'warm';

export type SportType =
  | 'hyrox'
  | 'running'
  | 'triathlon'
  | 'cycling'
  | 'other';

export interface TrophyEvent {
  id: string;
  user_id: string;
  name: string;
  sport_type: SportType | null;
  event_date: string;
  target_time_minutes: number | null;
  result_time_minutes: number | null;
  status: string;
  created_at: string;
  // Optional: present when the schema later adds these columns. Today
  // they are not stored on the events table, so callers should treat
  // them as undefined.
  fuzzy_bonus_xp?: number | null;
  satisfaction?: number | null;
}

/**
 * Computed XP bonus for a completed event. Mirrors the logic that
 * was applied at race time (calculateFuzzyBonus). Returns null when
 * target or result is missing so the detail page can hide the field.
 */
export function computedBonusXp(event: TrophyEvent): number | null {
  if (
    event.target_time_minutes == null ||
    event.result_time_minutes == null ||
    event.target_time_minutes <= 0
  ) {
    return null;
  }
  return calculateFuzzyBonus(
    event.target_time_minutes,
    event.result_time_minutes
  ).xp;
}

/**
 * Returns the trophy tier for a completed event.
 * Falls back to "warm" when target or result is missing, so the user
 * always gets a trophy for showing up, even without a target time.
 */
export function getTrophyTier(event: TrophyEvent): TrophyTier {
  if (
    event.target_time_minutes == null ||
    event.result_time_minutes == null ||
    event.target_time_minutes <= 0
  ) {
    return 'warm';
  }
  return calculateFuzzyBonus(
    event.target_time_minutes,
    event.result_time_minutes
  ).tier;
}

/** i18n key for the tier pill label (e.g. "trophies.tier_gold"). */
export function tierLabelKey(tier: TrophyTier): string {
  return `tier_${tier}`;
}

/** i18n key for Q's quote on the detail page. */
export function tierQuoteKey(tier: TrophyTier): string {
  return `q_${tier}`;
}

/** i18n key for a sport label, falling back to "other". */
export function sportLabelKey(sport: SportType | null | undefined): string {
  if (!sport) return 'sport_other';
  const known: SportType[] = [
    'hyrox',
    'running',
    'triathlon',
    'cycling',
    'other',
  ];
  return known.includes(sport) ? `sport_${sport}` : 'sport_other';
}

/**
 * Visual styling per tier. Warm has no border by design, the warm tier
 * should never feel like a punishment, only a soft acknowledgement.
 */
export interface TierStyle {
  pillBackground: string;
  pillText: string;
  pillBorder: string | null;
  glowColor: string | null;
}

export function getTierStyle(tier: TrophyTier): TierStyle {
  switch (tier) {
    case 'gold':
      return {
        pillBackground: '#F1C40F',
        pillText: '#4A235A',
        pillBorder: '#6C3483',
        glowColor: '#F1C40F',
      };
    case 'silver':
      return {
        pillBackground: '#C0C0C0',
        pillText: '#4A235A',
        pillBorder: '#6C3483',
        glowColor: null,
      };
    case 'bronze':
      return {
        pillBackground: '#CD7F32',
        pillText: '#FFFFFF',
        pillBorder: '#6C3483',
        glowColor: null,
      };
    case 'warm':
    default:
      return {
        pillBackground: '#A569BD',
        pillText: '#FFFFFF',
        pillBorder: null,
        glowColor: null,
      };
  }
}

/**
 * Format a duration in minutes as "1:27:15" or "75:00", matching how
 * Hyrox Paris is shown elsewhere in the app. Accepts fractional minutes.
 */
export function formatTime(totalMinutes: number | null | undefined): string {
  if (totalMinutes == null || isNaN(totalMinutes)) return '';
  const totalSeconds = Math.round(totalMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
  }
  return `${minutes}:${pad2(seconds)}`;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/** True when the event is finished and shows up in the trophy cabinet. */
export function isCompletedTrophy(event: TrophyEvent): boolean {
  return event.status === 'completed' && event.result_time_minutes != null;
}
