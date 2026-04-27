"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, localeNames, type Locale } from "@/i18n/config";

// ═══════════════════════════════════════════════════════════
// strQ.app — Landing Page
// Minimaal. Zoals het shirt. Zoals het merk.
// Eén scherm. Eén gevoel. Eén emailveld.
// ═══════════════════════════════════════════════════════════

const P = "#6C3483",
  PL = "#A569BD",
  PD = "#4A235A",
  PM = "#7D3C98";
const SK = "#7BC88C",
  SL = "#A2D8AE",
  SD = "#4F9962";
const BG = "#1A1A2E";
const W = "#FFFFFF";
const RB = ["#E74C3C", "#E67E22", "#F1C40F", "#27AE60", "#2980B9", "#8E44AD"];

// ── Shell component ──
function Shell({
  cx,
  cy,
  rx,
  ry,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry - 4} fill={P} />
      <ellipse
        cx={cx}
        cy={cy - 10}
        rx={rx * 0.48}
        ry={ry * 0.44}
        stroke={PM}
        strokeWidth="1.8"
        fill="none"
        opacity="0.45"
      />
      <line
        x1={cx - rx * 0.35}
        y1={cy - 6}
        x2={cx - rx * 0.7}
        y2={cy + ry * 0.38}
        stroke={PM}
        strokeWidth="1.8"
        opacity="0.35"
      />
      <line
        x1={cx + rx * 0.35}
        y1={cy - 6}
        x2={cx + rx * 0.7}
        y2={cy + ry * 0.38}
        stroke={PM}
        strokeWidth="1.8"
        opacity="0.35"
      />
      <ellipse
        cx={cx - 8}
        cy={cy - 14}
        rx={12}
        ry={8}
        fill={PL}
        opacity="0.12"
      />
      {RB.map((c, i) => (
        <path
          key={i}
          d={`M${cx - rx + 8 + i * 2} ${cy + 2 + i * 2.5} Q${cx} ${cy - 18 + i * 2.5} ${cx + rx - 8 - i * 2} ${cy + 2 + i * 2.5}`}
          stroke={c}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.65"
        />
      ))}
    </g>
  );
}

