import { Handler } from '@netlify/functions';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1897426',
  key: '4f01dcaa6c0557231477',
  secret: 'c839e2468fd0edcda4f9',
  cluster: 'us2',
  useTLS: true,
});

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Received leave room request:', event.body);
    
    if (!event.body) {
      throw new Error('No request body provided');
    }

    const { roomId, playerId } = JSON.parse(event.body);

    if (!roomId || !playerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    console.log(`Player ${playerId} leaving room ${roomId}`);

    // Trigger player left event
    await pusher.trigger(`room-${roomId}`, 'player-left', { playerId });
    console.log('Successfully triggered player-left event');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: `Player ${playerId} successfully left room ${roomId}`
      })
    };
  } catch (error) {
    console.error('Error in leave-room function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to leave room',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};