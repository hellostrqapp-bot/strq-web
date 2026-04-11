// ═══════════════════════════════════════════════════════════
// strQ — Subscription Helpers
// Server-side premium check for gating Twin features
// ═══════════════════════════════════════════════════════════

import { createServerClient } from './supabase-server';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'inactive';

export interface SubscriptionInfo {
  isPremium: boolean;
  status: SubscriptionStatus;
  plan: 'free' | 'premium';
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Check if the current user has an active premium subscription.
 * Returns a full SubscriptionInfo object for UI flexibility.
 *
 * Usage in server components:
 *   const sub = await getSubscription();
 *   if (sub.isPremium) { // show Twin }
 *
 * Usage in API routes:
 *   const sub = await getSubscription(userId);
 *   if (!sub.isPremium) return Response.json({ error: 'premium_required' }, { status: 403 });
 */
export async function getSubscription(
  userId?: string
): Promise<SubscriptionInfo> {
  const FREE: SubscriptionInfo = {
    isPremium: false,
    status: 'inactive',
    plan: 'free',
    periodEnd: null,
    cancelAtPeriodEnd: false,
  };

  try {
    const supabase = await createServerClient();

    // If no userId provided, get from current session
    let uid = userId;
    if (!uid) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      uid = user?.id;
    }

    if (!uid) return FREE;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, plan, current_period_end, cancel_at_period_end')
      .eq('user_id', uid)
      .single();

    if (error || !data) return FREE;

    const isActive =
      data.status === 'active' || data.status === 'trialing';

    return {
      isPremium: isActive && data.plan === 'premium',
      status: data.status as SubscriptionStatus,
      plan: data.plan as 'free' | 'premium',
      periodEnd: data.current_period_end,
      cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
    };
  } catch {
    // Fail open — don't block users if subscription check fails
    return FREE;
  }
}

/**
 * Quick boolean check — convenience wrapper.
 */
export async function isPremium(userId?: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub.isPremium;
}
