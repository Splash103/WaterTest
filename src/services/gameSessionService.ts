import { supabase } from './supabase';
import type { GameSession, GamePlayer } from '../types/game';

export async function createGameSession(hostId: string, settings: any): Promise<GameSession> {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({
      host_id: hostId,
      settings,
      status: 'waiting'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinGameSession(sessionId: string, playerId: string): Promise<GamePlayer> {
  const { data, error } = await supabase
    .from('game_players')
    .insert({
      session_id: sessionId,
      player_id: playerId,
      status: 'ready'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveSessions(): Promise<GameSession[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      *,
      game_players (
        player_id,
        status,
        score
      )
    `)
    .eq('status', 'waiting')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateSessionStatus(
  sessionId: string,
  status: 'waiting' | 'playing' | 'finished'
): Promise<void> {
  const { error } = await supabase
    .from('game_sessions')
    .update({ status })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function updatePlayerStatus(
  sessionId: string,
  playerId: string,
  status: 'ready' | 'playing' | 'disconnected'
): Promise<void> {
  const { error } = await supabase
    .from('game_players')
    .update({ 
      status,
      last_action_at: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .eq('player_id', playerId);

  if (error) throw error;
}