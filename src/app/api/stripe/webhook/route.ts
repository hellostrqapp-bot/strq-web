// ═══════════════════════════════════════════════════════════
// strQ — Stripe Webhook Handler (Skeleton)
// Handles subscription lifecycle events from Stripe.
// Activate when STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are set.
// ═══════════════════════════════════════════════════════════
//
// To activate:
// 1. npm install stripe
// 2. Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET in .env.local + Vercel
// 3. Uncomment the Stripe imports and handler below
// 4. Create product + price in Stripe Dashboard
// 5. Set up webhook endpoint: https://strq.app/api/stripe/webhook
//    Events: checkout.session.completed, customer.subscription.updated,
//            customer.subscription.deleted
//
// Privacy note: we only store Stripe IDs and subscription status.
// No payment details, card info, or billing addresses are stored.
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { createClient } from '@supabase/supabase-js';

// Service role client — bypasses RLS for webhook updates
// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// );

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-12-18.acacia',
// });

export async function POST(req: NextRequest) {
  // ── Stripe not configured yet ──────────────────────────
  // Return 200 so Stripe CLI doesn't retry during development
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 200 }
    );
  }

  // ── Verify webhook signature ──────────────────────────
  // const body = await req.text();
  // const sig = req.headers.get('stripe-signature')!;
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     body,
  //     sig,
  //     process.env.STRIPE_WEBHOOK_SECRET!
  //   );
  // } catch (err) {
  //   console.error('[strQ] Webhook signature verification failed:', err);
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  // }

  // ── Handle events ─────────────────────────────────────
  // switch (event.type) {
  //   case 'checkout.session.completed': {
  //     const session = event.data.object as Stripe.Checkout.Session;
  //     const userId = session.metadata?.user_id;
  //     if (!userId) break;
  //
  //     await supabaseAdmin.from('subscriptions').upsert({
  //       user_id: userId,
  //       stripe_customer_id: session.customer as string,
  //       stripe_subscription_id: session.subscription as string,
  //       status: 'active',
  //       plan: 'premium',
  //       updated_at: new Date().toISOString(),
  //     }, { onConflict: 'user_id' });
  //     break;
  //   }
  //
  //   case 'customer.subscription.updated': {
  //     const sub = event.data.object as Stripe.Subscription;
  //     await supabaseAdmin.from('subscriptions').update({
  //       status: sub.status,
  //       current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
  //       current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
  //       cancel_at_period_end: sub.cancel_at_period_end,
  //       updated_at: new Date().toISOString(),
  //     }).eq('stripe_subscription_id', sub.id);
  //     break;
  //   }
  //
  //   case 'customer.subscription.deleted': {
  //     const sub = event.data.object as Stripe.Subscription;
  //     await supabaseAdmin.from('subscriptions').update({
  //       status: 'canceled',
  //       plan: 'free',
  //       cancel_at_period_end: false,
  //       updated_at: new Date().toISOString(),
  //     }).eq('stripe_subscription_id', sub.id);
  //     break;
  //   }
  // }

  return NextResponse.json({ received: true });
}
