import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty } from '../utils/difficulty';
import type { Room } from '../types/game';
import type { SeaAnimal } from '../utils/seaAnimals';
import { trackPlayerOnline, updatePlayerStatus } from '../services/players';
import { createRoom, joinRoom } from '../services/multiplayer';

interface Profile {
  id: string;
  name: string;
  avatar: SeaAnimal;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: string;
  date: number;
}

interface GameState {
  gameMode: 'menu' | 'single' | 'multi' | 'playing' | 'leaderboard';
  difficulty: Difficulty;
  profile: Profile | null;
  room: Room | null;
  leaderboard: LeaderboardEntry[];
  setGameMode: (mode: GameState['gameMode']) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  updateProfile: (profile: Omit<Profile, 'id'>) => void;
  addToLeaderboard: (entry: Omit<LeaderboardEntry, 'date'>) => void;
  createRoom: (hostName: string) => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  leaveRoom: (roomId: string, playerId: string) => void;
  initializeOnlineTracking: () => void;
  updateStatus: (status: 'online' | 'in_game' | 'idle') => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameMode: 'menu',
      difficulty: 'normal',
      profile: null,
      room: null,
      leaderboard: [],
      setGameMode: (mode) => set({ gameMode: mode }),
      setDifficulty: (difficulty) => set({ difficulty }),
      updateProfile: (profileData) => {
        const id = get().profile?.id || Math.random().toString(36).slice(2);
        set({ profile: { ...profileData, id } });
      },
      addToLeaderboard: (entry) => {
        set((state) => ({
          leaderboard: [...state.leaderboard, { ...entry, date: Date.now() }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
        }));
      },
      createRoom: async (hostName) => {
        try {
          const { roomData } = await createRoom(hostName);
          set({ room: roomData });
        } catch (error) {
          console.error('Error creating room:', error);
          throw error;
        }
      },
      joinRoom: async (roomId, playerName) => {
        try {
          const roomData = await joinRoom(roomId, playerName);
          set({ room: roomData });
        } catch (error) {
          console.error('Error joining room:', error);
          throw error;
        }
      },
      leaveRoom: (roomId, playerId) => {
        set({ room: null });
        fetch('/.netlify/functions/leave-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, playerId })
        }).catch(console.error);
      },
      initializeOnlineTracking: () => {
        const profile = get().profile;
        if (profile) {
          trackPlayerOnline(profile.name, profile.avatar);
        }
      },
      updateStatus: (status) => {
        const profile = get().profile;
        if (profile) {
          updatePlayerStatus(profile.id, status);
        }
      }
    }),
    {
      name: 'word-flood-storage',
      version: 1
    }
  )
);