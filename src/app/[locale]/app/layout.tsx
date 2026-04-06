// ═══════════════════════════════════════════════════════════
// strQ — App Layout (Protected)
// Wraps all authenticated app pages
// Provides auth context and bottom navigation
// ═══════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { BottomNav } from '@/components/bottom-nav';

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
      <BottomNav locale={locale} />
    </div>
  );
}
