// ═══════════════════════════════════════════════════════════
// strQ, Co-op data layer
// Thin wrappers around the security-definer RPCs in migration
// 010. All reads return only privacy-safe fields: color, name,
// moved-days and moved-today. Never sport, intensity or times.
//
// Pooled model: the season total is the sum of every member's
// moved days. Each member's colour shows their contribution,
// never a ranking.
// ═══════════════════════════════════════════════════════════

import { createBrowserClient } from '@/lib/supabase-browser';

export type CoopColor = 'red' | 'orange' | 'green' | 'teal' | 'blue' | 'purple';

export const COOP_COLORS: CoopColor[] = [
  'red',
  'orange',
  'green',
  'teal',
  'blue',
  'purple',
];

export const COOP_HEX: Record<CoopColor, string> = {
  red: '#E74C3C',
  orange: '#E67E22',
  green: '#27AE60',
  teal: '#1ABC9C',
  blue: '#2980B9',
  purple: '#8E44AD',
};

export const MAX_MEMBERS = 6;

export interface CoopSeasonSummary {
  id: string;
  name: string;
  goal_days: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  days_left: number;
  pooled_total: number;
  member_count: number;
}

export interface CoopMemberProgress {
  color: CoopColor;
  display_name: string;
  joined_at: string;
  is_me: boolean;
  moved_days: number;
  moved_today: boolean;
}

export interface CoopProgress {
  season_id: string;
  name: string;
  goal_days: number;
  start_date: string;
  end_date: string;
  status: string;
  days_left: number;
  pooled_total: number;
  members: CoopMemberProgress[];
}

export interface CoopInvitePreview {
  valid: boolean;
  season_id?: string;
  name?: string;
  goal_days?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  member_count?: number;
  taken_colors?: CoopColor[];
  is_full?: boolean;
  already_member?: boolean;
}

// ── Reads ──────────────────────────────────────────────────

export async function getMySeasons(): Promise<CoopSeasonSummary[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('get_my_coop_seasons');
  if (error) throw error;
  return (data ?? []) as CoopSeasonSummary[];
}

export async function getProgress(seasonId: string): Promise<CoopProgress> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('get_coop_progress', {
    p_season: seasonId,
  });
  if (error) throw error;
  return data as CoopProgress;
}

export async function getInvite(token: string): Promise<CoopInvitePreview> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('get_coop_invite', {
    p_token: token,
  });
  if (error) throw error;
  return data as CoopInvitePreview;
}

// ── Writes ─────────────────────────────────────────────────

export interface CreateSeasonInput {
  name: string;
  goalDays: number;
  startDate: string;
  endDate: string;
  color: CoopColor;
  displayName: string;
  linkedEventId?: string | null;
}

export async function createSeason(input: CreateSeasonInput): Promise<string> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('create_coop_season', {
    p_name: input.name,
    p_goal_days: input.goalDays,
    p_start: input.startDate,
    p_end: input.endDate,
    p_color: input.color,
    p_display_name: input.displayName,
    p_linked_event: input.linkedEventId ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function createInvite(seasonId: string): Promise<string> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('create_coop_invite', {
    p_season: seasonId,
  });
  if (error) throw error;
  return data as string;
}

export async function joinSeason(
  token: string,
  color: CoopColor,
  displayName: string
): Promise<string> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc('join_coop_season', {
    p_token: token,
    p_color: color,
    p_display_name: displayName,
  });
  if (error) throw error;
  return data as string;
}

// ── Helpers ────────────────────────────────────────────────

// Turtle position for the Rainbow Road. Pooled model: a member's
// position is their contribution against their fair share
// (goal / members). If everyone does their share, all turtles
// reach the pot together. Clamped to 0..1 for display.
export function memberShareProgress(
  movedDays: number,
  goalDays: number,
  memberCount: number
): number {
  const fairShare = memberCount > 0 ? goalDays / memberCount : goalDays;
  if (fairShare <= 0) return 0;
  return Math.max(0, Math.min(1, movedDays / fairShare));
}
