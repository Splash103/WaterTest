-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    status game_status DEFAULT 'waiting',
    host_id UUID NOT NULL,
    settings JSONB DEFAULT '{"maxPlayers": 4, "difficulty": "normal", "turnTimeLimit": 30}'::jsonb,
    current_round INTEGER DEFAULT 0,
    max_rounds INTEGER DEFAULT 10
);

-- Create game_players table
CREATE TABLE IF NOT EXISTS game_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT now(),
    score INTEGER DEFAULT 0,
    status player_status DEFAULT 'ready',
    last_action_at TIMESTAMPTZ DEFAULT now()
);