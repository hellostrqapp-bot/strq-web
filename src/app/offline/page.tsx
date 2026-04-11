// ═══════════════════════════════════════════════════════════
// strQ — Offline fallback page
// Shown when the user has no network connection.
// ═══════════════════════════════════════════════════════════

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A1A2E',
        color: '#A569BD',
        fontFamily: 'system-ui, sans-serif',
        padding: 24,
        textAlign: 'center',
      }}
    >
      {/* Q with closed eyes — offline zen */}
      <svg width="80" height="100" viewBox="0 0 240 300" fill="none" style={{ marginBottom: 24 }}>
        <ellipse cx="120" cy="290" rx="36" ry="5" fill="rgba(0,0,0,0.14)" />
        <path d="M106 250 L100 276" stroke="#7BC88C" strokeWidth="15" strokeLinecap="round" />
        <path d="M134 250 L140 276" stroke="#7BC88C" strokeWidth="15" strokeLinecap="round" />
        <ellipse cx="96" cy="280" rx="11" ry="5.5" fill="#4F9962" />
        <ellipse cx="144" cy="280" rx="11" ry="5.5" fill="#4F9962" />
        <ellipse cx="120" cy="204" rx="52" ry="44" fill="#6C3483" />
        {['#E74C3C', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'].map((c, i) => (
          <path key={i} d={`M${68 + i * 2} ${206 + i * 2.5} Q120 ${186 + i * 2.5} ${172 - i * 2} ${206 + i * 2.5}`} stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        ))}
        <ellipse cx="120" cy="224" rx="26" ry="24" fill="#A2D8AE" />
        <path d="M72 204 C60 218, 58 240, 66 254" stroke="#7BC88C" strokeWidth="12" strokeLinecap="round" />
        <path d="M168 204 C180 218, 182 240, 174 254" stroke="#7BC88C" strokeWidth="12" strokeLinecap="round" />
        <path d="M120 168 L118 154" stroke="#7BC88C" strokeWidth="14" strokeLinecap="round" />
        <ellipse cx="118" cy="140" rx="28" ry="24" fill="#7BC88C" />
        <path d="M103 132 C106 128, 112 128, 115 132" stroke="#4A235A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M123 133 C126 129, 132 129, 135 133" stroke="#4A235A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M108 150 C114 158, 124 158, 130 150" stroke="#4A235A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="150" y="120" fill="#A569BD" fontSize="18" fontWeight="800" fontFamily="sans-serif" opacity="0.6">z</text>
        <text x="162" y="105" fill="#A569BD" fontSize="14" fontWeight="800" fontFamily="sans-serif" opacity="0.45">z</text>
      </svg>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
        Geen verbinding
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 280, lineHeight: 1.5 }}>
        Q wacht geduldig. Zodra je weer online bent, laden we je streak.
      </p>
    </div>
  );
}
