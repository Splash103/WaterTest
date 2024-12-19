-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Anyone can join game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Host can update their game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Anyone can view game players" ON game_players;
DROP POLICY IF EXISTS "Players can join games" ON game_players;
DROP POLICY IF EXISTS "Players can update their status" ON game_players;

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active game sessions"
    ON game_sessions FOR SELECT
    USING (status != 'finished');

CREATE POLICY "Anyone can join game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Host can update their game sessions"
    ON game_sessions FOR UPDATE
    USING (true);

CREATE POLICY "Anyone can view game players"
    ON game_players FOR SELECT
    USING (true);

CREATE POLICY "Players can join games"
    ON game_players FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Players can update their status"
    ON game_players FOR UPDATE
    USING (true);