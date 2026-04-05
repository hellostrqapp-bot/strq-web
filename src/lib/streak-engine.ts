// ═══════════════════════════════════════════════════════════
// strQ — Streak Engine
// Core game mechanic: streak calculation with smart rest days
//
// Rules:
// 1. Training day → streak +1
// 2. Rest day after training → streak preserved (not +1)
// 3. Two consecutive rest days → streak breaks
// 4. After 3+ day streak → 2x multiplier on XP
// 5. Surprise bonuses are random (15% chance)
//
// "Rustdagen na inspanning breken de streak NIET."
// ═══════════════════════════════════════════════════════════

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  multiplier: number;
  lastActivityDate: string | null;
  last7Days: DayInfo[];
}

export interface DayInfo {
  date: string;
  type: 'training' | 'rest' | 'none';
  label: string;
  isToday: boolean;
}

interface Activity {
  activity_date: string;
  activity_type: string;
}

// ── Streak Calculation ─────────────────────────────────────
// Walks backwards from today through activity history.
// Rest days after training don't break the streak.
// Two consecutive missed/rest days = streak broken.

export function calculateStreak(activities: Activity[]): StreakResult {
  const todayStr = toDateStr(new Date());
  const activityMap = new Map<string, string>();

  for (const a of activities) {
    activityMap.set(a.activity_date, a.activity_type);
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let consecutiveNonTraining = 0;
  let streakActive = true;

  // Walk backwards from today
  const d = new Date();
  for (let i = 0; i < 365 && streakActive; i++) {
    const dateStr = toDateStr(d);
    const type = activityMap.get(dateStr);

    if (type === 'training') {
      currentStreak++;
      consecutiveNonTraining = 0;
    } else if (type === 'rest') {
      // Rest day — allowed if preceded by training
      consecutiveNonTraining++;
      if (consecutiveNonTraining >= 2) {
        // Two non-training days in a row = streak breaks
        streakActive = false;
      }
      // Rest days don't add to streak count, but don't break it
    } else {
      // No activity logged
      if (i === 0) {
        // Today has no activity yet — that's OK, check yesterday
        consecutiveNonTraining++;
      } else {
        consecutiveNonTraining++;
        if (consecutiveNonTraining >= 2) {
          streakActive = false;
        }
      }
    }

    d.setDate(d.getDate() - 1);
  }

  // Calculate longest streak from all activities
  longestStreak = calculateLongestStreak(activities);
  longestStreak = Math.max(longestStreak, currentStreak);

  // Multiplier: 2x after 3+ consecutive training days
  const multiplier = currentStreak >= 3 ? 2.0 : 1.0;

  return {
    currentStreak,
    longestStreak,
    multiplier,
    lastActivityDate: activities.length > 0 ? activities[0].activity_date : null,
    last7Days: getLast7Days(activityMap),
  };
}

// ── Longest Streak (historical) ────────────────────────────
function calculateLongestStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0;

  // Sort by date ascending
  const sorted = [...activities]
    .filter((a) => a.activity_type === 'training')
    .sort((a, b) => a.activity_date.localeCompare(b.activity_date));

  let longest = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const a of sorted) {
    const d = new Date(a.activity_date);
    if (prevDate) {
      const daysDiff = Math.round(
        (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff <= 2) {
        // Allow 1 gap day (rest day)
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
    prevDate = d;
  }

  return longest;
}

// ── Last 7 Days ────────────────────────────────────────────
function getLast7Days(activityMap: Map<string, string>): DayInfo[] {
  const days: DayInfo[] = [];
  const todayStr = toDateStr(new Date());
  const dayLabels = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toDateStr(d);
    const type = activityMap.get(dateStr);

    days.push({
      date: dateStr,
      type: (type as 'training' | 'rest') || 'none',
      label: dayLabels[d.getDay()],
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

// ── XP System ──────────────────────────────────────────────
// Transparent per DSA: user can see exactly how XP is calculated

/** Base XP for logging an activity */
export function getBaseXP(type: 'training' | 'rest'): number {
  // Training gets more XP than rest, but rest still counts
  return type === 'training' ? 50 : 10;
}

/** Streak bonus based on current streak state */
export function getStreakBonus(streak: StreakResult): number {
  if (streak.currentStreak < 2) return 0;

  // Base streak bonus: 10 XP per streak day
  let bonus = streak.currentStreak * 10;

  // Multiplier kicks in at 3+ days
  if (streak.multiplier >= 2) {
    bonus = bonus * 2;
  }

  // Cap at 500 XP bonus to prevent runaway numbers
  return Math.min(bonus, 500);
}

/** Random surprise bonus (15% chance) */
export function rollSurprise(): { type: string; xp: number } | null {
  if (Math.random() > 0.15) return null;

  const surprises = [
    { type: 'bonus_xp', xp: 25 },
    { type: 'bonus_xp', xp: 50 },
    { type: 'bonus_xp', xp: 100 },
    { type: 'confetti', xp: 30 },
    { type: 'streak_shield', xp: 0 },
  ];

  return surprises[Math.floor(Math.random() * surprises.length)];
}

// ── Fuzzy Bonus ────────────────────────────────────────────
// Warm reward for hitting event target time.
// Soft landing for missing it.

export function calculateFuzzyBonus(
  targetMinutes: number,
  actualMinutes: number
): { xp: number; message: string; tier: 'gold' | 'silver' | 'bronze' | 'warm' } {
  const ratio = actualMinutes / targetMinutes;

  if (ratio <= 1.0) {
    // Beat the target!
    return { xp: 500, message: 'fuzzy_gold', tier: 'gold' };
  } else if (ratio <= 1.05) {
    // Within 5%
    return { xp: 300, message: 'fuzzy_silver', tier: 'silver' };
  } else if (ratio <= 1.10) {
    // Within 10%
    return { xp: 200, message: 'fuzzy_bronze', tier: 'bronze' };
  } else {
    // Missed by more — warm landing, never punishment
    return { xp: 100, message: 'fuzzy_warm', tier: 'warm' };
  }
}

// ── Helpers ──
function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}
