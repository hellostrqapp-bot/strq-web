import { describe, it, expect } from 'vitest';
import { getLevelInfo, LEVELS } from '@/lib/levels';

// ═══════════════════════════════════════════════════════════
// strQ — Level System Tests
// 8 levels: Fresh → Legendary
// ═══════════════════════════════════════════════════════════

describe('LEVELS config', () => {
  it('has 8 levels', () => {
    expect(LEVELS).toHaveLength(8);
  });

  it('starts at level 1 with 0 XP required', () => {
    expect(LEVELS[0].level).toBe(1);
    expect(LEVELS[0].xpRequired).toBe(0);
    expect(LEVELS[0].name).toBe('Fresh');
  });

  it('ends at level 8 (Legendary)', () => {
    expect(LEVELS[7].level).toBe(8);
    expect(LEVELS[7].name).toBe('Legendary');
  });

  it('has strictly increasing XP thresholds', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
    }
  });

  it('has increasing or equal shield stripes', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].shieldStripes).toBeGreaterThanOrEqual(LEVELS[i - 1].shieldStripes);
    }
  });
});

describe('getLevelInfo', () => {
  it('returns Fresh at 0 XP', () => {
    const info = getLevelInfo(0);
    expect(info.current.name).toBe('Fresh');
    expect(info.current.level).toBe(1);
    expect(info.next?.name).toBe('Steady');
  });

  it('returns Fresh at 99 XP (just below Steady)', () => {
    const info = getLevelInfo(99);
    expect(info.current.name).toBe('Fresh');
    expect(info.progress).toBeCloseTo(0.99, 1);
  });

  it('returns Steady at exactly 100 XP', () => {
    const info = getLevelInfo(100);
    expect(info.current.name).toBe('Steady');
    expect(info.current.level).toBe(2);
  });

  it('returns Rolling at 300 XP', () => {
    const info = getLevelInfo(300);
    expect(info.current.name).toBe('Rolling');
  });

  it('returns Locked In at 600 XP', () => {
    const info = getLevelInfo(600);
    expect(info.current.name).toBe('Locked In');
  });

  it('returns On Fire at 1000 XP', () => {
    const info = getLevelInfo(1000);
    expect(info.current.name).toBe('On Fire');
  });

  it('returns Legendary at 4000 XP', () => {
    const info = getLevelInfo(4000);
    expect(info.current.name).toBe('Legendary');
    expect(info.next).toBeNull();
    expect(info.progress).toBe(1); // maxed out
  });

  it('stays Legendary at 99999 XP', () => {
    const info = getLevelInfo(99999);
    expect(info.current.name).toBe('Legendary');
    expect(info.next).toBeNull();
  });

  it('calculates progress within a level correctly', () => {
    // Steady starts at 100, Rolling at 300 → range = 200
    const info = getLevelInfo(200);
    expect(info.current.name).toBe('Steady');
    expect(info.xpInLevel).toBe(100);
    expect(info.xpForNext).toBe(200);
    expect(info.progress).toBeCloseTo(0.5);
  });

  it('handles negative XP gracefully (edge case)', () => {
    const info = getLevelInfo(-10);
    expect(info.current.name).toBe('Fresh');
    expect(info.current.level).toBe(1);
  });
});
