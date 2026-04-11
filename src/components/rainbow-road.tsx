'use client';

import { useMemo } from 'react';

// ═══════════════════════════════════════════════════════════
// strQ — Rainbow Road
// Sociaal feature: samen naar een event toe werken.
// Regenboog als SLINGEREND PAD in perspectief.
// Max 6 schildpadjes, elk op eigen kleurstrook.
// v2+ feature — placeholder data tot Supabase integratie.
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const SK = '#7BC88C';
const BG = '#1A1A2E';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];
const GOLD = '#F1C40F';
const GOLD_D = '#D4AC0D';

const MAX_FRIENDS = 6;
const CW = 400;
const CH = 480;

interface Friend {
  name: string;
  xp: number; // 0-1 progress toward event
}

interface RainbowRoadStrings {
  header: string;       // "Samen onderweg"
  daysToGo: string;     // "dagen te gaan"
  count: string;        // "{count} schildpadjes onderweg"
  invite: string;       // "+ Train samen"
}

interface RainbowRoadProps {
  eventName: string;
  daysToGo: number;
  friends: Friend[];
  strings: RainbowRoadStrings;
  onInvite?: () => void;  // callback for invite button — ready for future flow
}

// ── Road geometry ──

function roadCenter(t: number) {
  const yNear = 540;
  const yHorizon = 175;
  const ease = 1 - Math.pow(1 - t, 2.2);
  const y = yNear - (yNear - yHorizon) * ease;

  const curveStart = 0.12;
  const curveFactor = Math.max(0, (t - curveStart) / (1 - curveStart));
  const fadeOut = 1 - Math.pow(t, 2.5);
  const sway = Math.sin(curveFactor * Math.PI * 1.3) * 55 * curveFactor * fadeOut;
  const x = CW / 2 + sway;

  return { x, y };
}

function roadWidth(t: number) {
  const near = 500;
  const far = 5;
  return near * Math.pow(far / near, Math.pow(t, 0.6));
}

function roadEdges(t: number) {
  const c = roadCenter(t);
  const w = roadWidth(t);

  const dt = 0.005;
  const tA = Math.max(0, t - dt);
  const tB = Math.min(1, t + dt);
  const pA = roadCenter(tA);
  const pB = roadCenter(tB);
  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  const nx = -dy / len;
  const ny = dx / len;

  return {
    left: { x: c.x - nx * w / 2, y: c.y - ny * w / 2 },
    right: { x: c.x + nx * w / 2, y: c.y + ny * w / 2 },
    center: c,
    width: w,
    nx, ny,
  };
}

function buildBandPath(bandIndex: number, steps = 120) {
  const total = RB.length;
  const leftPts: { x: number; y: number }[] = [];
  const rightPts: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const edges = roadEdges(t);
    const w = edges.width;
    const bandW = w / total;
    const c = edges.center;

    const leftOffset = -w / 2 + bandIndex * bandW;
    const rightOffset = -w / 2 + (bandIndex + 1) * bandW;

    leftPts.push({ x: c.x + edges.nx * leftOffset, y: c.y + edges.ny * leftOffset });
    rightPts.push({ x: c.x + edges.nx * rightOffset, y: c.y + edges.ny * rightOffset });
  }

  let d = `M${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) d += ` L${leftPts[i].x.toFixed(1)} ${leftPts[i].y.toFixed(1)}`;
  for (let i = steps; i >= 0; i--) d += ` L${rightPts[i].x.toFixed(1)} ${rightPts[i].y.toFixed(1)}`;
  d += ' Z';
  return d;
}

function buildCenterPath(steps = 80) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = roadCenter(t);
    d += `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  }
  return d;
}

function buildOutlinePath(steps = 80) {
  const left: { x: number; y: number }[] = [];
  const right: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const e = roadEdges(t);
    left.push(e.left);
    right.push(e.right);
  }
  let d = `M${left[0].x.toFixed(1)} ${left[0].y.toFixed(1)}`;
  for (let i = 1; i <= steps; i++) d += ` L${left[i].x.toFixed(1)} ${left[i].y.toFixed(1)}`;
  for (let i = steps; i >= 0; i--) d += ` L${right[i].x.toFixed(1)} ${right[i].y.toFixed(1)}`;
  d += ' Z';
  return d;
}

