import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://lycisjhznugvzhdfshuu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Y2lzamh6bnVndnpoZGZzaHV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTk5MjczOCwiZXhwIjoyMDQ3NTY4NzM4fQ.1kVlDP9kjeT9hx2dC2duzke-0J7p1DIFcOU14Pt4pGo'
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
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      })
    };
  }

  try {
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

    // Filter available rooms
    const availableRooms = (rooms || []).filter(room => 
      room.player_count < room.max_players
    );

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to list rooms',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};