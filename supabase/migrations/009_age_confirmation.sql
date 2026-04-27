-- ════════════════════════════════════════════════════════════
-- Migration 009: Age confirmation (16+) for public launch
-- Stores when each user confirmed they are at least 16 years old.
-- Required by DPIA (minimum age 16). Confirmed at every login until
-- the user has age_confirmed_at set; thereafter the timestamp stays.
-- ════════════════════════════════════════════════════════════

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS age_confirmed_at TIMESTAMPTZ;

COMMENT ON COLUMN profiles.age_confirmed_at IS
  'First moment the user actively confirmed they are 16+. NULL means never confirmed (legacy users from beta).';
