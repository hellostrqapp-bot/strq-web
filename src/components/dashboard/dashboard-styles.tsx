'use client';

import { P, PL } from './colors';

// ═══════════════════════════════════════════════════════════
// Dashboard CSS keyframes — all animations in one place.
// Rendered as a <style> tag inside the dashboard.
// ═══════════════════════════════════════════════════════════

export function DashboardStyles() {
  return (
    <style>{`
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
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
      @keyframes rest-charge-pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @keyframes rest-charge-glow {
        0%, 100% { box-shadow: 0 0 8px ${PL}11; }
        50% { box-shadow: 0 0 16px ${PL}22, 0 0 24px ${P}11; }
      }
      @keyframes rest-charge-shimmer-v {
        0% { transform: translateY(100%); }
        60% { transform: translateY(-100%); }
        100% { transform: translateY(-100%); }
      }
      @keyframes rest-water-wobble {
        0%, 100% { transform: scaleX(1) translateY(0); }
        25% { transform: scaleX(1.1) translateY(-1px); }
        75% { transform: scaleX(0.9) translateY(1px); }
      }
      @keyframes rest-bubble {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-12px) scale(0.7); opacity: 0.3; }
        100% { transform: translateY(-20px) scale(0.4); opacity: 0; }
      }
    `}</style>
  );
}
