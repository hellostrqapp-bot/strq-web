-- ============================================================
-- Migration 010: Co-op gezamenlijk doel
-- Sociale laag binnen model A. Een groep van 2 tot 6 vrienden
-- werkt samen toe naar een seizoensdoel met een einddatum.
--
-- Privacy by design:
--   We slaan GEEN nieuwe persoonsdata op. Bijdragen worden
--   afgeleid uit de bestaande activities-tabel, binnen de
--   seizoensperiode. We bewaren alleen de groepsstructuur.
--   Medeleden zien nooit elkaars activity-rijen, sport,
--   intensiteit, tijden of locatie. Alleen kleur, naam,
--   aantal bewogen-dagen en of iemand vandaag bewoog.
--
-- Co-op, geen wedstrijd:
--   Telling is gepoold (alle bewogen-dagen tellen op tot een
--   gezamenlijk totaal). Bijdrage is per kleur zichtbaar.
--   Geen ranglijst. Geen breekpunt. Wie rust telt die dag
--   gewoon niet mee, zonder straf.
-- ============================================================

-- ── Constants als CHECK ────────────────────────────────────
-- Zes vaste regenboogkleuren, een per lid. Max zes leden.
-- color: red | orange | green | teal | blue | purple

-- ── Seasons ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coop_seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  goal_days INT NOT NULL CHECK (goal_days > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  linked_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  -- SET NULL: als de maker zijn account verwijdert, blijft het seizoen
  -- bestaan voor de andere leden. Zijn lidmaatschap verdwijnt wel (cascade op coop_members).
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
    -- 'active' | 'completed' | 'archived'
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (end_date >= start_date)
);

ALTER TABLE coop_seasons ENABLE ROW LEVEL SECURITY;

-- ── Members ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coop_members (
  season_id UUID REFERENCES coop_seasons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('red','orange','green','teal','blue','purple')),
  display_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
    -- 'active' | 'left'
  PRIMARY KEY (season_id, user_id),
  UNIQUE (season_id, color)
);

ALTER TABLE coop_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_coop_members_user
  ON coop_members(user_id) WHERE status = 'active';

