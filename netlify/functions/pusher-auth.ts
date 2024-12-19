import { Handler } from '@netlify/functions';
import Pusher from 'pusher';

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

    console.log('Authenticating Pusher connection...');

    const { socket_id, channel_name } = JSON.parse(event.body);

    // Generate auth response for presence channels
    const authResponse = pusher.authorizeChannel(socket_id, channel_name);

    console.log('Auth response generated:', authResponse);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(authResponse)
    };
  } catch (error) {
    console.error('Error in pusher-auth:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to authenticate',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};