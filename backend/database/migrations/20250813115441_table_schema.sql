-- +goose Up
-- +goose StatementBegin


-- USERS Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Change Later
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RATING Table
CREATE TABLE ratings (
    user_id UUID NOT NULL REFERENCES users(id) on DELETE CASCADE,
    mmr INT not Null,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

-- MATCHES table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region TEXT NOT NULL,
    mode TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    winner UUID REFERENCES users(id)
);

-- QUEUE_TICKETS Table 
CREATE TABLE queue_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_guest BOOLEAN NOT NULL,
    region TEXT NOT NULL,
    mode TEXT NOT NULL,
    mmr_snapshot INT NOT NULL,
    prefs JSONB,
    status TEXT CHECK (status IN ('queued','matched','cancelled','expired')),
    queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dequeued_at TIMESTAMPTZ,
    matched_match_id UUID REFERENCES matches(id)
);



-- MATCH_PARTICIPANTS table
CREATE TABLE match_participants (
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seat INT NOT NULL,
    PRIMARY KEY (match_id, user_id)
);

-- GAME_RESULTS table
CREATE TABLE game_results (
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    game_no INT NOT NULL,
    game_id TEXT NOT NULL,
    winner UUID REFERENCES users(id),
    meta JSONB,
    PRIMARY KEY (match_id, game_no)
);

-- MMR_HISTORY table
CREATE TABLE mmr_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    old_mmr INT NOT NULL,
    new_mmr INT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS mmr_history;
DROP TABLE IF EXISTS game_results;
DROP TABLE IF EXISTS match_participants;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS queue_tickets;
DROP TABLE IF EXISTS ngs;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
