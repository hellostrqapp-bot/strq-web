// ═══════════════════════════════════════════════════════════
// strQ — Stripe Configuration
// Skeleton for Twin premium paywall (€4,99/mnd)
// Requires: STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET env vars
// ═══════════════════════════════════════════════════════════

// Will be initialized when Stripe keys are configured:
// import Stripe from 'stripe';
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-12-18.acacia',
//   typescript: true,
// });

/** Price ID for the Twin premium plan — set in Stripe Dashboard */
export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID ?? '';

/** Monthly price in euros */
export const PREMIUM_PRICE_EUR = 4.99;

/** Features unlocked by premium */
export const PREMIUM_FEATURES = [
  'twin',           // Race Twin digital avatar
  'twin_insights',  // Twin performance predictions
  'twin_history',   // Twin evolution timeline
] as const;

export type PremiumFeature = (typeof PREMIUM_FEATURES)[number];

/**
 * Check if a feature requires premium.
 * Single source of truth — used by both server and client.
 */
export function requiresPremium(feature: string): boolean {
  return (PREMIUM_FEATURES as readonly string[]).includes(feature);
}
