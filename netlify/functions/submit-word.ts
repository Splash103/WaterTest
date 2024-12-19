import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Pusher from 'pusher';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { roomId, word, playerId, score, nextPlayerId } = JSON.parse(event.body);

    // Get current room data
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

    // Update player scores
    const updatedPlayers = room.players.map((player: any) => {
      if (player.id === playerId) {
        return {
          ...player,
          score: (player.score || 0) + score
        };
      }
      return player;
    });

    // Update room data
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        players: updatedPlayers
      })
      .eq('id', roomId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Notify all players through Pusher
    await pusher.trigger(`game-${roomId}`, 'word-submitted', {
      word,
      score,
      playerId,
      nextPlayer: nextPlayerId,
      players: updatedPlayers
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        roomData: updatedRoom
      })
    };
  } catch (error) {
    console.error('Error in submit-word:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to submit word',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};