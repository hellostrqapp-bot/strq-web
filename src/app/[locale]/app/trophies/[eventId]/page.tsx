import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { TrophyDetail } from '@/components/trophies/trophy-detail';
import { isCompletedTrophy, type TrophyEvent } from '@/lib/trophies';

// ═══════════════════════════════════════════════════════════
// strQ, Trophy detail page (server component)
// Loads a single completed event scoped to the signed-in user.
// 404 if the event is missing, not the user's, or not done.
// ═══════════════════════════════════════════════════════════

export default async function TrophyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, user_id, name, sport_type, event_date, target_time_minutes, result_time_minutes, status, created_at'
    )
    .eq('id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const event = data as TrophyEvent;
  if (!isCompletedTrophy(event)) {
    notFound();
  }

  return <TrophyDetail event={event} />;
}
