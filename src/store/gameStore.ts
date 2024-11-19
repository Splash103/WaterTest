import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackPlayerOnline, updatePlayerStatus } from '../services/players';
import { Difficulty } from '../utils/difficulty';
import { SeaAnimal } from '../utils/seaAnimals';
import { nanoid } from 'nanoid';
import { createRoom as createMultiplayerRoom, joinRoom as joinMultiplayerRoom } from '../services/multiplayer';

interface GameState {
  gameMode: 'menu' | 'single' | 'multi' | 'playing' | 'leaderboard';
  difficulty: Difficulty;
  profile: {
    id: string;
    name: string;
    avatar: SeaAnimal;
  } | null;
  room: any | null;
  playerId: string | null;

  setGameMode: (mode: 'menu' | 'single' | 'multi' | 'playing' | 'leaderboard') => void;
  setDifficulty: (difficulty: Difficulty) => void;
  updateProfile: (profile: Omit<GameState['profile'], 'id'>) => void;
  setPlayerId: (id: string) => void;
  createRoom: (hostName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  leaveRoom: (roomId: string, playerId: string) => void;
  initializeOnlineTracking: () => Promise<void>;
  updateStatus: (status: 'online' | 'in_game' | 'idle') => Promise<void>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameMode: 'menu',
      difficulty: 'normal',
      profile: null,
      room: null,
      playerId: null,

      setGameMode: (mode) => set({ gameMode: mode }),
      setDifficulty: (difficulty) => set({ difficulty }),
      updateProfile: (profileData) => set({ 
        profile: { 
          ...profileData, 
          id: nanoid() 
        } 
      }),
      setPlayerId: (id) => set({ playerId: id }),

      createRoom: async (hostName) => {
        try {
          const { roomId, roomData } = await createMultiplayerRoom(hostName);
          set({ room: roomData });
          return roomId;
        } catch (error) {
          console.error('Error creating room:', error);
          throw error;
        }
      },

      joinRoom: async (roomId, playerName) => {
        try {
          const roomData = await joinMultiplayerRoom(roomId, playerName);
          set({ room: roomData });
        } catch (error) {
          console.error('Error joining room:', error);
          throw error;
        }
      },

      leaveRoom: (roomId, playerId) => {
        set({ room: null });
      },

      initializeOnlineTracking: async () => {
        const { profile } = get();
        if (!profile) return;

        try {
          await trackPlayerOnline(profile.name, profile.avatar);
        } catch (error) {
          console.error('Failed to initialize online tracking:', error);
        }
      },

      updateStatus: async (status) => {
        const { playerId } = get();
        if (!playerId) return;

        try {
          await updatePlayerStatus(playerId, status);
        } catch (error) {
          console.error('Failed to update player status:', error);
        }
      }
    }),
    {
      name: 'word-flood-storage',
      version: 1
    }
  )
);