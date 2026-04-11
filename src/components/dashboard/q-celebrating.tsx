'use client';

import { P, PL, PD, PM, SK, SL, SD, W, RB } from './colors';

// ═══════════════════════════════════════════════════════════
// Q Mascotte — celebrating pose (arms raised, big smile)
// ═══════════════════════════════════════════════════════════

export function QCelebrating({ size = 64 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
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
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
        ))}
      </g>
      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      {/* Arms raised celebrating */}
      <path d="M72 204 C56 188, 48 170, 56 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C184 188, 192 170, 184 156" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Hands */}
      <ellipse cx="54" cy="152" rx="9" ry="7" fill={SD} />
      <ellipse cx="186" cy="152" rx="9" ry="7" fill={SD} />
      {/* Neck + Head */}
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
      {/* Sparkles */}
      <g opacity="0.55">
        <line x1="48" y1="142" x2="48" y2="130" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="136" x2="54" y2="136" stroke={PL} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="196" cy="140" r="2.5" fill={PL} />
        <line x1="192" y1="162" x2="192" y2="154" stroke={PL} strokeWidth="2" strokeLinecap="round" />
        <line x1="188" y1="158" x2="196" y2="158" stroke={PL} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
