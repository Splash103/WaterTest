/*
  # Add chat system

  1. New Tables
    - `chat_messages` - Stores chat messages for multiplayer rooms
  
  2. Indexes
    - For efficient message retrieval
  
  3. Policies
    - Allow appropriate access with RLS
*/

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT REFERENCES game_rooms(id) ON DELETE CASCADE,
    player_id TEXT REFERENCES online_players(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'system', 'game')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for room participants" ON chat_messages
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM online_players 
        WHERE id = auth.uid()::text 
        AND room_id = chat_messages.room_id
    ));

CREATE POLICY "Enable insert for room participants" ON chat_messages
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM online_players 
        WHERE id = auth.uid()::text 
        AND room_id = chat_messages.room_id
    ));