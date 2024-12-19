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

    const { roomId, hostName, roomData } = JSON.parse(event.body);

    // Create room with the correct schema
    const { data: room, error: dbError } = await supabase
      .from('rooms')
      .insert({
        id: roomId,
        host: roomData.host,
        player_count: 1,
        max_players: roomData.settings.maxPlayers,
        settings: roomData.settings,
        players: roomData.players,
        status: 'waiting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        roomId,
        roomData: room
      })
    };
  } catch (error) {
    console.error('Error in create-room:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create room',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};