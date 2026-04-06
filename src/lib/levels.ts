// ═══════════════════════════════════════════════════════════
// strQ — Level System
// XP → Level met naam en visuele progressie.
// Levels gaan over toewijding, niet over kracht.
// Q's schild evolueert mee.
// ═══════════════════════════════════════════════════════════

export interface Level {
  level: number;
  name: string;
  /** i18n key for level name: `level.name_fresh`, etc. */
  nameKey: string;
  /** XP needed to reach this level */
  xpRequired: number;
  /** Number of rainbow stripes on Q's shield (0–6) */
  shieldStripes: number;
  /** Whether shield has glow effect */
  shieldGlow: boolean;
  /** Whether shield has golden rim */
  shieldGoldRim: boolean;
  /** Whether shield has sparkle particles */
  shieldSparkles: boolean;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    name: 'Fresh',
    nameKey: 'name_fresh',
    xpRequired: 0,
    shieldStripes: 0,
    shieldGlow: false,
    shieldGoldRim: false,
    shieldSparkles: false,
  },
  {
    level: 2,
    name: 'Steady',
    nameKey: 'name_steady',
    xpRequired: 100,
    shieldStripes: 1,
    shieldGlow: false,
    shieldGoldRim: false,
    shieldSparkles: false,
  },
  {
    level: 3,
    name: 'Rolling',
    nameKey: 'name_rolling',
    xpRequired: 300,
    shieldStripes: 2,
    shieldGlow: false,
    shieldGoldRim: false,
    shieldSparkles: false,
  },
  {
    level: 4,
    name: 'Locked In',
    nameKey: 'name_locked_in',
    xpRequired: 600,
    shieldStripes: 3,
    shieldGlow: true,
    shieldGoldRim: false,
    shieldSparkles: false,
  },
  {
    level: 5,
    name: 'On Fire',
    nameKey: 'name_on_fire',
    xpRequired: 1000,
    shieldStripes: 6,
    shieldGlow: true,
    shieldGoldRim: false,
    shieldSparkles: false,
  },
  {
    level: 6,
    name: 'Relentless',
    nameKey: 'name_relentless',
    xpRequired: 1500,
    shieldStripes: 6,
    shieldGlow: true,
    shieldGoldRim: false,
    shieldSparkles: true,
  },
  {
    level: 7,
    name: 'Unstoppable',
    nameKey: 'name_unstoppable',
    xpRequired: 2500,
    shieldStripes: 6,
    shieldGlow: true,
    shieldGoldRim: true,
    shieldSparkles: false,
  },
  {
    level: 8,
    name: 'Legendary',
    nameKey: 'name_legendary',
    xpRequired: 4000,
    shieldStripes: 6,
    shieldGlow: true,
    shieldGoldRim: true,
    shieldSparkles: true,
  },
];

export interface LevelInfo {
  current: Level;
  next: Level | null;
  /** XP progress within current level (0–1) */
  progress: number;
  /** XP earned since current level threshold */
  xpInLevel: number;
  /** XP needed to reach next level (from current level threshold) */
  xpForNext: number;
}

/**
 * Calculate user's level from total XP.
 */
export function getLevelInfo(totalXp: number): LevelInfo {
  let current = LEVELS[0];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      break;
    }
  }

  const nextIndex = LEVELS.findIndex((l) => l.level === current.level + 1);
  const next = nextIndex >= 0 ? LEVELS[nextIndex] : null;

  const xpInLevel = totalXp - current.xpRequired;
  const xpForNext = next ? next.xpRequired - current.xpRequired : 0;
  const progress = next ? Math.min(1, xpInLevel / xpForNext) : 1;

  return { current, next, progress, xpInLevel, xpForNext };
}