// ── Glasses component ──
function Glasses({
  cx,
  cy,
  rot,
}: {
  cx: number;
  cy: number;
  rot?: number;
}) {
  const t = rot ? `rotate(${rot} ${cx} ${cy})` : undefined;
  return (
    <g transform={t}>
      <rect
        x={cx - 22}
        y={cy - 8}
        width="20"
        height="15"
        rx="4.5"
        stroke={W}
        strokeWidth="2.6"
        fill="rgba(255,255,255,0.08)"
      />
      <rect
        x={cx + 2}
        y={cy - 8}
        width="20"
        height="15"
        rx="4.5"
        stroke={W}
        strokeWidth="2.6"
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M${cx - 2} ${cy - 2} C${cx - 1} ${cy - 4}, ${cx + 1} ${cy - 4}, ${cx + 2} ${cy - 2}`}
        stroke={W}
        strokeWidth="2"
        fill="none"
      />
      <line
        x1={cx - 22}
        y1={cy - 2}
        x2={cx - 28}
        y2={cy - 4}
        stroke={W}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={cx + 22}
        y1={cy - 2}
        x2={cx + 28}
        y2={cy - 4}
        stroke={W}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

// ── Q Waiting Pose ──
function QWaiting({ size = 160 }: { size?: number }) {
  const h = size * 1.25;
  return (
    <svg width={size} height={h} viewBox="0 0 240 300" fill="none">
      <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
      <path
        d="M106 250 L102 276"
        stroke={SK}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M134 250 L138 276"
        stroke={SK}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <ellipse cx="98" cy="280" rx="11" ry="5.5" fill={SD} />
      <ellipse cx="142" cy="280" rx="11" ry="5.5" fill={SD} />
      <Shell cx={120} cy={204} rx={52} ry={48} />
      <ellipse cx="120" cy="224" rx="26" ry="24" fill={SL} />
      <path
        d="M72 204 C58 216, 60 234, 76 244 C86 252, 100 250, 110 244"
        stroke={SK}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M168 204 C182 216, 180 234, 164 244 C154 252, 140 250, 130 244"
        stroke={SK}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <ellipse cx="114" cy="242" rx="9" ry="7" fill={SD} />
      <ellipse cx="126" cy="242" rx="9" ry="7" fill={SD} />
      {RB.map((c, i) => (
        <rect
          key={i}
          x={60}
          y={218 + i * 3}
          width="8"
          height="2.5"
          rx="1"
          fill={c}
        />
      ))}
      <path
        d="M120 168 L120 154"
        stroke={SK}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <ellipse
        cx="120"
        cy="140"
        rx="28"
        ry="24"
        fill={SK}
        transform="rotate(5 120 140)"
      />
      <circle cx="98" cy="146" r="4.5" fill={SL} opacity="0.35" />
      <circle cx="140" cy="148" r="4.5" fill={SL} opacity="0.35" />
      <Glasses cx={120} cy={136} rot={5} />
      <ellipse cx="109" cy="135" rx="4" ry="5" fill={W} />
      <ellipse cx="131" cy="136" rx="4" ry="5" fill={W} />
      <ellipse cx="110" cy="133.5" rx="2.5" ry="3.2" fill={PD} />
      <ellipse cx="132" cy="134.5" rx="2.5" ry="3.2" fill={PD} />
      <circle cx="111.5" cy="132" r="1.3" fill={W} />
      <circle cx="133.5" cy="133" r="1.3" fill={W} />
      <path
        d="M108 154 C114 162, 128 162, 134 156"
        stroke={PD}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <g opacity="0.45">
        <line
          x1="158"
          y1="112"
          x2="158"
          y2="100"
          stroke={PL}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="152"
          y1="106"
          x2="164"
          y2="106"
          stroke={PL}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="172" cy="120" r="2" fill={PL} />
      </g>
    </svg>
  );
}

// ── Rainbow Divider ──
function Rainbow({ width = 108 }: { width?: number }) {
  const gap = 3;
  const w = (width - gap * 5) / 6;
  return (
    <div style={{ display: "flex", gap, justifyContent: "center" }}>
      {RB.map((c, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: 3,
            background: c,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

// ── Language Selector ──
const localeFlags: Record<string, string> = {
  nl: "\u{1F1F3}\u{1F1F1}",
  en: "\u{1F1EC}\u{1F1E7}",
  fr: "\u{1F1EB}\u{1F1F7}",
  de: "\u{1F1E9}\u{1F1EA}",
  es: "\u{1F1EA}\u{1F1F8}",
  pt: "\u{1F1E7}\u{1F1F7}",
  qu: "\u{1F1F5}\u{1F1EA}",
};

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 24,
        display: "flex",
        gap: 6,
      }}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-label={localeNames[l]}
          style={{
            padding: "5px 10px",
            borderRadius: 8,
            border:
              l === locale
                ? `1.5px solid ${P}`
                : "1.5px solid rgba(255,255,255,0.08)",
            background:
              l === locale ? `${P}22` : "rgba(255,255,255,0.03)",
            color:
              l === locale ? PL : "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontWeight: l === locale ? 700 : 400,
            cursor: "pointer",
            fontFamily: "inherit",
            textTransform: "uppercase",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>{localeFlags[l]}</span>
          {l}
        </button>
      ))}
    </div>
  );
}

// ── UTM helper ──
function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

// ── Flip Tile ──
// Split-flap display: bovenhelft en onderhelft met flip-animatie bij waarde-wissel
function FlipTile({ value }: { value: string }) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== current) {
      setPrevious(current);
      setFlipping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrent(value);
        setFlipping(false);
      }, 450);
    }
  }, [value, current]);

  // Shared number style — positioned absolutely so both halves clip the same text
  const numPos = (top: boolean): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: top ? 0 : "-100%",
    height: "200%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 900,
    color: W,
    textShadow: `0 0 10px ${PL}33`,
    fontFamily: "'Inter', -apple-system, sans-serif",
    letterSpacing: "-0.02em",
  });

  const halfClip: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: "50%",
    overflow: "hidden",
  };

  return (
    <div style={{
      position: "relative",
      width: 56,
      height: 64,
      perspective: 300,
    }}>
      {/* ── Static top half: current value ── */}
      <div style={{
        ...halfClip,
        top: 0,
        background: "rgba(108,52,131,0.20)",
        borderRadius: "10px 10px 0 0",
      }}>
        <div style={numPos(true)}>{current}</div>
      </div>

      {/* ── Static bottom half: current value ── */}
      <div style={{
        ...halfClip,
        bottom: 0,
        background: "rgba(88,38,112,0.18)",
        borderRadius: "0 0 10px 10px",
      }}>
        <div style={numPos(false)}>{current}</div>
      </div>

      {/* ── Center line ── */}
      <div style={{
        position: "absolute",
        left: 2, right: 2,
        top: "50%",
        height: 1,
        background: "rgba(0,0,0,0.3)",
        zIndex: 5,
      }} />

      {/* ── Flipping top half: OLD value folds down ── */}
      {flipping && (
        <div style={{
          ...halfClip,
          top: 0,
          background: "rgba(108,52,131,0.20)",
          borderRadius: "10px 10px 0 0",
          transformOrigin: "bottom center",
          animation: "flip-top 0.45s ease-in forwards",
          zIndex: 4,
          backfaceVisibility: "hidden",
        }}>
          <div style={numPos(true)}>{previous}</div>
        </div>
      )}

      {/* ── Flipping bottom half: NEW value unfolds up ── */}
      {flipping && (
        <div style={{
          ...halfClip,
          bottom: 0,
          background: "rgba(88,38,112,0.18)",
          borderRadius: "0 0 10px 10px",
          transformOrigin: "top center",
          animation: "flip-bottom 0.45s 0.15s ease-out forwards",
          zIndex: 3,
          transform: "rotateX(90deg)",
          backfaceVisibility: "hidden",
        }}>
          <div style={numPos(false)}>{value}</div>
        </div>
      )}

      {/* Border glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: 10,
        border: "1px solid rgba(165,105,189,0.18)",
        pointerEvents: "none",
        animation: "countdown-glow 4s ease-in-out infinite",
        zIndex: 6,
      }} />
    </div>
  );
}

// ── Launch Countdown ──
// Target: 23 april 2026, 11:00 CET (Hyrox Paris)
const LAUNCH_DATE = new Date("2026-04-23T11:00:00+02:00");

function LaunchCountdown({ t }: { t: (key: string) => string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, LAUNCH_DATE.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (diff <= 0) return null;

  const blocks = [
    { value: days, label: t("countdown.days") },
    { value: hours, label: t("countdown.hours") },
    { value: minutes, label: t("countdown.minutes") },
    { value: seconds, label: t("countdown.seconds") },
  ];

  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <style>{`
        @keyframes flip-top {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flip-bottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        {t("countdown.launching_in")}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {blocks.map(({ value, label }, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FlipTile value={String(value).padStart(2, "0")} />
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                marginTop: 8,
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          color: PL,
          fontSize: 12,
          fontWeight: 500,
          marginTop: 14,
          opacity: 0.7,
        }}
      >
        {t("countdown.event_name")}
      </div>
    </div>
  );
}

// ── Main Landing Page ──
export default function Landing() {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sport, setSport] = useState("none");
  const [referral, setReferral] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [show, setShow] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Detect Supabase auth errors in hash fragment (e.g. expired magic link)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const errorCode = params.get("error_code");
      if (errorCode) {
        setAuthError(errorCode);
        // Clean up the URL hash
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Stap 1: email valideren en naar stap 2
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStep(2);
  };

  // Stap 2: alles versturen (of skip)
  const submitAll = async (skip = false) => {
    setState("loading");
    const utm = getUtmParams();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sport: skip ? undefined : sport,
          referral_source: skip ? undefined : referral || undefined,
          ...utm,
        }),
      });
      if (res.ok) {
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes wig { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(2deg); } 75% { transform: rotate(-2deg); } }
        @keyframes glow { 0%,100% { opacity: 0.08; } 50% { opacity: 0.14; } }
        @keyframes landing-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          40% { opacity: 0.7; transform: scale(1.1); }
          60% { opacity: 0.4; transform: scale(0.9); }
        }
        @keyframes landing-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes countdown-glow {
          0%, 100% { border-color: rgba(165,105,189,0.15); box-shadow: none; }
          50% { border-color: rgba(165,105,189,0.25); box-shadow: 0 0 12px rgba(108,52,131,0.2); }
        }
        @keyframes rainbow-landing-shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 2px 12px rgba(108,52,131,0.3); }
          50% { box-shadow: 0 4px 20px rgba(108,52,131,0.5), 0 0 30px rgba(108,52,131,0.15); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${P}88; color: white; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { border-color: ${P} !important; box-shadow: 0 0 0 3px ${P}33; outline: none; }
      `}</style>

      <LanguageSwitcher />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${P}10, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          animation: "glow 6s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          maxWidth: 400,
          width: "100%",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
        }}
      >
        {/* Q — waiting pose with sparkles */}
        <div
          style={{
            animation: "wig 3s ease-in-out infinite",
            marginBottom: 28,
            position: "relative",
          }}
        >
          <QWaiting size={140} />
          {/* Floating sparkle particles around Q */}
          {[
            { x: -12, y: 20, d: 0, c: PL },
            { x: 85, y: 12, d: 0.8, c: W },
            { x: 92, y: 55, d: 1.6, c: PL },
            { x: -8, y: 70, d: 2.4, c: SK },
            { x: 50, y: -4, d: 3.2, c: W },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: s.c,
              animation: `landing-sparkle 4s ease-in-out ${s.d}s infinite`,
              pointerEvents: "none",
            }} />
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: 17,
            lineHeight: 1.7,
            textAlign: "center",
            marginBottom: 36,
            maxWidth: 340,
            fontWeight: 400,
          }}
        >
          {t("hero.tagline")}
          <br />
          {t("hero.subtitle")}
        </p>

        {/* strQ.app wordmark */}
        <div style={{ textAlign: "center", marginBottom: 6, position: "relative" }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: W,
              letterSpacing: 1,
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            str
            <span style={{
              color: PL,
              fontSize: 38,
              fontWeight: 900,
              textShadow: `0 0 12px ${PL}88, 0 0 28px ${PL}55, 0 0 50px ${P}33`,
            }}>
              Q
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontWeight: 600,
              }}
            >
              .app
            </span>
          </span>
        </div>

        {/* Rainbow with shimmer */}
        <div style={{ marginBottom: 28, position: "relative", overflow: "hidden", borderRadius: 3 }}>
          <Rainbow width={108} />
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            animation: "rainbow-landing-shimmer 5s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        </div>

        {/* About strQ — short product description (also satisfies Apple Developer review) */}
        <section
          aria-labelledby="about-strq-heading"
          style={{
            maxWidth: 360,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          <h2
            id="about-strq-heading"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {t("about.heading")}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            {t("about.intro")}
          </p>
        </section>

        {/* Launch Countdown */}
        <LaunchCountdown t={t} />

        {/* Auth error banner (e.g. expired magic link) */}
        {authError && (
          <div
            style={{
              width: "100%",
              background: "rgba(231,76,60,0.08)",
              border: "1.5px solid rgba(231,76,60,0.25)",
              borderRadius: 12,
              padding: "20px 20px",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#E74C3C",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {t("auth_error.title")}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {t("auth_error.description")}
            </p>
            <a
              href={`/${locale}/login`}
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: 8,
                background: P,
                color: W,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              {t("auth_error.cta")}
            </a>
          </div>
        )}

        {/* Waitlist form or confirmation */}
        {state === "done" ? (
          <div
            style={{
              textAlign: "center",
              opacity: 1,
              transition: "opacity 0.6s ease-out",
            }}
          >
            <div
              style={{
                color: W,
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 6,
              }}
            >
              {t("waitlist.success")}
            </div>
          </div>
        ) : step === 1 ? (
          <form
            onSubmit={handleEmailSubmit}
            style={{ display: "flex", gap: 8, width: "100%" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("waitlist.placeholder")}
              style={{
                flex: 1,
                padding: "13px 16px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: W,
                fontSize: 15,
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "13px 22px",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${P}, ${PM})`,
                color: W,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                animation: "cta-glow 3s ease-in-out infinite",
                transition: "transform 0.15s ease",
              }}
            >
              {t("waitlist.button")}
            </button>
          </form>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: 1,
              transition: "opacity 0.4s ease-out",
            }}
          >
            {/* Sport dropdown */}
            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("waitlist.sport_label")}
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: W,
                  fontSize: 15,
                  fontFamily: "inherit",
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="none" style={{ background: BG }}>{t("waitlist.sport_options.none")}</option>
                <option value="hyrox" style={{ background: BG }}>{t("waitlist.sport_options.hyrox")}</option>
                <option value="running" style={{ background: BG }}>{t("waitlist.sport_options.running")}</option>
                <option value="triathlon" style={{ background: BG }}>{t("waitlist.sport_options.triathlon")}</option>
                <option value="cycling" style={{ background: BG }}>{t("waitlist.sport_options.cycling")}</option>
                <option value="other" style={{ background: BG }}>{t("waitlist.sport_options.other")}</option>
              </select>
            </div>

            {/* Referral input */}
            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("waitlist.referral_label")}
              </label>
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                placeholder={t("waitlist.referral_placeholder")}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: W,
                  fontSize: 15,
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={() => submitAll(true)}
                disabled={state === "loading"}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t("waitlist.skip")}
              </button>
              <button
                onClick={() => submitAll(false)}
                disabled={state === "loading"}
                style={{
                  flex: 2,
                  padding: "12px 22px",
                  borderRadius: 12,
                  border: "none",
                  background: P,
                  color: W,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: state === "loading" ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {state === "loading" ? "..." : t("waitlist.send")}
              </button>
            </div>
          </div>
        )}

        {state === "error" && (
          <p
            style={{
              color: "#E74C3C",
              fontSize: 13,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {t("waitlist.error")}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 48,
            textAlign: "center",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          <a
            href={`/${locale}/login`}
            style={{
              color: "rgba(165,105,189,0.5)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#A569BD")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(165,105,189,0.5)")}
          >
            {t("footer.login")}
          </a>
          <div style={{ marginTop: 16, color: "rgba(255,255,255,0.12)" }}>
            {t("footer.privacy")}
            <br />
            <a
              href={`/${locale}/privacy`}
              style={{
                color: "rgba(165,105,189,0.45)",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A569BD")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(165,105,189,0.45)")}
            >
              {t("footer.privacy_link")}
            </a>
            <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.1)" }}>·</span>
            <a
              href={`/${locale}/transparency`}
              style={{
                color: "rgba(165,105,189,0.45)",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A569BD")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(165,105,189,0.45)")}
            >
              {t("footer.transparency_link")}
            </a>
            <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.1)" }}>·</span>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>

          {/* Legal entity (Kok Confidential B.V.) — required for Apple Developer org-website check */}
          <address
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.32)",
              fontSize: 11,
              lineHeight: 1.6,
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            <div>{t("footer.legal_entity")}</div>
            <div>{t("footer.legal_kvk")}</div>
            <div style={{ marginTop: 4 }}>
              {t("footer.legal_contact").replace(/arnoud@cvp-plus\.nl/, "")}
              <a
                href="mailto:arnoud@cvp-plus.nl"
                style={{
                  color: "rgba(165,105,189,0.55)",
                  textDecoration: "none",
                }}
              >
                arnoud@cvp-plus.nl
              </a>
            </div>
          </address>
        </div>
      </div>
    </div>
  );
}
