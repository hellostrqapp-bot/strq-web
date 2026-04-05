-- ============================================================
-- strQ Waitlist Enrichment — Migration 002
-- Voegt sport, referral en UTM tracking toe aan waitlist tabel
-- ============================================================

-- Nieuwe kolommen toevoegen
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS sport TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS referral_source TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT NULL;

-- Index op sport voor snelle aggregaties
CREATE INDEX IF NOT EXISTS idx_waitlist_sport ON waitlist (sport);

-- Index op utm_source voor marketing analyse
CREATE INDEX IF NOT EXISTS idx_waitlist_utm_source ON waitlist (utm_source);

-- Index op created_at voor tijdreeksen
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at);

-- Commentaar voor documentatie
COMMENT ON COLUMN waitlist.sport IS 'Sport type: hyrox, running, triathlon, cycling, other';
COMMENT ON COLUMN waitlist.referral_source IS 'Hoe hoorde je over strQ? Vrij tekstveld';
COMMENT ON COLUMN waitlist.utm_source IS 'UTM source parameter uit URL (bijv. instagram, linkedin)';
COMMENT ON COLUMN waitlist.utm_medium IS 'UTM medium parameter (bijv. social, email, organic)';
COMMENT ON COLUMN waitlist.utm_campaign IS 'UTM campaign parameter (bijv. launch-apr-2026)';

-- RLS policy updaten: anon mag ook de nieuwe kolommen inserten
-- (bestaande INSERT policy dekt dit al met WITH CHECK (true))

-- ============================================================
-- Drip email log tabel — voorkomt dubbele drip-mails
-- ============================================================

CREATE TABLE IF NOT EXISTS drip_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  drip_day INT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, drip_day)
);

ALTER TABLE drip_log ENABLE ROW LEVEL SECURITY;

-- Alleen service_role mag schrijven (Edge Functions)
CREATE POLICY "Service role only" ON drip_log
  FOR ALL USING (auth.role() = 'service_role');
