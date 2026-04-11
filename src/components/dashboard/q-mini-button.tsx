'use client';

import { P, PL, PD, SK, SL, SD, W, RB } from './colors';

// ═══════════════════════════════════════════════════════════
// Q Mini — lives inside the train button
// Three states: ready (waving), running (speedlines), excited (hyper hover)
// ═══════════════════════════════════════════════════════════

interface QMiniButtonProps {
  pose?: 'ready' | 'running';
  size?: number;
  excited?: boolean;
}

export function QMiniButton({ pose = 'ready', size = 36, excited = false }: QMiniButtonProps) {
  if (pose === 'running') {
    // Running Q: leaning forward, neck stretched, speedlines, dynamic legs
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ display: 'block' }}>
        {/* Speedlines */}
        <line x1="4" y1="24" x2="14" y2="24" stroke={PL} strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.4s" repeatCount="indefinite" />
        </line>
        <line x1="2" y1="32" x2="16" y2="32" stroke={PL} strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.15;0.6;0.15" dur="0.35s" repeatCount="indefinite" />
        </line>
        <line x1="6" y1="40" x2="15" y2="40" stroke={PL} strokeWidth="1.5" strokeLinecap="round" opacity="0.35">
          <animate attributeName="opacity" values="0.1;0.45;0.1" dur="0.45s" repeatCount="indefinite" />
        </line>
        {/* Legs — dynamic stride */}
        <path d="M27 44 L20 50 L16 48" stroke={SK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="15" cy="49" rx="2.5" ry="1.3" fill={SD} />
        <path d="M35 44 L42 50 L48 51" stroke={SK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="49" cy="52" rx="2.5" ry="1.3" fill={SD} />
        {/* Shell — leaning forward */}
        <g transform="rotate(-12 32 34)">
          <ellipse cx="32" cy="34" rx="13" ry="11" fill={P} />
          {RB.map((c, i) => (
            <path key={i} d={`M${20 + i * 0.5} ${35 + i * 0.6} Q32 ${28 + i * 0.6} ${44 - i * 0.5} ${35 + i * 0.6}`}
              stroke={c} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.7" />
          ))}
        </g>
        {/* Belly */}
        <ellipse cx="32" cy="38" rx="6" ry="5.5" fill={SL} transform="rotate(-12 32 38)" />
        {/* Arms — one forward pumping, one back */}
        <path d="M21 32 C18 36, 18 42, 20 46" stroke={SK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="20" cy="47" rx="2" ry="1.5" fill={SD} />
        <path d="M42 30 C48 26, 52 24, 54 26" stroke={SK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="55" cy="27" rx="2" ry="1.5" fill={SD} />
        {/* Neck — stretched forward! */}
        <path d="M30 24 C32 20, 35 16, 37 13" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        {/* Head — tilted forward */}
        <ellipse cx="38" cy="10" rx="7.5" ry="6.5" fill={SK} transform="rotate(-10 38 10)" />
        {/* Glasses */}
        <rect x="31" y="7.5" width="5.5" height="4" rx="1.3" stroke={W} strokeWidth="0.7" fill="rgba(255,255,255,0.08)" transform="rotate(-10 33.5 9.5)" />
        <rect x="39" y="7" width="5.5" height="4" rx="1.3" stroke={W} strokeWidth="0.7" fill="rgba(255,255,255,0.08)" transform="rotate(-10 41.5 9)" />
        <path d="M36.5 9 C37 8.3, 38.5 8.2, 39 9" stroke={W} strokeWidth="0.5" fill="none" />
        {/* Eyes — determined */}
        <ellipse cx="34" cy="9.5" rx="1.2" ry="1.4" fill={W} />
        <ellipse cx="41.5" cy="9" rx="1.2" ry="1.4" fill={W} />
        <ellipse cx="34.5" cy="9.3" rx="0.7" ry="0.9" fill={PD} />
        <ellipse cx="42" cy="8.8" rx="0.7" ry="0.9" fill={PD} />
        {/* Grin */}
        <path d="M35 14 C37 16, 41 16, 43 14" stroke={PD} strokeWidth="0.7" fill="none" strokeLinecap="round" />
        {/* Sweat drop */}
        <path d="M44 5 C44.5 3, 44 2, 43.5 4" fill="#88C9DD" opacity="0.6" />
      </svg>
    );
  }

  // Default: ready Q — waving arm, gets hyper when excited (hover)
  const waveDur = excited ? '0.35s' : '1.2s';
  const headDur = excited ? '0.35s' : '1.2s';

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ display: 'block' }}>
      {/* Shell */}
      <ellipse cx="30" cy="33" rx="14" ry="12" fill={P} />
      {RB.map((c, i) => (
        <path key={i} d={`M${17 + i * 0.6} ${34 + i * 0.7} Q30 ${27 + i * 0.7} ${43 - i * 0.6} ${34 + i * 0.7}`}
          stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity={excited ? '0.9' : '0.7'} />
      ))}
      {/* Belly */}
      <ellipse cx="30" cy="37" rx="7" ry="6.5" fill={SL} />
      {/* Legs — bounce when excited */}
      <g>
        {excited && (
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.25s" repeatCount="indefinite" />
        )}
        <path d="M26 42 L24 48" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 42 L36 48" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="23" cy="49" rx="3" ry="1.5" fill={SD} />
        <ellipse cx="37" cy="49" rx="3" ry="1.5" fill={SD} />
      </g>
      {/* Left arm — animated wave (fast when excited!) */}
      <g>
        <path d="M17 33 C13 28, 10 20, 9 14" stroke={SK} strokeWidth="3" strokeLinecap="round">
          <animate attributeName="d"
            values={excited
              ? "M17 33 C13 28, 10 20, 9 14;M17 33 C8 22, 2 16, 1 12;M17 33 C13 28, 10 20, 9 14"
              : "M17 33 C13 28, 10 20, 9 14;M17 33 C11 26, 6 20, 4 16;M17 33 C13 28, 10 20, 9 14"}
            dur={waveDur} repeatCount="indefinite" />
        </path>
        <ellipse cx="8.5" cy="13" rx="2.5" ry="2" fill={SD}>
          <animate attributeName="cx" values={excited ? "8.5;0.5;8.5" : "8.5;3.5;8.5"} dur={waveDur} repeatCount="indefinite" />
          <animate attributeName="cy" values={excited ? "13;11;13" : "13;15;13"} dur={waveDur} repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* Right arm — also waves when excited! */}
      {excited ? (
        <g>
          <path d="M43 33 C47 28, 50 20, 51 14" stroke={SK} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d"
              values="M43 33 C47 28, 50 20, 51 14;M43 33 C49 22, 54 16, 56 12;M43 33 C47 28, 50 20, 51 14"
              dur="0.4s" repeatCount="indefinite" />
          </path>
          <ellipse cx="51.5" cy="13" rx="2.5" ry="2" fill={SD}>
            <animate attributeName="cx" values="51.5;57;51.5" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values="13;11;13" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : (
        <>
          <path d="M43 34 C46 37, 46 42, 44 45" stroke={SK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="44" cy="46" rx="2" ry="1.5" fill={SD} />
        </>
      )}
      {/* Neck */}
      <path d="M30 24 L30 20" stroke={SK} strokeWidth="3.5" strokeLinecap="round" />
      {/* Head — subtle tilt, frantic when excited */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values={excited
            ? "0 30 15;5 30 15;-4 30 15;6 30 15;-3 30 15;0 30 15"
            : "0 30 15;3 30 15;0 30 15;-2 30 15;0 30 15"}
          dur={headDur} repeatCount="indefinite" />
        <ellipse cx="30" cy="15" rx="8" ry="7" fill={SK} />
        {/* Glasses */}
        <rect x="22.5" y="12" width="6" height="4.5" rx="1.5" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
        <rect x="31.5" y="12" width="6" height="4.5" rx="1.5" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.08)" />
        <path d="M28.5 13.5 C29 12.8, 31 12.8, 31.5 13.5" stroke={W} strokeWidth="0.6" fill="none" />
        {/* Eyes — bigger when excited */}
        <ellipse cx="25.8" cy="13.8" rx={excited ? 1.6 : 1.3} ry={excited ? 1.8 : 1.5} fill={W} />
        <ellipse cx="34.2" cy="13.8" rx={excited ? 1.6 : 1.3} ry={excited ? 1.8 : 1.5} fill={W} />
        <ellipse cx="26.2" cy="13.5" rx={excited ? 1 : 0.8} ry={excited ? 1.2 : 1} fill={PD} />
        <ellipse cx="34.6" cy="13.5" rx={excited ? 1 : 0.8} ry={excited ? 1.2 : 1} fill={PD} />
        {/* Mouth — big open grin when excited, warm smile when calm */}
        {excited ? (
          <path d="M26 18.5 C28 22, 32 22, 34 18.5" stroke={PD} strokeWidth="0.8" fill={SD} strokeLinecap="round" />
        ) : (
          <path d="M27 19 C29 21, 31 21, 33 19" stroke={PD} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        )}
      </g>
      {/* Sparkles when excited */}
      {excited && (
        <>
          <circle cx="12" cy="8" r="1.5" fill={PL}>
            <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="6" r="1.2" fill="#F1C40F">
            <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="8" cy="28" r="1" fill={SK}>
            <animate attributeName="opacity" values="0;0.8;0" dur="0.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}
