-- Create enum types for game and player status
DO $$ BEGIN
    CREATE TYPE game_status AS ENUM ('waiting', 'playing', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE player_status AS ENUM ('ready', 'playing', 'disconnected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;