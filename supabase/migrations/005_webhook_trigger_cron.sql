-- ============================================================
-- Migration 005: Webhook trigger + Cron schedule
-- Trigger op waitlist INSERT → send-welcome-email Edge Function
-- Cron job voor dagelijkse drip emails
-- ============================================================

-- 1. Enable pg_net for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Trigger function: call send-welcome-email Edge Function
CREATE OR REPLACE FUNCTION notify_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://nqqidhkbjwatsmexnqgo.supabase.co/functions/v1/send-welcome-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'waitlist',
      'record', jsonb_build_object(
        'email', NEW.email,
        'locale', COALESCE(NEW.locale, 'nl'),
        'sport', NEW.sport,
        'unsubscribe_token', NEW.unsubscribe_token
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger on waitlist INSERT
DROP TRIGGER IF EXISTS on_waitlist_insert ON waitlist;
CREATE TRIGGER on_waitlist_insert
  AFTER INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION notify_welcome_email();

-- 4. Enable pg_cron for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 5. Daily drip email cron at 09:00 UTC (= 11:00 CEST)
SELECT cron.schedule(
  'send-drip-emails-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://nqqidhkbjwatsmexnqgo.supabase.co/functions/v1/send-drip-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
