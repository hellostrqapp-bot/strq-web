-- ============================================================
-- Migration 007: Scale Preparation
-- Fixes voor schaalbaarheid voordat we meer testers toevoegen:
-- 1. Ontbrekende RLS INSERT policy op streak_reminders
-- 2. Index op drip_log.email voor snellere batch lookups
-- 3. View auth_user_emails zodat Edge Functions emails in
--    batch kunnen opvragen i.p.v. N+1 getUserById calls
-- ============================================================

-- 1. streak_reminders: INSERT policy voor service_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'streak_reminders' AND policyname = 'Service can insert reminders'
  ) THEN
    CREATE POLICY "Service can insert reminders"
      ON public.streak_reminders FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- 2. drip_log: index op email voor snellere IN() queries
CREATE INDEX IF NOT EXISTS idx_drip_log_email
  ON public.drip_log(email);

-- 3. View voor batch email lookups vanuit Edge Functions
CREATE OR REPLACE VIEW public.auth_user_emails AS
  SELECT au.id, au.email
  FROM auth.users AS au;

REVOKE ALL
  ON public.auth_user_emails
  FROM anon, authenticated;

GRANT SELECT
  ON public.auth_user_emails
  TO service_role;