// ── Turtle from behind ──

function Turtle({ progress, name, laneIndex = 0 }: { progress: number; name: string; laneIndex?: number }) {
  const t = progress;
  const edges = roadEdges(t);
  const c = edges.center;
  const w = edges.width;

  const bandWidth = w / RB.length;
  const laneOffset = -w / 2 + (laneIndex + 0.5) * bandWidth;
  const tx = c.x + edges.nx * laneOffset;
  const ty = c.y + edges.ny * laneOffset;

  const scale = Math.min(1, w / 120);
  const s = 42 * Math.max(0.22, scale);
  const opacity = 0.5 + scale * 0.5;

  const dt = 0.01;
  const pA = roadCenter(Math.max(0, t - dt));
  const pB = roadCenter(Math.min(1, t + dt));
  const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x) * (180 / Math.PI);

  return (
    <g transform={`translate(${tx.toFixed(1)}, ${(ty - s * 0.3).toFixed(1)})`} opacity={opacity}>
      <g transform={`rotate(${angle + 90})`}>
        <ellipse cx={0} cy={s*0.35} rx={s*0.28} ry={s*0.06} fill="rgba(0,0,0,0.1)" />
        <rect x={-s*0.24} y={s*0.04} width={s*0.09} height={s*0.18} rx={s*0.03} fill={SK} />
        <rect x={s*0.15} y={s*0.04} width={s*0.09} height={s*0.18} rx={s*0.03} fill={SK} />
        <ellipse cx={0} cy={s*0.28} rx={s*0.04} ry={s*0.07} fill={SK} opacity={0.5} />
        <ellipse cx={0} cy={0} rx={s*0.28} ry={s*0.24} fill={P} />
        <ellipse cx={-s*0.05} cy={-s*0.06} rx={s*0.09} ry={s*0.07} fill={PL} opacity={0.2} />
        {RB.map((col, i) => (
          <line key={i}
            x1={-s*0.18 + Math.abs(i-2.5)*s*0.02}
            y1={-s*0.11 + i*s*0.044}
            x2={s*0.18 - Math.abs(i-2.5)*s*0.02}
            y2={-s*0.11 + i*s*0.044}
            stroke={col} strokeWidth={Math.max(0.6, 1.3*scale)}
            strokeLinecap="round" opacity={0.6}
          />
        ))}
        <ellipse cx={0} cy={-s*0.24} rx={s*0.1} ry={s*0.08} fill={SK} />
        <line x1={-s*0.09} y1={-s*0.24} x2={-s*0.14} y2={-s*0.22}
          stroke={W} strokeWidth={Math.max(0.5, scale)} strokeLinecap="round" opacity={0.4} />
        <line x1={s*0.09} y1={-s*0.24} x2={s*0.14} y2={-s*0.22}
          stroke={W} strokeWidth={Math.max(0.5, scale)} strokeLinecap="round" opacity={0.4} />
      </g>
      <rect
        x={-Math.max(16, 24*scale)}
        y={-s*0.65 - Math.max(6, 9*scale)}
        width={Math.max(32, 48*scale)}
        height={Math.max(13, 18*scale)}
        rx={Math.max(6, 9*scale)}
        fill="rgba(26,26,46,0.7)"
        stroke="rgba(165,105,189,0.3)"
        strokeWidth={0.6}
      />
      <text x={0} y={-s*0.5} textAnchor="middle"
        fill="rgba(255,255,255,0.85)" fontSize={Math.max(8, 11*scale)}
        fontWeight={700} fontFamily="Inter, system-ui, sans-serif"
      >
        {name}
      </text>
    </g>
  );
}

