-- ============================================================
-- Migration 008: Subscriptions (Stripe-ready)
-- Premium tier for Twin feature (€4,99/mnd)
-- Skeleton: tabel + RLS klaar, Stripe webhook vult de data
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
    -- 'active', 'trialing', 'past_due', 'canceled', 'inactive'
  plan TEXT NOT NULL DEFAULT 'free',
    -- 'free', 'premium'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Only server (service_role) can insert/update via Stripe webhook
-- No user-facing write policies — prevents client-side manipulation

CREATE INDEX idx_subscriptions_stripe_customer
  ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub
  ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_user_status
  ON subscriptions(user_id, status);

-- Auto-create free subscription on profile creation
CREATE OR REPLACE FUNCTION handle_new_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, plan)
  VALUES (NEW.id, 'inactive', 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_subscription failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_profile_subscription
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_subscription();
