'use client';

import { P, PL, PD, PM, SK, SL, SD, W, RB } from '@/components/dashboard/colors';

// ═══════════════════════════════════════════════════════════
// Q Mascotte, warm pose (warm tier)
// Sitting cross-legged, holding a small mug with steam wisps.
// Soft eyes, gentle smile. The look of "you were there, and
// that's what counts." No punishment, no consolation, just
// warmth.
// ═══════════════════════════════════════════════════════════

const MUG = '#7D3C98';
const STEAM = 'rgba(255,255,255,0.55)';

export function QWarmLarge({ size = 180 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      {/* Ground shadow, wider for the seated stance */}
      <ellipse cx="120" cy="288" rx="58" ry="6" fill="rgba(0,0,0,0.14)" />

      {/* Crossed legs, drawn as a low rounded base */}
      <ellipse cx="120" cy="270" rx="58" ry="18" fill={SK} />
      <path d="M70 268 C90 258, 150 258, 170 268" stroke={SD} strokeWidth="2" fill="none" opacity="0.4" />
      <ellipse cx="120" cy="262" rx="42" ry="9" fill={SL} opacity="0.6" />

      {/* Shell, sitting slightly lower than usual */}
      <g>
        <ellipse cx={120} cy={214} rx={52} ry={44} fill={P} />
        <ellipse cx={120} cy={204} rx={25} ry={21} stroke={PM} strokeWidth="1.8" fill="none" opacity="0.45" />
        <ellipse cx={112} cy={200} rx={12} ry={8} fill={PL} opacity="0.12" />
        {RB.map((c, i) => (
          <path
            key={i}
            d={`M${68 + i * 2} ${216 + i * 2.5} Q120 ${196 + i * 2.5} ${172 - i * 2} ${216 + i * 2.5}`}
            stroke={c}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Belly */}
      <ellipse cx="120" cy="234" rx="26" ry="22" fill={SL} />

      {/* Right arm holding the mug across the belly */}
      <path d="M168 218 C160 224, 150 232, 142 240" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      {/* Left arm resting on the lap */}
      <path d="M72 218 C82 230, 92 240, 100 244" stroke={SK} strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="100" cy="246" rx="9" ry="7" fill={SD} />

      {/* Mug */}
      <g>
        {/* Steam wisps */}
        <path d="M132 198 C128 188, 134 180, 130 170" stroke={STEAM} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M142 200 C146 192, 140 184, 144 176" stroke={STEAM} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M152 202 C148 194, 154 186, 150 180" stroke={STEAM} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* Mug body */}
        <rect x="128" y="208" width="28" height="28" rx="4" fill={MUG} />
        <rect x="128" y="208" width="28" height="6" rx="3" fill={PD} opacity="0.55" />
        {/* Handle */}
        <path d="M156 214 C166 214, 166 230, 156 230" stroke={MUG} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Tiny rainbow band as a strQ touch */}
        <rect x="130" y="222" width="24" height="2" fill={RB[2]} opacity="0.7" />
        {/* Hand wrapped around the mug */}
        <ellipse cx="142" cy="240" rx="11" ry="6" fill={SD} />
      </g>

      {/* Neck and head, slightly tilted */}
      <path d="M120 178 L118 162" stroke={SK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="118" cy="148" rx="28" ry="24" fill={SK} />
      <circle cx="96" cy="154" r="4.5" fill={SL} opacity="0.35" />

      {/* Glasses, slight tilt */}
      <g transform="rotate(-3 118 142)">
        <rect x={96} y={136} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <rect x={120} y={136} width="20" height="15" rx="4.5" stroke={W} strokeWidth="2.6" fill="rgba(255,255,255,0.08)" />
        <path d="M116 142 C117 140, 119 140, 120 142" stroke={W} strokeWidth="2" fill="none" />
        <line x1="96" y1="142" x2="90" y2="140" stroke={W} strokeWidth="2" strokeLinecap="round" />
        <line x1="140" y1="142" x2="146" y2="140" stroke={W} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Eyes, soft and open */}
      <ellipse cx="107" cy="139" rx="3.6" ry="4.4" fill={W} />
      <ellipse cx="129" cy="140" rx="3.6" ry="4.4" fill={W} />
      <ellipse cx="108" cy="138" rx="2.2" ry="2.8" fill={PD} />
      <ellipse cx="130" cy="139" rx="2.2" ry="2.8" fill={PD} />
      <circle cx="109" cy="136.5" r="1.1" fill={W} />
      <circle cx="131" cy="137.5" r="1.1" fill={W} />

      {/* Gentle smile */}
      <path d="M108 158 C114 164, 124 164, 130 158" stroke={PD} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Warm cheek glow */}
      <circle cx="100" cy="153" r="5" fill="#E74C3C" opacity="0.14" />
      <circle cx="136" cy="154" r="5" fill="#E74C3C" opacity="0.14" />
    </svg>
  );
}