// ── Stars data (deterministic) ──
const STARS = [
  {x:25,y:35,s:5,ci:0},{x:375,y:55,s:4.5,ci:2},{x:50,y:140,s:6,ci:4},
  {x:365,y:160,s:5,ci:3},{x:130,y:22,s:4.5,ci:5},{x:270,y:30,s:4,ci:1},
  {x:12,y:250,s:4.5,ci:-1},{x:390,y:230,s:5,ci:2},{x:200,y:12,s:4,ci:-1},
  {x:340,y:110,s:4.5,ci:0},{x:65,y:85,s:3.5,ci:3},{x:385,y:320,s:4.5,ci:5},
  {x:18,y:400,s:5,ci:1},{x:360,y:410,s:4.5,ci:4},{x:95,y:340,s:3.5,ci:-1},
  {x:330,y:420,s:4,ci:0},{x:185,y:70,s:3.5,ci:2},{x:45,y:200,s:4,ci:3},
  {x:160,y:300,s:4,ci:0},{x:230,y:350,s:3.5,ci:2},{x:280,y:280,s:3,ci:4},
  {x:140,y:380,s:4,ci:5},{x:310,y:360,s:3,ci:1},{x:180,y:420,s:5,ci:3},
  {x:250,y:450,s:4,ci:-1},{x:120,y:450,s:3.5,ci:0},{x:320,y:440,s:4,ci:4},
  {x:80,y:50,s:3,ci:-1},{x:310,y:25,s:3.5,ci:2},{x:170,y:100,s:4,ci:5},
  {x:240,y:80,s:3,ci:1},{x:350,y:130,s:3.5,ci:-1},{x:30,y:120,s:4,ci:0},
  {x:390,y:100,s:3,ci:3},{x:210,y:145,s:3.5,ci:4},{x:100,y:170,s:3,ci:-1},
  {x:60,y:300,s:3.5,ci:2},{x:350,y:270,s:3,ci:5},{x:200,y:240,s:4,ci:1},
  {x:40,y:350,s:3,ci:4},{x:380,y:380,s:3.5,ci:0},{x:290,y:320,s:3,ci:-1},
];

// ── Sparkle trail data (deterministic — no Math.random) ──
const SPARK_OFFSETS = [0.28, 0.42, 0.31, 0.39, 0.26, 0.45, 0.33, 0.37, 0.29, 0.44, 0.35, 0.27, 0.41, 0.30, 0.38, 0.43, 0.32, 0.36];

// ═══════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════

