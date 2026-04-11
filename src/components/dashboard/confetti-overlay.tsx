'use client';

import { RB } from './colors';

// ═══════════════════════════════════════════════════════════
// Confetti — full-screen celebratory particle shower
// Triggered after logging activity or earning XP.
// ═══════════════════════════════════════════════════════════

export function ConfettiOverlay() {
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
    </div>
  );
}
