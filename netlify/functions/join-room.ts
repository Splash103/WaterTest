import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { roomId, player } = JSON.parse(event.body);

    // Get the room
    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (fetchError || !room) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Room not found' })
      };
    }

    // Check if room is full
    if (room.player_count >= room.max_players) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Room is full' })
      };
    }

    // Add player to room
    const updatedPlayers = [...room.players, player];
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        players: updatedPlayers,
        player_count: room.player_count + 1
      })
      .eq('id', roomId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        roomData: updatedRoom
      })
    };
  } catch (error) {
    console.error('Error in join-room:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to join room',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};