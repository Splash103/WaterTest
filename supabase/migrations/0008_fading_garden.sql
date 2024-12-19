/*
  # Create multiplayer game tables

  1. New Tables
    - `game_rooms` - Stores active game rooms
      - `id` (text, primary key) - Room code
      - `host_id` (text) - Host player ID
      - `settings` (jsonb) - Room settings
      - `status` (text) - Room status
      - `players` (jsonb) - Array of players
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `online_players` - Tracks online players
      - `id` (text, primary key) - Player ID
      - `name` (text) - Player name
      - `avatar` (jsonb) - Player avatar
      - `status` (text) - Player status
      - `last_seen` (timestamptz)
      - `room_id` (text) - Current room ID
  
  2. Functions
    - Auto-update timestamps
    - Cleanup old rooms and inactive players
  
  3. Policies
    - Allow public read/write access with proper constraints
*/

-- Create game_rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
    id TEXT PRIMARY KEY,
    host_id TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{"maxPlayers": 4, "difficulty": "normal", "turnTimeLimit": 30}'::jsonb,
    status TEXT NOT NULL DEFAULT 'waiting',
    players JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create online_players table
CREATE TABLE IF NOT EXISTS online_players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('online', 'in_game', 'idle')),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    room_id TEXT REFERENCES game_rooms(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_host ON game_rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_online_players_status ON online_players(status);
CREATE INDEX IF NOT EXISTS idx_online_players_last_seen ON online_players(last_seen);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
DROP TRIGGER IF EXISTS update_game_rooms_timestamp ON game_rooms;
CREATE TRIGGER update_game_rooms_timestamp
    BEFORE UPDATE ON game_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Create cleanup function for inactive players and rooms
CREATE OR REPLACE FUNCTION cleanup_inactive()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete inactive players (not seen in last 2 minutes)
    DELETE FROM online_players
    WHERE last_seen < now() - INTERVAL '2 minutes';
    
    -- Delete old rooms (created more than 24 hours ago)
    DELETE FROM game_rooms
    WHERE created_at < now() - INTERVAL '24 hours'
    OR (status = 'waiting' AND updated_at < now() - INTERVAL '1 hour');
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create cleanup trigger
DROP TRIGGER IF EXISTS cleanup_trigger ON online_players;
CREATE TRIGGER cleanup_trigger
    AFTER INSERT ON online_players
    EXECUTE FUNCTION cleanup_inactive();

-- Enable RLS
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_players ENABLE ROW LEVEL SECURITY;

-- Create policies for game_rooms
CREATE POLICY "Enable read access for all users" ON game_rooms
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON game_rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for room host" ON game_rooms
    FOR UPDATE USING (auth.uid()::text = host_id);

CREATE POLICY "Enable delete for room host" ON game_rooms
    FOR DELETE USING (auth.uid()::text = host_id);

-- Create policies for online_players
CREATE POLICY "Enable read access for all users" ON online_players
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON online_players
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for own profile" ON online_players
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Enable delete for own profile" ON online_players
    FOR DELETE USING (auth.uid()::text = id);