-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_game_session_timestamp ON game_sessions;
DROP TRIGGER IF EXISTS cleanup_old_game_sessions ON game_sessions;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_game_session_timestamp();
DROP FUNCTION IF EXISTS cleanup_old_game_sessions();

-- Function to update game session timestamps
CREATE OR REPLACE FUNCTION update_game_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
CREATE TRIGGER update_game_session_timestamp
    BEFORE UPDATE ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_game_session_timestamp();

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_old_game_sessions()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM game_sessions
    WHERE updated_at < now() - INTERVAL '24 hours'
    OR (status = 'waiting' AND updated_at < now() - INTERVAL '1 hour');
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cleanup
CREATE TRIGGER cleanup_old_game_sessions
    AFTER INSERT ON game_sessions
    EXECUTE FUNCTION cleanup_old_game_sessions();