import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateStreak,
  getBaseXP,
  getStreakBonus,
  rollSurprise,
  calculateFuzzyBonus,
} from '@/lib/streak-engine';

// ═══════════════════════════════════════════════════════════
// strQ — Streak Engine Tests
// "Rustdagen na inspanning breken de streak NIET."
// ═══════════════════════════════════════════════════════════

/** Helper: create activity entries relative to today */
function makeActivities(
  entries: Array<{ daysAgo: number; type: 'training' | 'rest' }>
) {
  return entries.map(({ daysAgo, type }) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return {
      activity_date: d.toISOString().split('T')[0],
      activity_type: type,
    };
  });
}

// ── calculateStreak ───────────────────────────────────────

describe('calculateStreak', () => {
  it('returns 0 streak with no activities', () => {
    const result = calculateStreak([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.multiplier).toBe(1);
  });

  it('counts consecutive training days', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.currentStreak).toBe(3);
  });

  it('gives 2x multiplier at 3+ day streak', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.multiplier).toBe(2);
  });

  it('gives 1x multiplier at 2 day streak', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.multiplier).toBe(1);
  });

  // ── CORE RULE: earned rest doesn't break streak ──

  it('preserves streak when rest day follows training', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'rest' },
      { daysAgo: 2, type: 'training' },
      { daysAgo: 3, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    // Rest day at daysAgo=1 should not break streak
    // Training days: 0, 2, 3 = 3 training days
    expect(result.currentStreak).toBe(3);
  });

  it('preserves streak with rest day between training blocks', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'rest' },
      { daysAgo: 3, type: 'training' },
      { daysAgo: 4, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.currentStreak).toBe(4);
  });

  // ── Gap days (unlogged) break streak ──

  it('breaks streak after 2 consecutive unlogged days', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      // daysAgo 1: nothing
      // daysAgo 2: nothing → 2 gap days → streak breaks
      { daysAgo: 3, type: 'training' },
      { daysAgo: 4, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.currentStreak).toBe(1); // only today
  });

  it('allows today to be empty (user hasn\'t opened app yet)', () => {
    const activities = makeActivities([
      // daysAgo 0: nothing (today, not logged yet)
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    // Today empty = fine, yesterday+day-before = 2 training days
    expect(result.currentStreak).toBe(2);
  });

  it('breaks streak if today empty AND yesterday empty', () => {
    const activities = makeActivities([
      // daysAgo 0: nothing
      // daysAgo 1: nothing → 2 gap days
      { daysAgo: 2, type: 'training' },
      { daysAgo: 3, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.currentStreak).toBe(0);
  });

  // ── The bugfix regression test (11 apr) ──

  it('does NOT break streak when today empty + yesterday rest + training before', () => {
    const activities = makeActivities([
      // daysAgo 0: nothing (today, not yet logged)
      { daysAgo: 1, type: 'rest' },     // earned rest
      { daysAgo: 2, type: 'training' },
      { daysAgo: 3, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    // Rest day resets gapDays, so gapDays never reaches 2
    expect(result.currentStreak).toBe(2);
  });

  // ── last7Days ──

  it('returns 7 days in last7Days', () => {
    const result = calculateStreak([]);
    expect(result.last7Days).toHaveLength(7);
    expect(result.last7Days[6].isToday).toBe(true);
  });

  // ── longestStreak ──

  it('tracks longest streak separately from current', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      // gap at 1-2 breaks current streak
      { daysAgo: 10, type: 'training' },
      { daysAgo: 11, type: 'training' },
      { daysAgo: 12, type: 'training' },
      { daysAgo: 13, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBeGreaterThanOrEqual(4);
  });
});

// ── Earned Rest ───────────────────────────────────────────

describe('earnedRest', () => {
  it('is locked with 0 training days', () => {
    const result = calculateStreak([]);
    expect(result.earnedRest.tier).toBe('locked');
    expect(result.earnedRest.available).toBe(false);
  });

  it('is locked with 1 training day', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.earnedRest.tier).toBe('locked');
    expect(result.earnedRest.available).toBe(false);
    expect(result.earnedRest.trainingDaysSinceRest).toBe(1);
  });

  it('is ready (25 XP) after 2 training days', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.earnedRest.tier).toBe('ready');
    expect(result.earnedRest.available).toBe(true);
    expect(result.earnedRest.xpReward).toBe(25);
    expect(result.earnedRest.progress).toBe(0.5);
  });

  it('is charged (40 XP) after 3 training days', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.earnedRest.tier).toBe('charged');
    expect(result.earnedRest.xpReward).toBe(40);
  });

  it('is supercharged (60 XP) after 4+ training days', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'training' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
      { daysAgo: 3, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    expect(result.earnedRest.tier).toBe('supercharged');
    expect(result.earnedRest.xpReward).toBe(60);
    expect(result.earnedRest.progress).toBe(1);
  });

  it('resets after taking rest', () => {
    const activities = makeActivities([
      { daysAgo: 0, type: 'rest' },
      { daysAgo: 1, type: 'training' },
      { daysAgo: 2, type: 'training' },
      { daysAgo: 3, type: 'training' },
    ]);
    const result = calculateStreak(activities);
    // Today is rest → earned rest resets
    expect(result.earnedRest.tier).toBe('locked');
    expect(result.earnedRest.trainingDaysSinceRest).toBe(0);
  });
});

