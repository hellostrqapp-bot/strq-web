-- ============================================================
-- strQ Unsubscribe — Migration 003
-- Voegt unsubscribe-token en -status toe aan waitlist
-- ============================================================

-- Unsubscribe token: UUID die in de unsubscribe-link komt
-- Zo hoef je geen email-adres in de URL te zetten (privacy)
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT false;

-- Unieke index op token voor snelle lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_unsub_token
  ON waitlist (unsubscribe_token);

-- Bestaande rijen krijgen automatisch een token via DEFAULT

COMMENT ON COLUMN waitlist.unsubscribe_token IS 'Unique token for one-click unsubscribe link (no email in URL)';
COMMENT ON COLUMN waitlist.unsubscribed IS 'True = user opted out of drip emails';
