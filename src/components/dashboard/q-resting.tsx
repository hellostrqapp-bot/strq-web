'use client';

import { P, PL, PD, PM, SK, SL, SD, W, RB } from './colors';

// ═══════════════════════════════════════════════════════════
// Q Mascotte — resting pose (eyes closed, z's, peaceful)
// ═══════════════════════════════════════════════════════════

export function QResting({ size = 64 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
      {/* Legs — relaxed */}
      <path d="M106 250 L100 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <path d="M134 250 L140 276" stroke={SK} strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="96" cy="280" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="144" cy="280" rx="11" ry="5.5" fill={SD} />
      {/* Shell — rainbow stripes glow stronger during rest */}
      <g>
        <ellipse cx={120} cy={204} rx={52} ry={44} fill={P} />
        <ellipse cx={120} cy={194} rx={25} ry={21} stroke={PM} strokeWidth="1.8" fill="none" opacity="0.45" />
        <ellipse cx={112} cy={190} rx={12} ry={8} fill={PL} opacity="0.12" />
        {RB.map((c, i) => (
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
      </g>
      {/* Belly */}
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      {/* Arms resting at sides — peaceful */}
      <path d="M72 204 C60 218, 58 240, 66 254" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <path d="M168 204 C180 218, 182 240, 174 254" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Hands resting */}
      <ellipse cx="66" cy="258" rx="8" ry="6" fill={SD} />
      <ellipse cx="174" cy="258" rx="8" ry="6" fill={SD} />
      {/* Neck + Head — slightly tilted */}
      <path d="M120 168 L118 154" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="118" cy="140" rx="28" ry="24" fill={SK} />
      <circle cx="96" cy="146" r="4.5" fill={SL} opacity="0.35" />
      {/* Glasses — slightly tilted with head */}
      <g transform="rotate(-3 118 134)">
        <rect x={96} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={120} y={128} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M116 134 C117 132, 119 132, 120 134" stroke={W} strokeWidth="2" fill="none" />
        <line x1="96" y1="134" x2="90" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="140" y1="134" x2="146" y2="132" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Eyes — closed, peaceful curved lines */}
      <path d="M103 132 C106 128, 112 128, 115 132" stroke={PD} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M123 133 C126 129, 132 129, 135 133" stroke={PD} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Peaceful smile — gentle */}
      <path d="M108 150 C114 158, 124 158, 130 150" stroke={PD} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blush — warm glow on cheeks */}
      <circle cx="100" cy="145" r="5" fill="#E74C3C" opacity="0.12" />
      <circle cx="136" cy="146" r="5" fill="#E74C3C" opacity="0.12" />
      {/* Z's floating up — rest is happening */}
      <text x="150" y="120" fill={PL} fontSize="18" fontWeight="800" fontFamily="sans-serif" opacity="0.6">z</text>
      <text x="162" y="105" fill={PL} fontSize="14" fontWeight="800" fontFamily="sans-serif" opacity="0.45">z</text>
      <text x="170" y="92" fill={PL} fontSize="10" fontWeight="800" fontFamily="sans-serif" opacity="0.3">z</text>
    </svg>
  );
}
