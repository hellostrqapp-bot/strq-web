-- ============================================================
-- Migration 012: Ops-cijferteller (alleen totalen)
--
-- Geeft James (de strQ-agent) en Arnoud één getal per meetlat,
-- zonder ooit iets over een individuele strQer prijs te geven.
-- Doel: 1000 strQers op 9 januari 2027 (zie strq-ops/doelen.md).
--
-- Een strQer = account met minstens één ingevulde dag
-- (TRAIN of RUST) in activities.
--
-- Toegang: de functie is aan te roepen met de publieke anon-key,
-- maar weigert zonder de juiste header x-ops-token. Het token zelf
-- staat nergens in de code; alleen de SHA-256-hash staat hieronder.
-- Het token staat als API-credential op de cloudomgeving van James,
-- zodat ook James het niet kan zien.
--
-- 011 is gereserveerd voor de challenge-migratie uit strq-2.0.
-- ============================================================

-- ── Toegangssleutel (alleen de hash) ───────────────────────
CREATE TABLE IF NOT EXISTS ops_access (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  token_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS aan zonder policies: niemand leest deze tabel via de API.
ALTER TABLE ops_access ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ops_access FROM anon, authenticated;

INSERT INTO ops_access (id, token_sha256)
VALUES (1, '7b62d5be1f4633c152db0dedda42f74a9e7ab4f682edc6dfd99a1ab37cdc455e')
ON CONFLICT (id) DO UPDATE
  SET token_sha256 = EXCLUDED.token_sha256, created_at = now();

-- ── Totalen ────────────────────────────────────────────────
-- Security definer: telt over alle rijen heen, maar geeft
-- uitsluitend aantallen terug. Nooit ids, namen of datums per persoon.
CREATE OR REPLACE FUNCTION get_ops_totals()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public AS $$
DECLARE
  v_token TEXT;
BEGIN
  v_token := current_setting('request.headers', true)::json ->> 'x-ops-token';

  IF v_token IS NULL OR NOT EXISTS (
    SELECT 1 FROM ops_access
    WHERE token_sha256 = encode(sha256(convert_to(v_token, 'UTF8')), 'hex')
  ) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object(
    'generated_at',        now(),
    'accounts',            (SELECT count(*) FROM profiles),
    'accounts_new_7d',     (SELECT count(*) FROM profiles
                             WHERE created_at >= now() - interval '7 days'),
    'strqers',             (SELECT count(DISTINCT user_id) FROM activities),
    'strqers_new_7d',      (SELECT count(*) FROM (
                               SELECT user_id FROM activities
                               GROUP BY user_id
                               HAVING min(activity_date) >= current_date - 6
                             ) s),
    'weekly_active',       (SELECT count(DISTINCT user_id) FROM activities
                             WHERE activity_date >= current_date - 6),
    'coop_seasons',        (SELECT count(*) FROM coop_seasons),
    'coop_members_active', (SELECT count(*) FROM coop_members
                             WHERE status = 'active'),
    'coop_invites_used',   (SELECT count(*) FROM coop_invites
                             WHERE used_at IS NOT NULL)
  );
END;
$$;

-- Alleen anon mag aanroepen (de token-check doet de rest).
REVOKE ALL ON FUNCTION get_ops_totals() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION get_ops_totals() FROM authenticated;
GRANT EXECUTE ON FUNCTION get_ops_totals() TO anon;
