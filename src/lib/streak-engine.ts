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
// 6. Taper mode: within TAPER_WINDOW_DAYS of an upcoming event,
//    rest is always free and gap days do not break the streak.
//    A taper is smart preparation, not a missed day.
//
// "Rustdagen na inspanning breken de streak NIET."
// ═══════════════════════════════════════════════════════════

/** Days before an event where taper mode activates (inclusive). */
export const TAPER_WINDOW_DAYS = 3;

/** XP for a taper rest day — same as 'charged' earned rest. */
export const TAPER_REST_XP = 40;

export interface EarnedRestInfo {
  /** How many consecutive training days since last rest/gap */
  trainingDaysSinceRest: number;
  /** Is the earned rest button available? (>= 2 training days, or taper active) */
  available: boolean;
  /** Progress 0-1 for the visual ring (0 = empty, 1 = full at 4+ days) */
  progress: number;
  /** XP reward if rest is taken now */
  xpReward: number;
  /** Tier label for UI styling */
  tier: 'locked' | 'ready' | 'charged' | 'supercharged' | 'taper';
}

export interface TaperInfo {
  /** Is taper mode active right now? */
  active: boolean;
  /** Days until the event (0 = event day today). -1 when no upcoming event. */
  daysUntilEvent: number;
  /** Event date that triggered the taper, if any */
  eventDate: string | null;
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  multiplier: number;
  lastActivityDate: string | null;
  last7Days: DayInfo[];
  earnedRest: EarnedRestInfo;
  taper: TaperInfo;
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

export function calculateStreak(
  activities: Activity[],
  upcomingEvent?: { event_date: string } | null
): StreakResult {
  const activityMap = new Map<string, string>();

  for (const a of activities) {
    activityMap.set(a.activity_date, a.activity_type);
  }

  const taper = calculateTaper(upcomingEvent);

  let currentStreak = 0;
  let longestStreak = 0;
  let streakActive = true;

  // Walk backwards from today.
  // Key rule: "rustdagen na inspanning breken de streak NIET."
  // An earned rest day (logged 'rest') after training is fine.
  // Today being empty is fine (user hasn't opened the app yet).
  // TWO consecutive UNLOGGED days (no activity at all) = streak breaks.
  // But: unlogged today + logged rest yesterday = streak OK.
  //
  // Taper exception: on days within the taper window of an upcoming event,
  // unlogged days do not count against the streak. A deliberate taper is
  // smart preparation, not a missed day.

  const d = new Date();
  let gapDays = 0; // consecutive days with NO logged activity at all

  for (let i = 0; i < 365 && streakActive; i++) {
    const dateStr = toDateStr(d);
    const type = activityMap.get(dateStr);
    const inTaper = isDateInTaperWindow(d, upcomingEvent);

    if (type === 'training') {
      currentStreak++;
      gapDays = 0;
    } else if (type === 'rest') {
      // Earned rest day — streak preserved, not incremented
      // Reset the gap counter: this is a deliberate logged rest, not an absence
      gapDays = 0;
    } else if (inTaper) {
      // Unlogged day that falls inside the taper window of an upcoming event.
      // Don't count as a gap — tapering down is exactly what the athlete
      // should be doing. Streak is preserved without incrementing.
      gapDays = 0;
    } else {
      // No activity logged this day
      gapDays++;
      if (i === 0) {
        // Today — user hasn't opened the app yet, that's fine
        // Don't break, just continue checking yesterday
      } else if (gapDays >= 2) {
        // Two consecutive days with NO logged activity = streak broken
        streakActive = false;
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
    last7Days: getStreakHistory(activityMap, currentStreak, upcomingEvent),
    earnedRest: calculateEarnedRest(activityMap, taper),
    taper,
  };
}

// ── Taper Mode ─────────────────────────────────────────────
// Taper mode is active on the TAPER_WINDOW_DAYS leading up to an event
// (inclusive of event day itself). During taper:
//   - Rest is always free (no earned-rest counter required)
//   - Unlogged days do not break the streak
//   - Earned rest button shows 'taper' tier with 40 XP
// This makes the app honour the fact that tapering is smart training.

function calculateTaper(upcomingEvent?: { event_date: string } | null): TaperInfo {
  if (!upcomingEvent?.event_date) {
    return { active: false, daysUntilEvent: -1, eventDate: null };
  }
  const days = daysBetween(new Date(), new Date(upcomingEvent.event_date));
  if (days < 0) {
    // Event is in the past — shouldn't happen for 'upcoming' status, but be safe
    return { active: false, daysUntilEvent: days, eventDate: upcomingEvent.event_date };
  }
  return {
    active: days <= TAPER_WINDOW_DAYS,
    daysUntilEvent: days,
    eventDate: upcomingEvent.event_date,
  };
}

/** Is the given date within the taper window of the event? */
function isDateInTaperWindow(
  date: Date,
  upcomingEvent?: { event_date: string } | null
): boolean {
  if (!upcomingEvent?.event_date) return false;
  const days = daysBetween(date, new Date(upcomingEvent.event_date));
  return days >= 0 && days <= TAPER_WINDOW_DAYS;
}

/** Whole-day difference between two dates (b - a). */
function daysBetween(a: Date, b: Date): number {
  const aUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bUtc - aUtc) / (1000 * 60 * 60 * 24));
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

// ── Streak History ─────────────────────────────────────────
// Returns all days of the current streak (minimum 7 days).
// When streak > 7, shows full streak so the user sees their
// entire run, not just the last week.
function getStreakHistory(
  activityMap: Map<string, string>,
  currentStreak: number,
  upcomingEvent?: { event_date: string } | null
): DayInfo[] {
  const days: DayInfo[] = [];
  const todayStr = toDateStr(new Date());
  const dayLabels = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

  // Walk backwards to find the first day of the streak.
  // The streak includes rest days, so count all days from
  // today back to the start of unbroken activity.
  let streakDays = 0;
  let gapDays = 0;
  const walker = new Date();
  for (let i = 0; i < 365; i++) {
    const dateStr = toDateStr(walker);
    const type = activityMap.get(dateStr);
    const inTaper = isDateInTaperWindow(walker, upcomingEvent);

    if (type === 'training' || type === 'rest') {
      gapDays = 0;
      streakDays = i + 1;
    } else if (inTaper) {
      // Taper day — part of the streak even without a log
      gapDays = 0;
      streakDays = i + 1;
    } else {
      gapDays++;
      if (i === 0) {
        // Today with no activity yet — still part of streak
        streakDays = 1;
      } else if (gapDays >= 2) {
        break;
      }
    }
    walker.setDate(walker.getDate() - 1);
  }

  // Show at least 7 days, or the full streak length, whichever is more
  const daysToShow = Math.max(7, streakDays);

  for (let i = daysToShow - 1; i >= 0; i--) {
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

// ── Earned Rest Calculation ────────────────────────────────
// Counts consecutive training days backwards from today (or yesterday
// if today has no activity yet) to determine if earned rest is available.
// The rest button "charges up" — more training = better reward.
//
// 0-1 days: locked (can't rest yet)
// 2 days:   ready       → 25 XP
// 3 days:   charged     → 40 XP
// 4+ days:  supercharged → 60 XP

function calculateEarnedRest(
  activityMap: Map<string, string>,
  taper: TaperInfo
): EarnedRestInfo {
  const todayStr = toDateStr(new Date());
  const todayType = activityMap.get(todayStr);

  // If today is already logged as rest, the button was already used
  if (todayType === 'rest') {
    return { trainingDaysSinceRest: 0, available: false, progress: 0, xpReward: 0, tier: 'locked' };
  }

  // Count consecutive training days backwards
  // Start from yesterday if today hasn't been logged yet, or today if it's a training day
  let consecutiveTraining = 0;
  const d = new Date();

  if (todayType === 'training') {
    // Count today, then walk back from yesterday
    consecutiveTraining++;
    d.setDate(d.getDate() - 1);
  } else {
    // Today not logged yet — start looking from yesterday so the earned-rest
    // button stays available after a streak of training days.
    d.setDate(d.getDate() - 1);
  }

  // Walk backwards counting training days
  for (let i = 0; i < 30; i++) {
    const dateStr = toDateStr(d);
    const type = activityMap.get(dateStr);
    if (type === 'training') {
      consecutiveTraining++;
      d.setDate(d.getDate() - 1);
    } else {
      break; // Hit a rest day, gap, or no-activity — stop counting
    }
  }

  // Taper mode: rest is always available and free, regardless of counter.
  // The tier takes precedence when the user has trained enough to supercharge —
  // we pick the better of taper (40 XP) or what they've earned.
  if (taper.active) {
    // If the user has built a supercharged streak AND is in taper, give them
    // the bigger reward. Otherwise give the flat taper reward.
    if (consecutiveTraining >= 4) {
      return { trainingDaysSinceRest: consecutiveTraining, available: true, progress: 1, xpReward: 60, tier: 'supercharged' };
    }
    return {
      trainingDaysSinceRest: consecutiveTraining,
      available: true,
      progress: 1,
      xpReward: TAPER_REST_XP,
      tier: 'taper',
    };
  }

  // Determine tier and reward
  if (consecutiveTraining < 2) {
    return { trainingDaysSinceRest: consecutiveTraining, available: false, progress: consecutiveTraining / 4, xpReward: 0, tier: 'locked' };
  }
  if (consecutiveTraining === 2) {
    return { trainingDaysSinceRest: 2, available: true, progress: 0.5, xpReward: 25, tier: 'ready' };
  }
  if (consecutiveTraining === 3) {
    return { trainingDaysSinceRest: 3, available: true, progress: 0.75, xpReward: 40, tier: 'charged' };
  }
  // 4+ days
  return { trainingDaysSinceRest: consecutiveTraining, available: true, progress: 1, xpReward: 60, tier: 'supercharged' };
}

// ── XP System ──────────────────────────────────────────────
// Transparent per DSA: user can see exactly how XP is calculated

/** Base XP for logging an activity */
export function getBaseXP(type: 'training' | 'rest', earnedRest?: EarnedRestInfo): number {
  // Training always gets 50 XP
  if (type === 'training') return 50;
  // Earned rest scales with effort — default to 10 for unearned rest
  if (earnedRest && earnedRest.available) return earnedRest.xpReward;
  return 10;
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
