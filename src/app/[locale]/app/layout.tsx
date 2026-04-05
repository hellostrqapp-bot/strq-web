// ═══════════════════════════════════════════════════════════
// strQ — App Layout (Protected)
// Wraps all authenticated app pages
// Provides auth context and bottom navigation
// ═══════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1A1A2E',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main content area — scrollable */}
      <main style={{ flex: 1, padding: '24px 16px 100px' }}>
        {children}
      </main>

      {/* Bottom navigation — fixed */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          background: 'rgba(26,26,46,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 100,
        }}
      >
        <NavItem href={`/${locale}/app`} icon="🔥" label="Streak" />
        <NavItem href={`/${locale}/app/event`} icon="🏁" label="Event" />
        <NavItem href={`/${locale}/app/profile`} icon="👤" label="Profiel" />
      </nav>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        textDecoration: 'none',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: 600,
        padding: '8px 16px',
        minWidth: 64,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      {label}
    </a>
  );
}
