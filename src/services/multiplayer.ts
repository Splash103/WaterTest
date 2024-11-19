import PusherClient from 'pusher-js';
import { nanoid } from 'nanoid';
import { seaAnimals } from '../utils/seaAnimals';
import type { Room, LobbySettings, Player } from '../types/game';
import { supabase } from './supabase';

// Initialize Pusher with auth endpoint
const pusher = new PusherClient('4f01dcaa6c0557231477', {
  cluster: 'us2',
  authEndpoint: '/.netlify/functions/pusher-auth'
});

// Check if we're in development mode
const isDev = import.meta.env.DEV;

const DEFAULT_LOBBY_SETTINGS: LobbySettings = {
  maxPlayers: 4,
  difficulty: 'normal',
  turnTimeLimit: 30
};

export const createRoom = async (hostName: string): Promise<{ roomId: string; roomData: Room }> => {
  if (isDev) {
    throw new Error('DEVELOPMENT_MODE');
  }

  try {
    // Generate a room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create initial player data
    const hostPlayer = {
      id: nanoid(),
      name: hostName,
      avatar: seaAnimals[Math.floor(Math.random() * seaAnimals.length)],
      score: 0,
      bubbles: 3,
      isHost: true
    };
    
    // Create room data
    const roomData = {
      id: roomId,
      host: hostPlayer.id,
      players: [hostPlayer],
      settings: DEFAULT_LOBBY_SETTINGS,
      isPlaying: false,
      player_count: 1,
      max_players: DEFAULT_LOBBY_SETTINGS.maxPlayers
    };

    // Call the Netlify function to create the room
    const response = await fetch('/.netlify/functions/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, hostName, roomData })
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    const data = await response.json();

    // Subscribe to room updates
    const channel = pusher.subscribe(`room-${roomId}`);
    channel.bind('room-updated', (updatedRoom: Room) => {
      // Update local room state through Supabase
      supabase
        .from('rooms')
        .update(updatedRoom)
        .eq('id', roomId)
        .then(() => console.log('Room updated locally'));
    });

    return { roomId, roomData: data.roomData };
  } catch (error) {
    console.error('Error in createRoom:', error);
    throw error;
  }
};

export const joinRoom = async (roomId: string, playerName: string): Promise<Room> => {
  if (isDev) {
    throw new Error('DEVELOPMENT_MODE');
  }

  try {
    const newPlayer = {
      id: nanoid(),
      name: playerName,
      avatar: seaAnimals[Math.floor(Math.random() * seaAnimals.length)],
      score: 0,
      bubbles: 3,
      isHost: false
    };

    const response = await fetch('/.netlify/functions/join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        playerName,
        player: newPlayer
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join room');
    }

    const { roomData } = await response.json();

    // Subscribe to room updates
    const channel = pusher.subscribe(`room-${roomId}`);
    channel.bind('room-updated', (updatedRoom: Room) => {
      // Update local room state through Supabase
      supabase
        .from('rooms')
        .update(updatedRoom)
        .eq('id', roomId)
        .then(() => console.log('Room updated locally'));
    });

    return roomData;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

export const updateRoomSettings = async (
  roomId: string,
  settings: Partial<LobbySettings>
): Promise<void> => {
  if (isDev) return;

  try {
    const response = await fetch('/.netlify/functions/update-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, settings })
    });

    if (!response.ok) {
      throw new Error('Failed to update room settings');
    }

    // Trigger Pusher event to notify other players
    const channel = pusher.subscribe(`room-${roomId}`);
    channel.trigger('client-settings-updated', settings);
  } catch (error) {
    console.error('Error updating room settings:', error);
    throw error;
  }
};

export const startGame = async (roomId: string): Promise<void> => {
  if (isDev) return;

  try {
    const response = await fetch('/.netlify/functions/update-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        roomId, 
        updates: { isPlaying: true }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to start game');
    }

    // Trigger Pusher event to notify other players
    const channel = pusher.subscribe(`room-${roomId}`);
    channel.trigger('client-game-started', {});
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};