-- ============================================================
-- Migration 007: Scale Preparation
-- Fixes voor schaalbaarheid voordat we meer testers toevoegen:
-- 1. Ontbrekende RLS INSERT policy op streak_reminders
-- 2. Index op drip_log.email voor snellere batch lookups
-- 3. View auth_user_emails zodat Edge Functions emails in
--    batch kunnen opvragen i.p.v. N+1 getUserById calls
-- ============================================================

-- 1. streak_reminders: Edge Function (service_role) doet INSERT,
--    maar we voegen ook een user-facing INSERT policy toe voor
--    correctheid. DELETE policy voor cleanup.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'streak_reminders' AND policyname = 'Service can insert reminders'
  ) THEN
    CREATE POLICY "Service can insert reminders"
      ON streak_reminders FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- 2. drip_log: index op email voor snellere IN() queries
-- (wordt sequential scan zonder bij 10k+ waitlist entries)
CREATE INDEX IF NOT EXISTS idx_drip_log_email
  ON drip_log(email);

-- 3. View voor batch email lookups vanuit Edge Functions
-- Service role kan hier direct op queryen i.p.v. per-user auth.admin calls
CREATE OR REPLACE VIEW auth_user_emails AS
  SELECT id, email
  FROM auth.users;

-- Alleen service_role mag deze view lezen
REVOKE ALL ON auth_user_emails FROM anon, authenticated;
GRANT SELECT ON auth_user_emails TO service_role;
