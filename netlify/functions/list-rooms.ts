import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Fetching rooms from Supabase...');

    // Get active rooms from the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 7200000).toISOString();
    
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .gte('created_at', twoHoursAgo)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`Successfully fetched ${rooms?.length || 0} rooms`);

    // Filter out rooms that are full
    const availableRooms = rooms?.filter(room => room.player_count < room.max_players) || [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rooms: availableRooms
      })
    };
  } catch (error) {
    console.error('Error in list-rooms:', error);
    
    // Return a more detailed error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to list rooms',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};