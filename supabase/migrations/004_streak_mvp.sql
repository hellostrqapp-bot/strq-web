-- ============================================================
-- Migration 004: Streak Loop MVP
-- Core tables for the strQ streak-loop game mechanic
-- Privacy: only boolean (trained yes/no), type, optional intensity
-- No GPS, heart rate, or location data
-- ============================================================

-- ── User Profiles ──────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  locale TEXT DEFAULT 'nl',
  sport_type TEXT DEFAULT 'hyrox',
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, locale)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'locale', 'nl'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Activities ─────────────────────────────────────────────
-- Core table: did you train today? That's all we need.
-- Privacy: no GPS, no heartrate, no route data.
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'training',
    -- 'training' = active session
    -- 'rest' = intentional rest day (doesn't break streak)
  intensity TEXT,
    -- optional: 'light', 'moderate', 'hard'
    -- only stored if user voluntarily provides it
  source TEXT DEFAULT 'manual',
    -- 'manual' = button press (MVP)
    -- 'strava' = API import (v2)
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_activities_user_date
  ON activities(user_id, activity_date DESC);

-- ── Streak State ───────────────────────────────────────────
-- Materialized streak counter for performance at scale.
-- Recalculated on each activity, not queried from activities table.
CREATE TABLE IF NOT EXISTS streak_state (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_multiplier NUMERIC(3,1) DEFAULT 1.0,
    -- 1.0 = normal, 2.0 = after 3+ days streak
  total_xp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE streak_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak"
  ON streak_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streak"
  ON streak_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streak"
  ON streak_state FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── XP Log ─────────────────────────────────────────────────
-- Audit trail for all XP earned. Transparent per DSA requirement.
CREATE TABLE IF NOT EXISTS xp_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
    -- 'activity' = base XP for logging activity
    -- 'streak_bonus' = bonus for streak continuation
    -- 'multiplier' = 2x bonus after 3+ days
    -- 'surprise' = random surprise bonus (Daily Reveal)
    -- 'fuzzy_bonus' = warm bonus for hitting event target
  activity_date DATE,
  metadata JSONB,
    -- flexible: { surprise_type: 'confetti', multiplier: 2.0, etc. }
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp"
  ON xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp"
  ON xp_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_xp_user_date
  ON xp_log(user_id, created_at DESC);

-- ── Events ─────────────────────────────────────────────────
-- Target races/events with countdown and optional target time.
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  sport_type TEXT DEFAULT 'hyrox',
  target_time_minutes INT,
    -- optional: user's goal time in minutes
  result_time_minutes INT,
    -- filled post-race
  status TEXT DEFAULT 'upcoming',
    -- 'upcoming', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events"
  ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events"
  ON events FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_events_user_date
  ON events(user_id, event_date);

-- ── Daily Reveals ──────────────────────────────────────────
-- Tracks the "open the app to see what you earned" mechanic.
-- Activity is processed ONLY when user opens the app (micro-moment).
CREATE TABLE IF NOT EXISTS daily_reveals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reveal_date DATE NOT NULL,
  revealed BOOLEAN DEFAULT false,
  base_xp INT DEFAULT 0,
  bonus_xp INT DEFAULT 0,
  surprise_type TEXT,
    -- null = no surprise, or: 'bonus_xp', 'streak_shield', 'confetti'
  surprise_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  revealed_at TIMESTAMPTZ,
  UNIQUE(user_id, reveal_date)
);

ALTER TABLE daily_reveals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reveals"
  ON daily_reveals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reveals"
  ON daily_reveals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reveals"
  ON daily_reveals FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_reveals_user_date
  ON daily_reveals(user_id, reveal_date DESC);

-- ── Auto-create streak_state on profile creation ───────────
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO streak_state (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();
