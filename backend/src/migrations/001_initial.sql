-- World Cup 2026 — Initial schema
-- Run: psql -d worldcup2026 -f 001_initial.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- === users ===
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- === refresh_tokens ===
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(512) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens (token);

-- === teams ===
CREATE TABLE IF NOT EXISTS teams (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(3) NOT NULL UNIQUE,
    flag_url    VARCHAR(512),
    group_name  VARCHAR(1),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === players ===
CREATE TABLE IF NOT EXISTS players (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id       UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name          VARCHAR(100) NOT NULL,
    position      VARCHAR(10),
    jersey_number INTEGER,
    photo_url     VARCHAR(512),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_players_team ON players (team_id);

-- === matches ===
DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('SCHEDULED','LIVE','HALFTIME','FINISHED','POSTPONED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE match_stage AS ENUM ('GROUP_STAGE','ROUND_OF_16','QUARTER_FINAL','SEMI_FINAL','THIRD_PLACE','FINAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS matches (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_team_id  UUID NOT NULL REFERENCES teams(id),
    away_team_id  UUID NOT NULL REFERENCES teams(id),
    datetime      TIMESTAMPTZ NOT NULL,
    status        match_status NOT NULL DEFAULT 'SCHEDULED',
    stage         match_stage NOT NULL,
    venue         VARCHAR(200),
    home_score    INTEGER,
    away_score    INTEGER,
    group_name    VARCHAR(1),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_matches_datetime ON matches (datetime);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON matches (stage);

-- === goals ===
DO $$ BEGIN
    CREATE TYPE goal_type AS ENUM ('GOAL','OWN_GOAL','PENALTY','FREE_KICK','HEADER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS goals (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id   UUID REFERENCES players(id),
    team_id     UUID NOT NULL REFERENCES teams(id),
    minute      INTEGER NOT NULL,
    type        goal_type NOT NULL DEFAULT 'GOAL',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_goals_match ON goals (match_id);

-- === lineups ===
CREATE TABLE IF NOT EXISTS lineups (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id     UUID NOT NULL REFERENCES teams(id),
    player_id   UUID NOT NULL REFERENCES players(id),
    is_starting BOOLEAN NOT NULL DEFAULT TRUE,
    position    VARCHAR(10)
);
CREATE INDEX IF NOT EXISTS idx_lineups_match ON lineups (match_id);
CREATE INDEX IF NOT EXISTS idx_lineups_match_team ON lineups (match_id, team_id);

-- === commentaries ===
DO $$ BEGIN
    CREATE TYPE commentary_type AS ENUM ('COMMENTARY','GOAL','YELLOW_CARD','RED_CARD','SUBSTITUTION','HALFTIME','FULLTIME');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS commentaries (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    minute      INTEGER NOT NULL,
    text        TEXT NOT NULL,
    type        commentary_type NOT NULL DEFAULT 'COMMENTARY',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_commentaries_match ON commentaries (match_id);

-- === chat_messages ===
CREATE TABLE IF NOT EXISTS chat_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_match ON chat_messages (match_id, created_at DESC);

-- === notifications ===
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('GENERAL','MATCH_REMINDER','GOAL_ALERT','LINEUP_ANNOUNCED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    body        TEXT,
    type        notification_type NOT NULL DEFAULT 'GENERAL',
    read        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, created_at DESC);

-- === fcm_tokens ===
CREATE TABLE IF NOT EXISTS fcm_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(512) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fcm_user ON fcm_tokens (user_id);