export function RainbowRoad({ eventName, daysToGo, friends, strings, onInvite }: RainbowRoadProps) {
  // Clamp to max 6, clamp xp to 0-1
  const capped = friends.slice(0, MAX_FRIENDS).map(f => ({
    ...f,
    xp: Math.max(0, Math.min(1, f.xp)),
  }));

  // Road geometry is pure math — compute once
  const { bandPaths, centerD, outlineD, potCenter } = useMemo(() => ({
    bandPaths: RB.map((color, i) => ({ color, d: buildBandPath(i) })),
    centerD: buildCenterPath(),
    outlineD: buildOutlinePath(),
    potCenter: roadCenter(0.95),
  }), []);

  const withLanes = capped.map((f, i) => ({ ...f, lane: i % RB.length }));
  const sorted = [...withLanes].sort((a, b) => b.xp - a.xp);

  // Don't render the road if there are no friends
  if (capped.length === 0) return null;

  return (
    <div style={{
      background: BG,
      borderRadius: 20,
      padding: '20px 12px 16px',
      maxWidth: 440,
      margin: '0 auto',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2,
        }}>
          {strings.header.toUpperCase()}
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: PL }}>
          {eventName}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
          {daysToGo} {strings.daysToGo}
        </div>
      </div>

      <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <filter id="rr-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="rr-roadGlow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="rr-horizonFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="28%" stopColor="white" stopOpacity="0.5" />
            <stop offset="45%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="rr-roadMask">
            <rect x="0" y="0" width={CW} height={CH} fill="url(#rr-horizonFade)" />
          </mask>
        </defs>

        {/* ── Twinkling stars ── */}
        {STARS.map((st, i) => {
          const c = st.ci === -1 ? W : RB[st.ci];
          return (
            <path key={i}
              d={`M${st.x} ${st.y-st.s}L${st.x+st.s*0.3} ${st.y}L${st.x} ${st.y+st.s}L${st.x-st.s*0.3} ${st.y}Z`}
              fill={c} opacity={0.04}
            >
              <animate attributeName="opacity" values="0.02;0.5;0.02" dur={`${1.8+i*0.15}s`} repeatCount="indefinite" />
              <animate attributeName="d"
                values={`M${st.x} ${st.y-st.s}L${st.x+st.s*0.3} ${st.y}L${st.x} ${st.y+st.s}L${st.x-st.s*0.3} ${st.y}Z;M${st.x} ${st.y-st.s*1.3}L${st.x+st.s*0.4} ${st.y}L${st.x} ${st.y+st.s*1.3}L${st.x-st.s*0.4} ${st.y}Z;M${st.x} ${st.y-st.s}L${st.x+st.s*0.3} ${st.y}L${st.x} ${st.y+st.s}L${st.x-st.s*0.3} ${st.y}Z`}
                dur={`${1.8+i*0.15}s`} repeatCount="indefinite" />
            </path>
          );
        })}

        {/* ── Road with fade mask ── */}
        <g mask="url(#rr-roadMask)">
          <path d={outlineD} fill={PL} opacity={0.04} filter="url(#rr-roadGlow)" />
          {bandPaths.map((band, i) => (
            <path key={`glow-${i}`} d={band.d} fill={band.color} opacity={0.05} filter="url(#rr-roadGlow)" />
          ))}
          {bandPaths.map((band, i) => (
            <path key={`band-${i}`} d={band.d} fill={band.color} opacity={0.88} />
          ))}
          {(() => {
            const steps = 120;
            let leftD = '';
            let rightD = '';
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const e = roadEdges(t);
              leftD += `${i === 0 ? 'M' : 'L'}${e.left.x.toFixed(1)} ${e.left.y.toFixed(1)}`;
              rightD += `${i === 0 ? 'M' : 'L'}${e.right.x.toFixed(1)} ${e.right.y.toFixed(1)}`;
            }
            return <>
              <path d={leftD} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.2} />
              <path d={rightD} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.2} />
            </>;
          })()}
        </g>

        {/* ── Lane dividers ── */}
        {[1, 2, 3, 4, 5].map(bi => {
          const steps = 120;
          let d = '';
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const e = roadEdges(t);
            const w = e.width;
            const offset = -w/2 + (bi/RB.length) * w;
            const px = e.center.x + e.nx * offset;
            const py = e.center.y + e.ny * offset;
            d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`;
          }
          return <path key={bi} d={d} fill="none" stroke="rgba(255,255,255,0.04)"
            strokeWidth={0.5} strokeDasharray="4 8" />;
        })}

        {/* ── Shimmer orbs ── */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(si => {
          const color = si % 3 === 0 ? W : RB[si % RB.length];
          const dur = 3.2 + si * 0.55;
          const begin = si * 0.7;
          return (
            <g key={`shimmer-${si}`}>
              <circle r={6} fill={color} opacity={0}>
                <animateMotion path={centerD} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.12;0" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="3;9;3" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              </circle>
              <circle r={2.5} fill={color} opacity={0}>
                <animateMotion path={centerD} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.75;0" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="1.5;4;1.5" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              </circle>
              <circle r={1} fill={W} opacity={0}>
                <animateMotion path={centerD} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.9;0" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="0.3;1.5;0.3" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* ── Sparkle trails ── */}
        {Array.from({ length: 18 }).map((_, i) => {
          const t = 0.08 + (i / 18) * 0.7;
          const rc = roadCenter(t);
          const w = roadWidth(t);
          const side = i % 2 === 0 ? -1 : 1;
          const xOff = side * w * SPARK_OFFSETS[i];
          const c = RB[i % RB.length];
          const dur = 1.6 + (i % 5) * 0.35;
          const drift = side * (8 + (i % 3) * 5);
          return (
            <g key={`spark-${i}`}>
              <path
                d={`M${rc.x + xOff} ${rc.y - 4}L${rc.x + xOff + 2.5} ${rc.y}L${rc.x + xOff} ${rc.y + 4}L${rc.x + xOff - 2.5} ${rc.y}Z`}
                fill={c} opacity={0}
              >
                <animate attributeName="opacity" values="0;0.7;0" dur={`${dur}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
                <animate attributeName="d"
                  values={`M${rc.x+xOff} ${rc.y-3}L${rc.x+xOff+2} ${rc.y}L${rc.x+xOff} ${rc.y+3}L${rc.x+xOff-2} ${rc.y}Z;M${rc.x+xOff+drift} ${rc.y-18}L${rc.x+xOff+drift+3.5} ${rc.y-14}L${rc.x+xOff+drift} ${rc.y-10}L${rc.x+xOff+drift-3.5} ${rc.y-14}Z;M${rc.x+xOff} ${rc.y-3}L${rc.x+xOff+2} ${rc.y}L${rc.x+xOff} ${rc.y+3}L${rc.x+xOff-2} ${rc.y}Z`}
                  dur={`${dur}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
              </path>
              <circle cx={rc.x + xOff} cy={rc.y} r={1.5} fill={W} opacity={0}>
                <animate attributeName="opacity" values="0;0.5;0" dur={`${dur}s`} begin={`${i * 0.35 + 0.1}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${rc.y};${rc.y - 20};${rc.y}`} dur={`${dur}s`} begin={`${i * 0.35 + 0.1}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${rc.x+xOff};${rc.x+xOff+drift*0.6};${rc.x+xOff}`} dur={`${dur}s`} begin={`${i * 0.35 + 0.1}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* ── Pot of gold ── */}
        <g transform={`translate(${potCenter.x.toFixed(0)}, ${(potCenter.y - 14).toFixed(0)})`}
          filter="url(#rr-glow)">
          <ellipse cx={0} cy={12} rx={28} ry={10} fill={GOLD} opacity={0.06}>
            <animate attributeName="opacity" values="0.04;0.12;0.04" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={0} cy={8} rx={18} ry={6} fill={GOLD} opacity={0.1}>
            <animate attributeName="opacity" values="0.06;0.2;0.06" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M-12 4 Q-15 -5 -11 -14 L11 -14 Q15 -5 12 4 Z" fill={GOLD_D} />
          <ellipse cx={0} cy={4} rx={12} ry={3.5} fill={GOLD_D} />
          <ellipse cx={0} cy={-14} rx={11} ry={3} fill={GOLD} />
          <ellipse cx={0} cy={-14} rx={8} ry={2} fill="#F9E547" opacity={0.5} />
          <ellipse cx={-4} cy={-4} rx={3} ry={6} fill={GOLD} opacity={0.15} />
          <circle cx={-4} cy={-17} r={2.5} fill={GOLD} />
          <circle cx={3} cy={-18} r={2.5} fill={GOLD} opacity={0.9} />
          <circle cx={0} cy={-19.5} r={2} fill="#F9E547" />
          <circle cx={-7} cy={-16} r={2} fill={GOLD} opacity={0.7} />
          <circle cx={6} cy={-16.5} r={2} fill={GOLD} opacity={0.75} />
          <circle cx={-1} cy={-21} r={1.8} fill="#FFF176" opacity={0.9} />
          <circle cx={-3.5} cy={-17.5} r={0.6} fill={W} opacity={0.4} />
          <circle cx={3.5} cy={-18.5} r={0.6} fill={W} opacity={0.4} />
          <circle cx={0.5} cy={-20} r={0.5} fill={W} opacity={0.35} />

          {/* Waving flag */}
          <line x1={0} y1={-21} x2={0} y2={-46} stroke={W} strokeWidth={1.8} strokeLinecap="round" opacity={0.9} />
          <circle cx={0} cy={-46} r={2} fill={PL} />
          <g>
            <path fill={W} opacity={0.95}>
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M2 -46 Q8 -47 12 -45 Q16 -43 20 -44 L20 -34 Q16 -33 12 -35 Q8 -37 2 -34 Z;M2 -46 Q8 -44 12 -46 Q16 -48 20 -46 L20 -34 Q16 -36 12 -34 Q8 -32 2 -34 Z;M2 -46 Q8 -47 12 -45 Q16 -43 20 -44 L20 -34 Q16 -33 12 -35 Q8 -37 2 -34 Z" />
            </path>
            <path fill={P} opacity={0.9}>
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M2 -46 Q5 -46.5 8 -46 L8 -40 Q5 -40.5 2 -40 Z;M2 -46 Q5 -45 8 -46 L8 -40 Q5 -39 2 -40 Z;M2 -46 Q5 -46.5 8 -46 L8 -40 Q5 -40.5 2 -40 Z" />
            </path>
            <path fill={P} opacity={0.9}>
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M14 -44.5 Q17 -43.5 20 -44 L20 -38 Q17 -37 14 -38.5 Z;M14 -47 Q17 -47.5 20 -46 L20 -40 Q17 -41.5 14 -41 Z;M14 -44.5 Q17 -43.5 20 -44 L20 -38 Q17 -37 14 -38.5 Z" />
            </path>
            <path fill={P} opacity={0.9}>
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M8 -40 Q11 -38.5 14 -39 L14 -34 Q11 -35 8 -36.5 Z;M8 -40 Q11 -38 14 -40 L14 -34 Q11 -33 8 -34 Z;M8 -40 Q11 -38.5 14 -39 L14 -34 Q11 -35 8 -36.5 Z" />
            </path>
            <path fill="rgba(255,255,255,0.15)">
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M2 -46 Q8 -47 12 -45 Q16 -43 20 -44 L20 -34 Q16 -33 12 -35 Q8 -37 2 -34 Z;M2 -46 Q8 -44 12 -46 Q16 -48 20 -46 L20 -34 Q16 -36 12 -34 Q8 -32 2 -34 Z;M2 -46 Q8 -47 12 -45 Q16 -43 20 -44 L20 -34 Q16 -33 12 -35 Q8 -37 2 -34 Z" />
              <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Gold sparkles */}
          {[
            {x:-22,y:0,s:4},{x:22,y:-2,s:3.5},{x:-18,y:-20,s:3},{x:18,y:-18,s:3.5},
            {x:0,y:-28,s:3},{x:-12,y:-28,s:2.5},{x:14,y:-26,s:2.5},
            {x:-26,y:-10,s:3},{x:26,y:-8,s:2.5},{x:0,y:8,s:3},
          ].map((sp, si) => (
            <path key={si}
              d={`M${sp.x} ${sp.y-sp.s}L${sp.x+sp.s*0.35} ${sp.y}L${sp.x} ${sp.y+sp.s}L${sp.x-sp.s*0.35} ${sp.y}Z`}
              fill={GOLD} opacity={0.15}
            >
              <animate attributeName="opacity" values="0.04;0.6;0.04" dur={`${1.4+si*0.2}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Light rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = deg * Math.PI / 180;
            const x1 = Math.cos(rad) * 16;
            const y1 = Math.sin(rad) * 16 - 10;
            const x2 = Math.cos(rad) * 30;
            const y2 = Math.sin(rad) * 30 - 10;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={GOLD} strokeWidth={0.8} strokeLinecap="round" opacity={0.05}
              >
                <animate attributeName="opacity" values="0.02;0.12;0.02" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
              </line>
            );
          })}
        </g>

        {/* ── Turtles ── */}
        {sorted.map((friend, i) => (
          <g key={friend.name}>
            <animateTransform attributeName="transform" type="translate"
              values="0 0;0 -1;0 0" dur={`${3+i*0.5}s`} repeatCount="indefinite" />
            <Turtle progress={friend.xp} name={friend.name} laneIndex={friend.lane} />
          </g>
        ))}
      </svg>

      {/* Count */}
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
        {strings.count.replace('{count}', String(capped.length))}
      </div>

      {/* Invite */}
      <button
        onClick={onInvite}
        style={{
          display: 'block', margin: '12px auto 0', padding: '10px 24px',
          fontSize: 13, fontWeight: 700,
          background: `linear-gradient(135deg, ${P}, ${PL})`,
          color: W, border: 'none', borderRadius: 20, cursor: 'pointer',
          boxShadow: `0 2px 12px ${P}44`,
        }}
      >
        {strings.invite}
      </button>
    </div>
  );
}
