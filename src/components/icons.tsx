// ═══════════════════════════════════════════════════════════
// strQ — Custom Icon Set
// SVG icons in brand colors. No generic emoji.
// Purple (#6C3483), Lavender (#A569BD), Green (#7BC88C)
// ═══════════════════════════════════════════════════════════

const P = '#6C3483';
const PL = '#A569BD';
const PD = '#4A235A';
const SK = '#7BC88C';
const SL = '#A2D8AE';
const W = '#FFFFFF';
const RB = ['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'];

type IconProps = { size?: number; className?: string };

/** Streak flame — purple gradient */
export function IconStreak({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 5 9 5 14a7 7 0 0 0 14 0c0-5-7-12-7-12Z"
        fill="url(#flame-grad)"
      />
      <path
        d="M12 10c0 0-3 3-3 5.5a3 3 0 0 0 6 0c0-2.5-3-5.5-3-5.5Z"
        fill={PL}
        opacity="0.6"
      />
      <defs>
        <linearGradient id="flame-grad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor={PL} />
          <stop offset="1" stopColor={P} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Training — flexed arm in Q green */
export function IconTraining({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h1l2-4h2l-1.5 4H10l3-7h2l-2 7h1.5l3.5-5h2l-4 6.5V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2L5 12Z"
        fill={SK}
        opacity="0"
      />
      {/* Dumbbell icon */}
      <rect x="3" y="9" width="3" height="6" rx="1" fill={SK} />
      <rect x="18" y="9" width="3" height="6" rx="1" fill={SK} />
      <rect x="6" y="10.5" width="12" height="3" rx="1" fill={SL} />
      <rect x="1" y="10" width="2" height="4" rx="0.5" fill={SK} opacity="0.7" />
      <rect x="21" y="10" width="2" height="4" rx="0.5" fill={SK} opacity="0.7" />
    </svg>
  );
}

/** Rest day — moon with z's */
export function IconRest({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.5 12.5A8.5 8.5 0 0 1 11 21a8.5 8.5 0 0 1-1.5-.13A8.5 8.5 0 0 0 20.5 12.5Z"
        fill="none"
      />
      <path
        d="M18 6a8 8 0 0 1-8 14A8 8 0 0 0 18 6Z"
        fill={PL}
        opacity="0.5"
      />
      <path
        d="M10 2a10 10 0 1 0 10 10A7.5 7.5 0 0 1 10 2Z"
        fill={PL}
        opacity="0.3"
      />
      <text x="15" y="8" fill={W} fontSize="7" fontWeight="800" fontFamily="sans-serif" opacity="0.7">z</text>
      <text x="18" y="5" fill={W} fontSize="5" fontWeight="800" fontFamily="sans-serif" opacity="0.5">z</text>
    </svg>
  );
}

/** Checkmark — purple circle, white tick */
export function IconCheck({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={SK} />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke={W}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Gift / Daily Reveal — purple box, rainbow ribbon */
export function IconGift({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Box bottom */}
      <rect x="3" y="12" width="18" height="9" rx="2" fill={P} />
      {/* Box lid */}
      <rect x="2" y="9" width="20" height="4" rx="1.5" fill={PL} />
      {/* Vertical ribbon */}
      <rect x="11" y="9" width="2.5" height="12" fill={RB[4]} opacity="0.8" />
      {/* Bow */}
      <path d="M12.25 9C12.25 9 8 5 9.5 4s4 3 2.75 5Z" fill={RB[0]} opacity="0.9" />
      <path d="M12.25 9C12.25 9 16.5 5 15 4s-4 3-2.75 5Z" fill={RB[5]} opacity="0.9" />
      <circle cx="12.25" cy="9" r="1.5" fill={W} />
    </svg>
  );
}

/** Sparkle — strQ purple/gold */
export function IconSparkle({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={RB[2]}
      />
      <path
        d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z"
        fill={PL}
        opacity="0.7"
      />
    </svg>
  );
}

/** Finish flag — purple checkered */
export function IconFinish({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Pole */}
      <rect x="4" y="3" width="2" height="19" rx="1" fill="rgba(255,255,255,0.3)" />
      {/* Flag */}
      <rect x="6" y="3" width="14" height="10" rx="1" fill={P} />
      {/* Checkered pattern */}
      <rect x="6" y="3" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      <rect x="13" y="3" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      <rect x="9.5" y="5.5" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      <rect x="16.5" y="5.5" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      <rect x="6" y="8" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      <rect x="13" y="8" width="3.5" height="2.5" fill={PL} opacity="0.5" />
      {/* Q ball at bottom of pole */}
      <circle cx="5" cy="21" r="1.5" fill={PL} />
    </svg>
  );
}

/** Profile — Q turtle head silhouette */
export function IconProfile({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <circle cx="12" cy="9" r="5" fill={SK} />
      {/* Aviator glasses */}
      <rect x="8" y="7.5" width="3.5" height="2.5" rx="1" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.1)" />
      <rect x="12.5" y="7.5" width="3.5" height="2.5" rx="1" stroke={W} strokeWidth="0.8" fill="rgba(255,255,255,0.1)" />
      <path d="M11.5 8.75H12.5" stroke={W} strokeWidth="0.6" />
      {/* Body/shell hint */}
      <path
        d="M5 21a7 7 0 0 1 14 0"
        fill={P}
      />
      {/* Rainbow stripe on shell */}
      {RB.map((c, i) => (
        <path
          key={i}
          d={`M${7 + i * 0.3} ${19 - i * 0.5} Q12 ${15 + i * 0.3} ${17 - i * 0.3} ${19 - i * 0.5}`}
          stroke={c}
          strokeWidth="0.6"
          fill="none"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

/** Envelope — purple mail */
export function IconEnvelope({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" fill={P} />
      <path d="M3 7l9 6 9-6" stroke={PL} strokeWidth="1.5" fill="none" />
      <path d="M3 7l9 6 9-6" stroke={W} strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

/** Edit pencil — purple */
export function IconEdit({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
        fill={PL}
        stroke={P}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Delete — subtle */
export function IconDelete({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/** Seedling — green sprout */
export function IconSeedling({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 22V12" stroke={SK} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 12C12 8 8 5 4 5c0 4 3 7 8 7Z"
        fill={SK}
        opacity="0.7"
      />
      <path
        d="M12 15C12 11 16 8 20 8c0 4-3 7-8 7Z"
        fill={SL}
        opacity="0.6"
      />
    </svg>
  );
}

/** Earned Rest — moon cradled in a rainbow ring that fills up */
export function IconEarnedRest({ size = 22, progress = 0, tier = 'locked' }: IconProps & { progress?: number; tier?: string }) {
  // Rainbow arc: progress 0-1 controls how much of the ring is drawn
  const r = 10; // ring radius
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * Math.min(progress, 1);
  const isGlowing = tier === 'charged' || tier === 'supercharged';
  const isFull = tier === 'supercharged';

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="rest-rainbow" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          {RB.map((c, i) => (
            <stop key={i} offset={`${(i / (RB.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
        {isGlowing && (
          <filter id="rest-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Background track */}
      <circle cx="12" cy="12" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />

      {/* Rainbow progress arc */}
      <circle
        cx="12" cy="12" r={r}
        fill="none"
        stroke="url(#rest-rainbow)"
        strokeWidth={isFull ? 3 : 2.5}
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${circumference}`}
        transform="rotate(-90 12 12)"
        filter={isGlowing ? 'url(#rest-glow)' : undefined}
        opacity={progress > 0 ? 1 : 0}
      />

      {/* Moon center */}
      <path
        d="M14.5 8a5 5 0 1 1-5 7 4 4 0 0 0 5-7Z"
        fill={tier === 'locked' ? 'rgba(255,255,255,0.15)' : PL}
        opacity={tier === 'locked' ? 0.6 : 0.85}
      />

      {/* Sparkle dots when supercharged */}
      {isFull && (
        <>
          <circle cx="3" cy="5" r="1" fill={RB[2]} opacity="0.7" />
          <circle cx="21" cy="7" r="0.8" fill={RB[0]} opacity="0.6" />
          <circle cx="19" cy="19" r="1" fill={RB[4]} opacity="0.7" />
          <circle cx="5" cy="18" r="0.8" fill={RB[3]} opacity="0.6" />
        </>
      )}
    </svg>
  );
}

/** Multiplier fire — smaller, for inline use */
export function IconMultiplier({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path
        d="M12 2C12 2 5 9 5 14a7 7 0 0 0 14 0c0-5-7-12-7-12Z"
        fill={RB[1]}
      />
      <path
        d="M12 10c0 0-3 3-3 5.5a3 3 0 0 0 6 0c0-2.5-3-5.5-3-5.5Z"
        fill={RB[2]}
        opacity="0.7"
      />
    </svg>
  );
}
