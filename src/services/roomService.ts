import { nanoid } from 'nanoid';
import { supabase } from './supabase';
import { seaAnimals } from '../utils/seaAnimals';
import type { Room, Player, LobbySettings } from './roomTypes';
import { DEFAULT_LOBBY_SETTINGS } from './roomTypes';

const getRandomSeaAnimal = () => {
  return seaAnimals[Math.floor(Math.random() * seaAnimals.length)];
};

export const createRoom = async (hostName: string): Promise<{ roomId: string; roomData: Room }> => {
  try {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const hostPlayer: Player = {
      id: nanoid(),
      name: hostName,
      avatar: getRandomSeaAnimal(),
      score: 0,
      bubbles: 3,
      isHost: true
    };
    
    const roomData = {
      id: roomId,
      host: hostPlayer.id,
      player_count: 1,
      max_players: DEFAULT_LOBBY_SETTINGS.maxPlayers,
      settings: DEFAULT_LOBBY_SETTINGS,
      players: [hostPlayer],
      status: 'waiting',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdRoom, error } = await supabase
      .from('rooms')
      .insert(roomData)
      .select()
      .single();

    if (error) throw error;

    return { roomId, roomData: createdRoom };
  } catch (error) {
    console.error('Error in createRoom:', error);
    throw error;
  }
};

export const joinRoom = async (roomId: string, playerName: string): Promise<Room> => {
  try {
    const newPlayer: Player = {
      id: nanoid(),
      name: playerName,
      avatar: getRandomSeaAnimal(),
      score: 0,
      bubbles: 3,
      isHost: false
    };

    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .eq('status', 'waiting')
      .single();

    if (fetchError || !room) {
      throw new Error('Room not found');
    }

    if (room.player_count >= room.max_players) {
      throw new Error('Room is full');
    }

    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        players: [...room.players, newPlayer],
        player_count: room.player_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedRoom;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

export const updateRoomSettings = async (
  roomId: string,
  settings: Partial<LobbySettings>
): Promise<Room> => {
  try {
    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (fetchError || !room) {
      throw new Error('Room not found');
    }

    const updatedSettings = {
      ...room.settings,
      ...settings
    };

    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        settings: updatedSettings,
        max_players: settings.maxPlayers || room.max_players,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedRoom;
  } catch (error) {
    console.error('Error updating room settings:', error);
    throw error;
  }
};

export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};