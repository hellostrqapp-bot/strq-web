'use client';

import { P, PL, PD, PM, SK, SL, SD, W, RB } from '@/components/dashboard/colors';

// ═══════════════════════════════════════════════════════════
// Q Mascotte, celebrating large (gold tier)
// Same arms-raised pose as QCelebrating, but bigger by default
// and with a permanent ring of confetti dots, plus a gold
// halo behind the shell. Used on the trophy detail page.
// ═══════════════════════════════════════════════════════════

const GOLD = '#F1C40F';

export function QCelebratingLarge({ size = 180 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <defs>
        <radialGradient id="q-gold-halo" cx="0.5" cy="0.62" r="0.55">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="60%" stopColor={GOLD} stopOpacity="0.12" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft gold halo behind the shell */}
      <circle cx="120" cy="190" r="120" fill="url(#q-gold-halo)" />

      {/* Ground shadow */}
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
          <path
            key={i}
            d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`}
            stroke={c}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}
      </g>

      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />

      {/* Arms raised */}
      <path d="M72 204 C56 188, 48 170, 56 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C184 188, 192 170, 184 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="54" cy="152" rx="9" ry="7" fill={SD} />
      <ellipse cx="186" cy="152" rx="9" ry="7" fill={SD} />

      {/* Neck and head */}
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

      {/* Permanent confetti */}
      <g opacity="0.85">
        <rect x="36" y="60" width="6" height="3" rx="1" fill={RB[0]} transform="rotate(-12 39 61.5)" />
        <rect x="200" y="50" width="6" height="3" rx="1" fill={RB[1]} transform="rotate(20 203 51.5)" />
        <rect x="60" y="22" width="5" height="2.5" rx="1" fill={GOLD} transform="rotate(15 62.5 23.25)" />
        <rect x="180" y="20" width="5" height="2.5" rx="1" fill={RB[3]} transform="rotate(-25 182.5 21.25)" />
        <rect x="20" y="120" width="6" height="3" rx="1" fill={RB[4]} transform="rotate(35 23 121.5)" />
        <rect x="208" y="118" width="6" height="3" rx="1" fill={RB[5]} transform="rotate(-30 211 119.5)" />
        <rect x="100" y="14" width="4" height="2" rx="1" fill={RB[2]} />
        <rect x="138" y="12" width="4" height="2" rx="1" fill={PL} />
        <circle cx="32" cy="92" r="2.2" fill={RB[2]} />
        <circle cx="208" cy="86" r="2" fill={RB[5]} />
        <circle cx="46" cy="178" r="2" fill={GOLD} />
        <circle cx="196" cy="184" r="2" fill={RB[0]} />
      </g>

      {/* Sparkles near the head */}
      <g opacity="0.6">
        <line x1="48" y1="142" x2="48" y2="130" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="136" x2="54" y2="136" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="196" cy="140" r="2.5" fill={PL} />
        <line x1="192" y1="162" x2="192" y2="154" stroke={PL} strokeWidth="2" strokeLinecap="round" />
        <line x1="188" y1="158" x2="196" y2="158" stroke={PL} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
