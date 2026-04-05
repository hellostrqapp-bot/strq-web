-- ============================================================
-- Migration 006: Streak Reminders
-- Tabel om bij te houden welke reminders al verstuurd zijn
-- + pg_cron job die elke 15 minuten draait (09:45-21:49 CEST)
-- ============================================================

-- 1. Reminder log table (prevents duplicate sends)
CREATE TABLE IF NOT EXISTS streak_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_date DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  UNIQUE(user_id, reminder_date)
);

-- RLS: users can see own reminders (for transparency/debugging)
ALTER TABLE streak_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders"
  ON streak_reminders FOR SELECT USING (auth.uid() = user_id);

-- Index for fast lookup by date
CREATE INDEX idx_reminders_date
  ON streak_reminders(reminder_date, user_id);

-- 2. Auto-cleanup: remove reminders older than 30 days (keep table small)
-- Runs daily at 03:00 UTC
SELECT cron.schedule(
  'cleanup-old-reminders',
  '0 3 * * *',
  $$DELETE FROM streak_reminders WHERE reminder_date < CURRENT_DATE - INTERVAL '30 days';$$
);

-- 3. Streak reminder cron: every 15 minutes between 07:45-19:49 UTC (= 09:45-21:49 CEST)
-- pg_cron only supports standard cron syntax, so we run every 15 min
-- and the Edge Function itself checks if it's inside the window.
SELECT cron.schedule(
  'send-streak-reminders',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://nqqidhkbjwatsmexnqgo.supabase.co/functions/v1/send-streak-reminder',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
