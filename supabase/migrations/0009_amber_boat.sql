/*
  # Create game storage tables

  1. New Tables
    - `game_scores` - Stores player scores and achievements
    - `game_words` - Stores valid words and their metadata
  
  2. Indexes
    - For efficient querying of scores and words
  
  3. Policies
    - Allow appropriate access with RLS
*/

-- Create game_scores table
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id TEXT REFERENCES online_players(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    difficulty TEXT NOT NULL,
    words_found TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create game_words table
CREATE TABLE IF NOT EXISTS game_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word TEXT NOT NULL UNIQUE,
    points INTEGER NOT NULL DEFAULT 0,
    difficulty TEXT NOT NULL,
    times_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_scores_player ON game_scores(player_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_words_word ON game_words(word);
CREATE INDEX IF NOT EXISTS idx_game_words_points ON game_words(points);

-- Enable RLS
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_words ENABLE ROW LEVEL SECURITY;

-- Create policies for game_scores
CREATE POLICY "Enable read access for all users" ON game_scores
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON game_scores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for own scores" ON game_scores
    FOR UPDATE USING (player_id = current_user);

-- Create policies for game_words
CREATE POLICY "Enable read access for all users" ON game_words
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON game_words
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON game_words
    FOR UPDATE USING (true);