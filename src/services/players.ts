import { supabase } from './supabase';
import { nanoid } from 'nanoid';
import type { SeaAnimal } from '../utils/seaAnimals';

export interface OnlinePlayer {
  id: string;
  name: string;
  avatar: SeaAnimal;
  status: 'online' | 'in_game' | 'idle';
  last_seen: string;
}

export const trackPlayerOnline = async (name: string, avatar: SeaAnimal): Promise<void> => {
  try {
    const playerId = nanoid();
    
    // First try to delete any existing entries for this player
    await supabase
      .from('online_players')
      .delete()
      .eq('name', name);

    // Then insert the new entry
    const { error } = await supabase
      .from('online_players')
      .insert({
        id: playerId,
        name,
        avatar,
        status: 'online',
        last_seen: new Date().toISOString()
      });

    if (error) {
      console.error('Error inserting player:', error);
      return;
    }

    // Set up interval to update last_seen
    const interval = setInterval(async () => {
      const { error: updateError } = await supabase
        .from('online_players')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', playerId);

      if (updateError) console.error('Error updating last_seen:', updateError);
    }, 30000);

    // Clean up on window close
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
      // Don't wait for the delete operation
      supabase
        .from('online_players')
        .delete()
        .eq('id', playerId)
        .then(() => console.log('Player removed'))
        .catch(err => console.error('Error removing player:', err));
    });

  } catch (error) {
    console.error('Error tracking player online:', error);
  }
};

export const getOnlinePlayers = async (): Promise<OnlinePlayer[]> => {
  try {
    const { data, error } = await supabase
      .from('online_players')
      .select('*')
      .order('last_seen', { ascending: false });

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting online players:', error);
    return [];
  }
};

export const updatePlayerStatus = async (
  playerId: string, 
  status: OnlinePlayer['status']
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('online_players')
      .update({ 
        status,
        last_seen: new Date().toISOString()
      })
      .eq('id', playerId);

    if (error) {
      console.error('Error updating status:', error);
    }
  } catch (error) {
    console.error('Error updating player status:', error);
  }
};