-- ── Invites ────────────────────────────────────────────────
-- Eén deelbare link per seizoen, herbruikbaar tot de capaciteit
-- vol is of de link verloopt. De groepsapp-link, geen mail nodig.
CREATE TABLE IF NOT EXISTS coop_invites (
  token TEXT PRIMARY KEY,
  season_id UUID REFERENCES coop_seasons(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coop_invites ENABLE ROW LEVEL SECURITY;

-- ── Membership helper (security definer, breekt RLS-recursie) ─
-- coop_seasons en coop_members verwijzen in hun RLS naar
-- coop_members. Een gewone subquery zou oneindige recursie geven.
-- Deze functie omzeilt RLS, dus de policies kunnen 'm veilig
-- aanroepen.
CREATE OR REPLACE FUNCTION is_coop_member(p_season UUID, p_user UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM coop_members m
    WHERE m.season_id = p_season
      AND m.user_id = p_user
      AND m.status = 'active'
  );
$$;

-- ── RLS policies ───────────────────────────────────────────
-- Lezen mag alleen voor leden. Schrijven gaat uitsluitend via de
-- security-definer RPCs hieronder, dus er zijn bewust geen
-- INSERT/UPDATE/DELETE policies (default deny).
DROP POLICY IF EXISTS "Members can view own seasons" ON coop_seasons;
CREATE POLICY "Members can view own seasons"
  ON coop_seasons FOR SELECT
  USING (is_coop_member(id, auth.uid()));

DROP POLICY IF EXISTS "Members can view co-members" ON coop_members;
CREATE POLICY "Members can view co-members"
  ON coop_members FOR SELECT
  USING (is_coop_member(season_id, auth.uid()));

-- coop_invites: geen directe SELECT. Toegang loopt via get_coop_invite
-- met het token zelf, zodat niemand de lijst kan opvragen.

-- ── RPC: seizoen aanmaken ──────────────────────────────────
CREATE OR REPLACE FUNCTION create_coop_season(
  p_name TEXT,
  p_goal_days INT,
  p_start DATE,
  p_end DATE,
  p_color TEXT,
  p_display_name TEXT,
  p_linked_event UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_season UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_goal_days IS NULL OR p_goal_days <= 0 THEN
    RAISE EXCEPTION 'invalid_goal';
  END IF;
  IF p_end < p_start THEN
    RAISE EXCEPTION 'invalid_dates';
  END IF;
  IF p_color NOT IN ('red','orange','green','teal','blue','purple') THEN
    RAISE EXCEPTION 'invalid_color';
  END IF;

  INSERT INTO coop_seasons (name, goal_days, start_date, end_date, linked_event_id, created_by)
  VALUES (trim(p_name), p_goal_days, p_start, p_end, p_linked_event, v_uid)
  RETURNING id INTO v_season;

  INSERT INTO coop_members (season_id, user_id, color, display_name)
  VALUES (v_season, v_uid, p_color, COALESCE(NULLIF(trim(p_display_name), ''), 'Q'));

  RETURN v_season;
END;
$$;

-- ── RPC: invite-link maken ─────────────────────────────────
CREATE OR REPLACE FUNCTION create_coop_invite(p_season UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_token TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF NOT is_coop_member(p_season, v_uid) THEN
    RAISE EXCEPTION 'not_a_member';
  END IF;

  -- Hergebruik een bestaande, nog geldige link als die er is
  SELECT token INTO v_token
  FROM coop_invites
  WHERE season_id = p_season
    AND used_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_token IS NOT NULL THEN
    RETURN v_token;
  END IF;

  v_token := replace(gen_random_uuid()::text, '-', '');
  INSERT INTO coop_invites (token, season_id, invited_by, expires_at)
  VALUES (v_token, p_season, v_uid, now() + interval '14 days');

  RETURN v_token;
END;
$$;

-- ── RPC: invite-preview voor de join-pagina ────────────────
-- Geen lidmaatschap nodig: wie het token heeft mag de preview
-- zien. Geeft alleen seizoensmeta en de al bezette kleuren.
CREATE OR REPLACE FUNCTION get_coop_invite(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_season coop_seasons%ROWTYPE;
  v_member_count INT;
  v_taken TEXT[];
  v_already BOOLEAN;
  v_uid UUID := auth.uid();
BEGIN
  SELECT s.* INTO v_season
  FROM coop_invites i
  JOIN coop_seasons s ON s.id = i.season_id
  WHERE i.token = p_token
    AND i.used_at IS NULL
    AND i.expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  SELECT count(*), array_agg(color)
  INTO v_member_count, v_taken
  FROM coop_members
  WHERE season_id = v_season.id AND status = 'active';

  v_already := v_uid IS NOT NULL AND is_coop_member(v_season.id, v_uid);

  RETURN jsonb_build_object(
    'valid', true,
    'season_id', v_season.id,
    'name', v_season.name,
    'goal_days', v_season.goal_days,
    'start_date', v_season.start_date,
    'end_date', v_season.end_date,
    'status', v_season.status,
    'member_count', v_member_count,
    'taken_colors', COALESCE(v_taken, ARRAY[]::TEXT[]),
    'is_full', v_member_count >= 6,
    'already_member', v_already
  );
END;
$$;

-- ── RPC: seizoen joinen ────────────────────────────────────
CREATE OR REPLACE FUNCTION join_coop_season(
  p_token TEXT,
  p_color TEXT,
  p_display_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_season UUID;
  v_count INT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT season_id INTO v_season
  FROM coop_invites
  WHERE token = p_token
    AND used_at IS NULL
    AND expires_at > now();

  IF v_season IS NULL THEN
    RAISE EXCEPTION 'invalid_invite';
  END IF;

  -- Al lid? Geef gewoon het seizoen terug, geen dubbele rij.
  IF is_coop_member(v_season, v_uid) THEN
    RETURN v_season;
  END IF;

  SELECT count(*) INTO v_count
  FROM coop_members WHERE season_id = v_season AND status = 'active';
  IF v_count >= 6 THEN
    RAISE EXCEPTION 'season_full';
  END IF;

  IF p_color NOT IN ('red','orange','green','teal','blue','purple') THEN
    RAISE EXCEPTION 'invalid_color';
  END IF;
  IF EXISTS (
    SELECT 1 FROM coop_members
    WHERE season_id = v_season AND color = p_color AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'color_taken';
  END IF;

  INSERT INTO coop_members (season_id, user_id, color, display_name)
  VALUES (v_season, v_uid, p_color, COALESCE(NULLIF(trim(p_display_name), ''), 'Q'));

  RETURN v_season;
END;
$$;

-- ── RPC: mijn seizoenen ────────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_coop_seasons()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_result JSONB;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.created_at DESC), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      s.id,
      s.name,
      s.goal_days,
      s.start_date,
      s.end_date,
      s.status,
      s.created_at,
      GREATEST(0, (s.end_date - CURRENT_DATE)) AS days_left,
      (
        SELECT count(DISTINCT a.activity_date)
        FROM coop_members m2
        JOIN activities a
          ON a.user_id = m2.user_id
         AND a.activity_type = 'training'
         AND a.activity_date BETWEEN s.start_date AND s.end_date
        WHERE m2.season_id = s.id AND m2.status = 'active'
      ) AS pooled_total,
      (
        SELECT count(*) FROM coop_members m3
        WHERE m3.season_id = s.id AND m3.status = 'active'
      ) AS member_count
    FROM coop_seasons s
    JOIN coop_members m ON m.season_id = s.id
    WHERE m.user_id = v_uid AND m.status = 'active'
  ) t;

  RETURN v_result;
END;
$$;

-- ── RPC: seizoensprogressie met per-lid bijdrage ───────────
-- De kern: gepoold totaal plus per kleur zichtbaar wie wat
-- bijdroeg. Alleen privacy-veilige velden verlaten de functie.
CREATE OR REPLACE FUNCTION get_coop_progress(p_season UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_season coop_seasons%ROWTYPE;
  v_members JSONB;
  v_pooled INT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF NOT is_coop_member(p_season, v_uid) THEN
    RAISE EXCEPTION 'not_a_member';
  END IF;

  SELECT * INTO v_season FROM coop_seasons WHERE id = p_season;

  SELECT
    COALESCE(jsonb_agg(row_to_json(t)::jsonb ORDER BY t.joined_at), '[]'::jsonb),
    COALESCE(SUM(t.moved_days), 0)
  INTO v_members, v_pooled
  FROM (
    SELECT
      m.color,
      m.display_name,
      m.joined_at,
      (m.user_id = v_uid) AS is_me,
      (
        SELECT count(DISTINCT a.activity_date)
        FROM activities a
        WHERE a.user_id = m.user_id
          AND a.activity_type = 'training'
          AND a.activity_date BETWEEN v_season.start_date AND v_season.end_date
      ) AS moved_days,
      EXISTS (
        SELECT 1 FROM activities a2
        WHERE a2.user_id = m.user_id
          AND a2.activity_type = 'training'
          AND a2.activity_date = CURRENT_DATE
      ) AS moved_today
    FROM coop_members m
    WHERE m.season_id = p_season AND m.status = 'active'
  ) t;

  RETURN jsonb_build_object(
    'season_id', v_season.id,
    'name', v_season.name,
    'goal_days', v_season.goal_days,
    'start_date', v_season.start_date,
    'end_date', v_season.end_date,
    'status', v_season.status,
    'days_left', GREATEST(0, (v_season.end_date - CURRENT_DATE)),
    'pooled_total', v_pooled,
    'members', v_members
  );
END;
$$;

-- ── Grants ─────────────────────────────────────────────────
-- Postgres geeft nieuwe functies standaard EXECUTE aan PUBLIC,
-- dus ook aan anon. Voor een privacy-first project trekken we dat
-- eerst in en geven daarna alleen authenticated toegang. De RPCs
-- draaien als definer en bewaken zelf auth.uid() plus lidmaatschap.
REVOKE EXECUTE ON FUNCTION create_coop_season(TEXT, INT, DATE, DATE, TEXT, TEXT, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_coop_invite(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION get_coop_invite(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION join_coop_season(TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION get_my_coop_seasons() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION get_coop_progress(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION is_coop_member(UUID, UUID) FROM PUBLIC;

-- Supabase geeft anon via default privileges ook EXECUTE; die trekken we expliciet in.
REVOKE EXECUTE ON FUNCTION create_coop_season(TEXT, INT, DATE, DATE, TEXT, TEXT, UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION create_coop_invite(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION get_coop_invite(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION join_coop_season(TEXT, TEXT, TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION get_my_coop_seasons() FROM anon;
REVOKE EXECUTE ON FUNCTION get_coop_progress(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION is_coop_member(UUID, UUID) FROM anon;

GRANT EXECUTE ON FUNCTION create_coop_season(TEXT, INT, DATE, DATE, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_coop_invite(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_coop_invite(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION join_coop_season(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_coop_seasons() TO authenticated;
GRANT EXECUTE ON FUNCTION get_coop_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_coop_member(UUID, UUID) TO authenticated;
