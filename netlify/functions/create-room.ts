import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Pusher from 'pusher';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { roomId, hostName, roomData } = JSON.parse(event.body);

    // Insert room into Supabase
    const { data: room, error: dbError } = await supabase
      .from('rooms')
      .insert({
        id: roomId,
        host: hostName,
        player_count: 1,
        max_players: roomData.settings.maxPlayers,
        settings: roomData.settings,
        players: [roomData.players[0]]
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Trigger Pusher event for real-time updates
    await pusher.trigger(`room-${roomId}`, 'room-created', room);

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