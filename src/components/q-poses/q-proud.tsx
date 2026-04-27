'use client';

import { P, PL, PD, PM, SK, SL, SD, W, RB } from '@/components/dashboard/colors';

// ═══════════════════════════════════════════════════════════
// Q Mascotte, proud pose (silver tier)
// Standing tall, arms relaxed at sides, small but confident
// smile. No sparkles, no confetti. The look of "I know what
// I did, and that's enough."
// ═══════════════════════════════════════════════════════════

export function QProud({ size = 180 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      {/* Ground shadow */}
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />

      {/* Legs, slightly wider for a planted stance */}
      <path d="M104 250 L98 278" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <path d="M136 250 L142 278" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="94" cy="282" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="146" cy="282" rx="11" ry="5.5" fill={SD} />

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
            opacity="0.65"
          />
        ))}
      </g>

      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />

      {/* Arms relaxed at sides, slight curve */}
      <path d="M72 206 C66 218, 64 234, 70 246" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 206 C174 218, 176 234, 170 246" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="70" cy="250" rx="9" ry="7" fill={SD} />
      <ellipse cx="170" cy="250" rx="9" ry="7" fill={SD} />

      {/* Neck and head, head held high */}
      <path d="M120 168 L120 152" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="120" cy="138" rx="28" ry="24" fill={SK} />
      <circle cx="98" cy="144" r="4.5" fill={SL} opacity="0.35" />

      {/* Glasses, level */}
      <g>
        <rect x={98} y={126} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={122} y={126} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M118 132 C119 130, 121 130, 122 132" stroke={W} strokeWidth="2" fill="none" />
        <line x1="98" y1="132" x2="92" y2="130" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="142" y1="132" x2="148" y2="130" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Eyes, calm and direct */}
      <ellipse cx="109" cy="129" rx="4" ry="5" fill={W} />
      <ellipse cx="131" cy="130" rx="4" ry="5" fill={W} />
      <ellipse cx="110" cy="127.5" rx="2.5" ry="3.2" fill={PD} />
      <ellipse cx="132" cy="128.5" rx="2.5" ry="3.2" fill={PD} />
      <circle cx="111.5" cy="126" r="1.3" fill={W} />
      <circle cx="133.5" cy="127" r="1.3" fill={W} />

      {/* Small, confident smile */}
      <path d="M110 149 C116 156, 124 156, 130 149" stroke={PD} strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Subtle chest puff highlight on belly */}
      <path d="M104 218 C112 213, 128 213, 136 218" stroke={W} strokeWidth="1" fill="none" opacity="0.18" />
    </svg>
  );
}