// ── XP System ─────────────────────────────────────────────

describe('getBaseXP', () => {
  it('gives 50 XP for training', () => {
    expect(getBaseXP('training')).toBe(50);
  });

  it('gives 10 XP for unearned rest', () => {
    expect(getBaseXP('rest')).toBe(10);
  });

  it('gives earned rest XP when available', () => {
    expect(
      getBaseXP('rest', {
        trainingDaysSinceRest: 3,
        available: true,
        progress: 0.75,
        xpReward: 40,
        tier: 'charged',
      })
    ).toBe(40);
  });

  it('gives 10 XP for rest when earned rest is locked', () => {
    expect(
      getBaseXP('rest', {
        trainingDaysSinceRest: 1,
        available: false,
        progress: 0.25,
        xpReward: 0,
        tier: 'locked',
      })
    ).toBe(10);
  });
});

describe('getStreakBonus', () => {
  it('gives 0 bonus at streak < 2', () => {
    const streak = calculateStreak(
      makeActivities([{ daysAgo: 0, type: 'training' }])
    );
    expect(getStreakBonus(streak)).toBe(0);
  });

  it('gives bonus at streak = 2 (no multiplier)', () => {
    const streak = calculateStreak(
      makeActivities([
        { daysAgo: 0, type: 'training' },
        { daysAgo: 1, type: 'training' },
      ])
    );
    // 2 * 10 = 20 (multiplier is 1x at streak 2)
    expect(getStreakBonus(streak)).toBe(20);
  });

  it('doubles bonus at streak = 3 (2x multiplier)', () => {
    const streak = calculateStreak(
      makeActivities([
        { daysAgo: 0, type: 'training' },
        { daysAgo: 1, type: 'training' },
        { daysAgo: 2, type: 'training' },
      ])
    );
    // 3 * 10 * 2 = 60
    expect(getStreakBonus(streak)).toBe(60);
  });

  it('caps bonus at 500 XP', () => {
    // Streak of 30 would be 30 * 10 * 2 = 600, but capped at 500
    const activities = makeActivities(
      Array.from({ length: 30 }, (_, i) => ({ daysAgo: i, type: 'training' as const }))
    );
    const streak = calculateStreak(activities);
    expect(getStreakBonus(streak)).toBe(500);
  });
});

// ── Fuzzy Bonus ───────────────────────────────────────────

describe('calculateFuzzyBonus', () => {
  it('gives gold (500 XP) when beating target', () => {
    const result = calculateFuzzyBonus(75, 72);
    expect(result.tier).toBe('gold');
    expect(result.xp).toBe(500);
  });

  it('gives gold when exactly hitting target', () => {
    const result = calculateFuzzyBonus(75, 75);
    expect(result.tier).toBe('gold');
  });

  it('gives silver (300 XP) within 5%', () => {
    // 75 * 1.04 = 78
    const result = calculateFuzzyBonus(75, 78);
    expect(result.tier).toBe('silver');
    expect(result.xp).toBe(300);
  });

  it('gives bronze (200 XP) within 10%', () => {
    // 75 * 1.08 = 81
    const result = calculateFuzzyBonus(75, 81);
    expect(result.tier).toBe('bronze');
    expect(result.xp).toBe(200);
  });

  it('gives warm landing (100 XP) beyond 10% — never punishment', () => {
    const result = calculateFuzzyBonus(75, 120);
    expect(result.tier).toBe('warm');
    expect(result.xp).toBe(100);
    // No negative XP, ever
    expect(result.xp).toBeGreaterThan(0);
  });
});

// ── rollSurprise ──────────────────────────────────────────

describe('rollSurprise', () => {
  it('returns null or valid surprise object', () => {
    // Run 100 times, should get a mix of null and objects
    let nulls = 0;
    let surprises = 0;
    for (let i = 0; i < 100; i++) {
      const result = rollSurprise();
      if (result === null) {
        nulls++;
      } else {
        surprises++;
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('xp');
        expect(result.xp).toBeGreaterThanOrEqual(0);
      }
    }
    // With 15% chance over 100 rolls, we should get some of each
    expect(nulls).toBeGreaterThan(0);
    expect(surprises).toBeGreaterThan(0);
  });
});
